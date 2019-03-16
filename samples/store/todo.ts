import { Context } from '../../src';

export interface Todo {
  id: string;
  text: string;
  done: boolean;
}
export interface TodoState {
  filter: string;
  list: Todo[];
}

export const namespaced = true;

export const state = (): TodoState => ({
  filter: '',
  list: []
});

export const mutations = {
  clearFilter(state: TodoState) {
    state.filter = '';
  },
  importTodo(state: TodoState, list: Todo[]) {
    state.list = list;
  },
  addTodo(state: TodoState, todo: Todo) {
    state.list.push(todo);
  },
  toggleTodo(state: TodoState, todo: Todo) {
    const item = state.list.find(val => val.id === todo.id);
    if (!item) {
      throw new Error('could not find todo');
    }
    item.done = !item.done;
  }
};

export const actions = {
  async fetchTodos(context) {
    const ctx = Todo.getInstance(context);

    const todos = Array(10)
      .fill(null)
      .map(
        (val, index): Todo => {
          return {
            id: '' + index,
            text: 'My todo ' + index,
            done: false
          };
        }
      );
    ctx.commit.importTodo(todos);

    return todos;
  }
};

export const Todo = Context.fromModule({
  state,
  mutations,
  actions
});
