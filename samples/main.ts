import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import { createStore } from "./store";

Vue.config.productionTip = false;

const store = createStore();

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app');
