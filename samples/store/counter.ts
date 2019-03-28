import { Context } from "../../src";

export type CounterState = ReturnType<typeof state>;

export const namespaced = true;

export const state = () => ({
  count: 0,
  test: 0
});

export const mutations = {
  setCount(state: CounterState, payload: number) {
    state.count = payload;
  },
  increment(state: CounterState, payload: number = 1) {
    state.count += payload;
  },
  incrementBy(state: CounterState, payload: number) {
    state.count += payload;
  }
};

export const actions = {
  async incrementAsync(context): Promise<number> {
    const ctx = Counter.getInstance(context);
    ctx.commit.increment();
    ctx.commit.incrementBy(12);
    return ctx.state.count;
  }
};

export const getters = {
  doubleCount(state: CounterState): number {
    return state.count * 2;
  },
  quadrupleCount(state: CounterState, context): number {
    const getters = Counter.getGetters(context);
    return getters.doubleCount * 2;
  }
};

export const Counter = Context.fromModule({
  state,
  mutations,
  actions,
  getters
});
