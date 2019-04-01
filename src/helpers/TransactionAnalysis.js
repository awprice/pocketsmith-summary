import moment from 'moment';

export default {

  /**
   * @returns {{start: moment.Moment, end: moment.Moment}|*[]}
   * @constructor
   */
  GetCompareOptions() {
    return [
      {
        key: 'last_7_days',
        label: 'the last 7 days',
        dates() {
          return {
            start: moment().subtract(7, 'days'),
            end: moment(),
          };
        },
      },
      {
        key: 'last_14_days',
        label: 'the last 14 days',
        dates() {
          return {
            start: moment().subtract(14, 'days'),
            end: moment(),
          };
        },
      },
      {
        key: 'last_30_days',
        label: 'the last 30 days',
        dates() {
          return {
            start: moment().subtract(30, 'days'),
            end: moment(),
          };
        },
      },
      {
        key: 'current_month',
        label: 'the current month',
        dates() {
          return {
            start: moment().startOf('month'),
            end: moment().endOf('month'),
          };
        },
      },
      {
        key: 'last_month',
        label: 'last month',
        dates() {
          return {
            start: moment().subtract(1, 'months').startOf('month'),
            end: moment().subtract(1, 'months').endOf('month'),
          };
        },
      },
    ];
  },

  /**
   * @param key
   * @returns {moment.Moment | number | * | {start, end} | never}
   * @constructor
   */
  GetCompareDateRange(key) {
    const o = this.GetCompareOptions().find(option => option.key === key);
    return o.dates();
  },


  /**
   * @param transactions
   * @param {moment.Moment} endDate
   * @param {moment.Moment} startDate
   * @param ignorePending
   * @param ignoreTransfers
   * @returns {Array}
   * @constructor
   */
  GetCategorySummaries(transactions, endDate, startDate, ignorePending, ignoreTransfers) {
    const categoryMap = {};
    const results = [];
    transactions.filter((transaction) => {
      const date = moment(transaction.date);
      const inRange = date.isSame(endDate) || date.isBetween(startDate, endDate);
      if (!inRange) {
        return false;
      }

      // Ignore transactions with no categories
      if (transaction.category === null) {
        return false;
      }

      // Ignore pending transactions
      if (ignorePending && transaction.status === 'pending') {
        return false;
      }

      // Ignore transfers
      return !(ignoreTransfers && transaction.is_transfer);
    }).forEach((transaction) => {
      const { category } = transaction;
      if (typeof categoryMap[category.id] === 'undefined') {
        categoryMap[category.id] = {
          id: category.id,
          title: category.title,
          amount: 0,
          transactions: [],
        };
      }
      categoryMap[category.id].amount += transaction.amount;
      categoryMap[category.id].transactions.push(transaction);
    });
    Object.keys(categoryMap).forEach((categoryID) => {
      results.push(categoryMap[categoryID]);
    });
    return results;
  },

};
