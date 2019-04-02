<template>
  <div>
    <el-table
      class="category-summary-table"
      :data="categorySummaries"
      :default-sort="{prop: 'amount', order: 'descending'}"
      v-loading="loading"
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
import CategoryTransactionTable from './CategoryTransactionsTable';
import Amount from './Amount';

export default {
  name: 'TransactionsTable',
  props: {
    categorySummaries: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    queryEndDateMoment: {
      required: true,
    },
    queryStartDateMoment: {
      required: true,
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
