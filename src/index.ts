import {
    ActionContext, ActionTree, CommitOptions, DispatchOptions, GetterTree, MutationTree, Store
} from "vuex";

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((
  k: infer I
) => void)
  ? I
  : never;

type InferPayload<T> = T extends (_: any, payload?: any, options?: any) => any
  ? Parameters<T>[1]
  : never;

type Mutation<T> = T extends undefined
  ? (() => void) & ((payload: undefined, options?: CommitOptions) => void)
  : (payload: T, options?: CommitOptions) => void;

type InferMutation<T> = UnionToIntersection<Mutation<InferPayload<T>>>;
type InferMutations<T> = { [Key in keyof T]: InferMutation<T[Key]> };

type Action<T, R> = T extends undefined
  ? (() => R) & ((payload: undefined, options?: DispatchOptions) => R)
  : (payload: T, options?: DispatchOptions) => R;
type ActionReturn<T> = T extends (...args: any[]) => infer R ? R : void;

type InferAction<T> = UnionToIntersection<Action<InferPayload<T>, ActionReturn<T>>>;
type InferActions<T> = { [Key in keyof T]: InferAction<T[Key]> };

type InferGetters<T> = {
  [Key in keyof T]: T[Key] extends (state: any, getters: any) => infer R ? R : never
};

type InferState<S> = S extends () => infer S ? S : S;

export function Context<
  S extends (() => object) | object = {},
  M extends MutationTree<any> = {},
  A extends ActionTree<any, any> = {},
  G extends GetterTree<any, any> = {}
>() {
  type InstanceType = Readonly<{
    state: InferState<S>;
    commit: InferMutations<M>;
    dispatch: InferActions<A>;
    getters: InferGetters<G>;
  }>;

  return {
    InstanceType: (undefined as unknown) as InstanceType,

    getGetters(getters: any): InstanceType['getters'] {
      return getters;
    },

    getInstance(store: Store<any> | ActionContext<any, any>, ns: string = ''): InstanceType {
      const splitNs = ns ? ns.split('/').filter(val => !!val) : [];
      const fixedNs = splitNs.length ? splitNs.join('/') + '/' : '';

      const state = new Proxy(Object.create(null), {
        get(target, propertyName: string) {
          return splitNs.reduce((pState, key) => pState[key], store.state)[propertyName];
        }
      });

      const commit = new Proxy(Object.create(null), {
        get(target, type: string) {
          return (payload?: any, options?: any) => store.commit(fixedNs + type, payload, options);
        }
      });

      const dispatch = new Proxy(Object.create(null), {
        get(target, type: string) {
          return (payload?: any, options?: any) => store.dispatch(fixedNs + type, payload, options);
        }
      });

      const getters = new Proxy(Object.create(null), {
        get(target, key: string) {
          return store.getters[fixedNs + key];
        }
      });

      return Object.freeze({
        state,
        commit,
        dispatch,
        getters
      });
    }
  };
}

Context.fromModule = function<
  S extends (() => object) | object = {},
  M extends MutationTree<any> = {},
  A extends ActionTree<any, any> = {},
  G extends GetterTree<any, any> = {}
>(module: Partial<{ state: S; mutations: M; actions: A; getters: G }>) {
  return Context<S, M, A, G>();
};
