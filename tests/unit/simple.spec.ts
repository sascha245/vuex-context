import Vue from 'vue';
import Vuex from 'vuex';

import { createStore } from '../../samples/store/';
import { Todo } from '../../samples/store/todo';

Vue.use(Vuex);

describe('Simple Todo tests', () => {
  let store;
  let proxy: typeof Todo.InstanceType;

  beforeEach(() => {
    store = createStore();
    proxy = Todo.getInstance(store, 'todo');
  });

  it('Add todo', () => {
    expect(Array.isArray(proxy.state.list));
    expect(proxy.state.list.length === 0);

    expect(typeof proxy.commit.addTodo === 'function');

    proxy.commit.addTodo({
      done: false,
      id: 'random',
      text: 'Random todo'
    });

    expect(proxy.state.list.length === 1);
  });

  it('Fetch todos', async () => {
    expect(Array.isArray(proxy.state.list));
    expect(proxy.state.list.length === 0);

    expect(typeof proxy.dispatch.fetchTodos === 'function');

    await proxy.dispatch.fetchTodos();
  });

  it('Destructure mutations', async () => {
    const { importTodo, addTodo, toggleTodo } = proxy.commit;

    expect(typeof importTodo === 'function');
    expect(typeof addTodo === 'function');
    expect(typeof toggleTodo === 'function');
  });
});
