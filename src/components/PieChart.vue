<script>
import randomColor from 'randomcolor';
import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  props: {
    labels: {
      type: Array,
      required: true,
    },
    values: {
      type: Array,
      required: true,
    },
    hue: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      options: {
        responsive: true,
        cutoutPercentage: 50,
        legend: {
          display: false,
        },
      },
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            label: 'Dataset 1',
            backgroundColor: randomColor({
              count: this.values.length,
              hue: this.hue,
            }),
          },
        ],
      };
    },
  },
  watch: {
    values() {
      this.renderChart(this.chartData, this.options);
    },
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
};
</script>
