<template>
  <div>
    <transactions-table
      :loading="$apollo.loading"
      :category-summaries="categorySummaries"
      :query-start-date-moment="queryStartDateMoment"
      :query-end-date-moment="queryEndDateMoment"
    />
    <summary-panel
      v-if="!$apollo.loading"
      :category-summaries="categorySummaries"
      :query-start-date-moment="queryStartDateMoment"
      :query-end-date-moment="queryEndDateMoment"
    />
    <chart-panel
      :category-summaries="categorySummaries"
    />
  </div>
</template>

<script>
import gql from 'graphql-tag';
import moment from 'moment';
import { mapGetters } from 'vuex';
import get from 'lodash/get';
import TransactionAnalysisHelper from '../helpers/TransactionAnalysis';
import TransactionsTable from './TransactionsTable';
import SummaryPanel from './SummaryPanel';
import ChartPanel from './ChartPanel';

export default {
  name: 'TransactionAnalysisHolder',
  components: { ChartPanel, SummaryPanel, TransactionsTable },
  computed: {
    ...mapGetters({
      compareOption: 'app/compareOption',
    }),

    /**
     * @returns {*|moment.Moment|number|*|{start, end}|never}
     */
    compareDates() {
      return TransactionAnalysisHelper.GetCompareDateRange(this.compareOption);
    },

    /**
     * @returns {moment.Moment}
     */
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
      return TransactionAnalysisHelper.GetCategorySummaries(
        transactions,
        this.queryEndDateMoment,
        this.queryStartDateMoment,
        true,
        true
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
};
</script>
