import { Context } from '../../src';

export interface CounterState {
  count: number;
}

export const namespaced = true;

export const state = (): CounterState => ({
  count: 0
});

export const mutations = {
  increment(state: CounterState) {
    state.count++;
  },
  incrementBy(state: CounterState, payload: number) {
    state.count += payload;
  }
};

export const actions = {
  async incrementAsync(context) {
    const ctx = Counter.getInstance(context);
    ctx.commit.increment();
  }
};

export const getters = {
  doubleCount(state: CounterState) {
    return state.count * 2;
  }
};

export const Counter = Context.fromModule({
  state,
  mutations,
  actions,
  getters
});
