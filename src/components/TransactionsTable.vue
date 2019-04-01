<template>
  <div>
    <el-table
      class="category-summary-table"
      :data="categorySummaries"
      :default-sort = "{prop: 'amount', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <category-transaction-table :transactions="props.row.transactions"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Category"
        prop="title"
        sortable
      />
      <el-table-column
        label="Amount"
        prop="amount"
        sortable
      >
        <template slot-scope="props">
          <amount :amount="props.row.amount"/>
        </template>
      </el-table-column>
      <el-table-column
        label="Percentage Change"
        sortable
      />
    </el-table>
  </div>
</template>

<script>
import gql from 'graphql-tag';
import moment from 'moment';
import get from 'lodash/get';
import { mapGetters } from 'vuex';
import TransactionAnalysis from '../helpers/TransactionAnalysis';
import CategoryTransactionTable from './CategoryTransactionsTable';
import Amount from './Amount';

export default {
  name: 'TransactionsTable',
  props: {
    endDate: {
      type: String,
      required: true,
    },
    analysisSettings: {
      type: Object,
      required: true,
    },
    ignoreTransfers: {
      type: Boolean,
      default: true,
    },
    ignorePending: {
      type: Boolean,
      default: true,
    },
  },
  computed: {

    ...mapGetters({
      compareOption: 'app/compareOption',
    }),

    compareDates() {
      return TransactionAnalysis.GetCompareDateRange(this.compareOption);
    },

    queryEndDateMoment() {
      return moment(this.compareDates.end);
    },

    /**
       * @returns {moment.Moment}
       */
    queryStartDateMoment() {
      return moment(this.compareDates.start);
    },

    /**
       * @returns {*|Array}
       */
    categorySummaries() {
      const transactions = get(this, 'user.transactions', []);
      return TransactionAnalysis.GetCategorySummaries(
        transactions,
        this.queryEndDateMoment,
        this.queryStartDateMoment,
        this.ignorePending,
        this.ignoreTransfers
      );
    },
  },
  apollo: {
    user: {
      query: gql`
          query user($end_date: String!, $start_date: String!) {
            user {
              id
              transactions(end_date: $end_date, start_date: $start_date) {
                amount
                status
                is_transfer
                date
                payee
                category {
                  id
                  title
                }
              }
            }
          }
        `,
      variables() {
        return {
          end_date: this.queryEndDateMoment.format('YYYY-MM-DD'),
          start_date: this.queryStartDateMoment.format('YYYY-MM-DD'),
        };
      },
    },
  },
  components: {
    Amount,
    CategoryTransactionTable,
  },
};
</script>

<style>
  .category-summary-table > .el-table__body-wrapper > .el-table__expanded-cell {
    padding: 0;
  }
</style>
