import moment from 'moment';
import momentFquarter from 'moment-fquarter';

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
        key: 'this_week',
        label: 'this week',
        dates() {
          return {
            start: moment().startOf('week'),
            end: moment().endOf('week'),
          };
        },
      },
      {
        key: 'last_week',
        label: 'last week',
        dates() {
          return {
            start: moment().subtract(1, 'weeks').startOf('week'),
            end: moment().subtract(1, 'weeks').endOf('week'),
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
        key: 'this_month',
        label: 'this month',
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
      {
        key: 'this_quarter',
        label: 'this quarter',
        dates() {
          return {
            start: moment().startOf('quarter'),
            end: moment().endOf('quarter'),
          };
        },
      },
      {
        key: 'last_quarter',
        label: 'last quarter',
        dates() {
          return {
            start: moment().subtract(1, 'quarters').startOf('quarter'),
            end: moment().subtract(1, 'quarters').endOf('quarter'),
          };
        },
      },
      {
        key: 'this_year',
        label: 'this year',
        dates() {
          return {
            start: moment().startOf('year'),
            end: moment().endOf('year'),
          };
        },
      },
      {
        key: 'last_year',
        label: 'last year',
        dates() {
          return {
            start: moment().subtract(1, 'years').startOf('year'),
            end: moment().subtract(1, 'years').endOf('year'),
          };
        },
      },
      {
        key: 'this_financial_year',
        label: 'this financial year',
        dates: function () {
          return this.CalculateFinancialYear(moment());
        }.bind(this),
      },
      {
        key: 'last_financial_year',
        label: 'last financial year',
        dates: function () {
          return this.CalculateFinancialYear(moment().subtract(1, 'year'));
        }.bind(this),
      },
    ];
  },

  /**
   * @param {moment.Moment} currentDate
   * @returns {{start: moment.Moment, end: moment.Moment}}
   * @constructor
   */
  CalculateFinancialYear(currentDate) {
    const currentFQuarter = momentFquarter(currentDate).fquarter(7);
    const start = moment(currentDate).subtract(currentFQuarter.quarter - 1, 'quarter').startOf('quarter');
    const end = moment(currentDate).add(4 - currentFQuarter.quarter, 'quarter').endOf('quarter');
    return {start, end };
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
      const inRange = date.isSame(endDate, 'day')
        || date.isSame(startDate, 'day')
        || date.isBetween(startDate, endDate);
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
