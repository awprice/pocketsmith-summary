<template>
  <div class="controls-holder">
    <div>
      <h3>Compare</h3>
      <el-select
        v-model="compareValue"
        placeholder="Select"
        class="comparison-input"
      >
        <el-option
          v-for="item in compareOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import TransactionAnalysis from '../helpers/TransactionAnalysis';
import mutationTypes from '../store/types';

export default {
  name: 'Controls',
  data() {
    const compareOptions = TransactionAnalysis.GetCompareOptions();
    return {
      compareOptions,
    };
  },
  computed: {
    compareValue: {
      get() {
        return this.$store.state.app.compareOption;
      },
      set(value) {
        this.$store.commit(`app/${mutationTypes.SET_COMPARE_OPTION}`, value);
      },
    },
  },
};
</script>

<style scoped>
  .controls-holder {
    margin-bottom: 10px;
  }

  h3 {
    margin-top: 0;
    display: inline-block;
    color: #333;
  }

  .comparison-input {
    display: inline-block;
    margin-left: 10px;
  }
</style>
