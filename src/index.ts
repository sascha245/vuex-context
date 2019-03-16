import {
    ActionContext, ActionTree, CommitOptions, DispatchOptions, GetterTree, MutationTree, Store
} from 'vuex';

type InferPayload<T> = T extends (_: any, payload?: any, options?: any) => any
  ? Parameters<T>[1]
  : never;

type InferMutation<T> = T extends undefined | null
  ? (() => void) & ((payload: undefined, options?: CommitOptions) => void)
  : (payload: T, options?: CommitOptions) => void;
type InferMutations<T> = { [Key in keyof T]: InferMutation<InferPayload<T[Key]>> };

type InferAction<T> = T extends undefined | null
  ? (() => void) & ((payload: undefined, options?: DispatchOptions) => void)
  : (payload: T, options?: DispatchOptions) => void;
type InferActions<T> = { [Key in keyof T]: InferAction<InferPayload<T[Key]>> };

type InferGetters<T> = { [Key in keyof T]: T extends any ? ReturnType<T[Key]> : never };

export function Context<
  S extends (() => object) | object = {},
  M extends MutationTree<any> = {},
  A extends ActionTree<any, any> = {},
  G extends GetterTree<any, any> = {}
>() {
  type State = S extends () => object ? ReturnType<S> : S;

  const InstanceType = (null as unknown) as Readonly<{
    state: State;
    commit: InferMutations<M>;
    dispatch: InferActions<A>;
    getters: InferGetters<G>;
  }>;

  return {
    InstanceType,

    getInstance(store: Store<any> | ActionContext<any, any>, ns: string = ''): typeof InstanceType {
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
