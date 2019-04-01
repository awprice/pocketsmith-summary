import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import App from './App.vue';
import createProvider from './vue-apollo';
import store from './store';

Vue.config.productionTip = false;
Vue.use(ElementUI);
locale.use(lang);

new Vue({
  apolloProvider: createProvider(),
  store,
  render: h => h(App),
}).$mount('#app');
