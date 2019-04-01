<template>
  <div id="app">
    <page>
      <div v-if="developerKey">
        <controls/>
        <transactions-table
          end-date="2019-03-30"
          :analysis-settings="analysisSettings"
        />
      </div>
      <div v-if="!developerKey" class="text-center">
        <el-alert
          title="Developer API key is not set"
          type="error"
          :closable="false"
          show-icon/>
      </div>
    </page>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Page from './components/Page';
import Controls from './components/Controls';
import TransactionsTable from './components/TransactionsTable';

export default {
  name: 'app',
  data() {
    return {
      analysisSettings: {
        period: 365,
        comparisonPeriods: 1,
      },
    };
  },
  computed: {
    ...mapGetters({
      developerKey: 'app/developerKey',
    }),
  },
  components: {
    TransactionsTable,
    Page,
    Controls,
  },
};
</script>

<style>
  #app {
    margin-top: 60px;
  }

  * {
    font-family: 'Roboto', sans-serif;
  }

  body {
    background-color: #eaedf1;
  }

  [class^="el-icon-mdi"], [class*=" el-icon-mdi"] {
    display: inline-block;
    font: normal normal normal 18px/0.5 "Material Design Icons" !important;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: middle;
    margin-top: 0;
  }
</style>

<style lang="scss">
  $mdi-font-path: "../node_modules/@mdi/font/fonts";
  $mdi-css-prefix: el-icon-mdi;
  @import "../node_modules/@mdi/font/scss/materialdesignicons";
</style>
