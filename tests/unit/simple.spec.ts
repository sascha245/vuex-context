import Vue from "vue";
import Vuex from "vuex";

import { createStore } from "../../samples/store/";
import { Counter } from "../../samples/store/counter";
import { Todo } from "../../samples/store/todo";

Vue.use(Vuex);

describe('Simple Todo tests', () => {
  let store;
  let todo: typeof Todo.InstanceType;
  let counter: typeof Counter.InstanceType;

  beforeEach(() => {
    store = createStore();
    todo = Todo.getInstance(store, 'todo');
    counter = Counter.getInstance(store, 'counter');
  });

  it('Add todo', () => {
    expect(Array.isArray(todo.state.list));
    expect(todo.state.list.length === 0);

    expect(typeof todo.commit.addTodo === 'function');

    todo.commit.addTodo({
      done: false,
      id: 'random',
      text: 'Random todo'
    });

    expect(todo.state.list.length === 1);
  });

  it('Fetch todos', async () => {
    expect(Array.isArray(todo.state.list));
    expect(todo.state.list.length === 0);

    expect(typeof todo.dispatch.fetchTodos === 'function');

    const todos = await todo.dispatch.fetchTodos();
    expect(Array.isArray(todos));
  });

  it('Destructure mutations', async () => {
    const { importTodo, addTodo, toggleTodo } = todo.commit;

    expect(typeof importTodo === 'function');
    expect(typeof addTodo === 'function');
    expect(typeof toggleTodo === 'function');
  });

  it('Optional payload', async () => {
    counter.commit.increment();
    counter.commit.increment(12);
    expect(true);
  });

  it('Clear filter', () => {
    todo.commit.clearFilter();
    expect(todo.state.filter === '');
  });

  it('Handle replaceState', () => {
    counter.commit.setCount(5);

    expect(counter.state.count === 5);

    const json = JSON.parse(JSON.stringify(store.state));
    json.counter.count = 6;

    store.replaceState(json);

    expect(counter.state.count === 6);
  });

  it('Multiple stores', () => {
    counter.commit.setCount(10);

    expect(counter.state.count === 10);

    const instance = Counter.getInstance(store, 'counter');

    expect(instance.state.count === 10);

    const store2 = createStore();

    const counter2 = Counter.getInstance(store2, 'counter');

    counter2.commit.setCount(20);

    expect(counter.state.count === 10);
    expect(counter2.state.count === 20);
  });
});
