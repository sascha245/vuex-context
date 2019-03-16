import { Component, Vue } from 'vue-property-decorator';

import { Todo } from '../store/todo';

@Component
export default class Home extends Vue {
  public todoText: string = '';

  public todoModule = Todo.getInstance(this.$store, 'todo');

  public get todos() {
    return this.todoModule.state.list;
  }
  public toggleTodo(todo) {
    this.todoModule.commit.toggleTodo(todo);
  }
  public addTodo() {
    this.todoModule.commit.addTodo({
      id: Math.random() * Math.pow(2, 32) + '',
      text: this.todoText,
      done: false
    });
    this.todoText = '';
  }

  public async mounted() {
    console.log('fetched todos', await this.todoModule.dispatch.fetchTodos());
  }
}
