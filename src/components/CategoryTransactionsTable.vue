<template>
  <el-table
    :data="transactions"
  >
    <el-table-column
      label="Date"
      prop="date"
      width="150"
    />
    <el-table-column
      label="Merchant"
      prop="payee"
    />
    <el-table-column
      label="Amount"
      prop="amount"
      width="150"
    >
      <template slot-scope="props">
        <amount :amount="props.row.amount"/>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Amount from './Amount';

export default {
  name: 'CategoryTransactionsTable',
  components: { Amount },
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
};
</script>
