<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="6">
        <div>
          <h3>Summary</h3>
          <p class="subtitle">
            {{ queryStartDateMoment.format('L') }} to {{ queryEndDateMoment.format('L') }}
          </p>
        </div>
      </el-col>
      <el-col :span="6">
        <h3 class="earnt"><amount :amount="totals.earnt"/></h3>
        <p class="subtitle">Earnt</p>
      </el-col>
      <el-col :span="6">
        <h3 class="spent"><amount :amount="totals.spent"/></h3>
        <p class="subtitle">Spent</p>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </el-card>
</template>

<script>
import Amount from './Amount';

export default {
  name: 'SummaryPanel',
  props: {
    categorySummaries: {
      type: Array,
      required: true,
    },
    queryEndDateMoment: {
      required: true,
    },
    queryStartDateMoment: {
      required: true,
    },
  },
  computed: {
    totals() {
      let spent = 0;
      let earnt = 0;
      this.categorySummaries.forEach((summary) => {
        summary.transactions.forEach((transaction) => {
          if (transaction.amount <= 0) {
            spent += transaction.amount;
          } else {
            earnt += transaction.amount;
          }
        });
      });
      return { spent, earnt };
    },
  },
  components: {
    Amount,
  },
};
</script>

<style scoped>
  .el-card {
    margin-top: 15px;
  }

  h3 {
    margin: 0;
  }

  .subtitle {
    color: #888;
    font-size: 14px;
    margin: 5px 0 0;
  }

  .earnt {
    color: #00e676;
  }

  .spent {
    color: #ff1744;
  }
</style>
