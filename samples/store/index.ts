import Vue from "vue";
import Vuex, { Store, StoreOptions } from "vuex";

import * as counter from "./counter";
import * as todo from "./todo";

Vue.use(Vuex);

const options: StoreOptions<any> = {
  modules: {
    todo,
    counter
  }
};

export const createStore = () => new Store(options);
