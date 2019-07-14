<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="chart-header">
          <h3>Earnings</h3>
        </div>
        <pie-chart
          class="chart"
          :labels="labels"
          :values="positive"
          hue="green"
        />
      </el-col>
      <el-col :span="12">
        <div class="chart-header">
          <h3>Spendings</h3>
        </div>
        <pie-chart
          class="chart"
          :labels="labels"
          :values="negative"
          hue="red"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from './PieChart';

export default {
  name: 'ChartPanel',
  props: {
    categorySummaries: {
      required: true,
      type: Array,
    },
  },
  methods: {
    values(positive, negative) {
      const values = [];
      this.categorySummaries.forEach((summary) => {
        let total = 0;
        summary.transactions.forEach((transaction) => {
          if (positive && transaction.amount > 0) {
            total += transaction.amount;
          }
          if (negative && transaction.amount < 0) {
            total += transaction.amount;
          }
        });
        values.push(total);
      });
      return values;
    },
  },
  computed: {
    positive() {
      return this.values(true, false);
    },
    negative() {
      return this.values(false, true);
    },
    labels() {
      const labels = [];
      this.categorySummaries.forEach((summary) => {
        labels.push(summary.title);
      });
      return labels;
    },
  },
  components: {
    PieChart,
  },
};
</script>

<style scoped>
  .chart {
    padding: 20px 50px;
  }
  .chart-header {
    text-align: center;
  }
</style>
