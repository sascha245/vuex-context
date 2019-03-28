<script lang="ts" src="./Home.ts"></script>

<template>
  <div class="home">
    <h1>Home</h1>

    <div v-for="todo in todos" :key="todo.id">
      <label>
        {{ todo.text }}
        <input type="checkbox" :checked="todo.done" @change="toggleTodo(todo)">
      </label>
    </div>

    <input type="text" v-model="todoText">
    <button @click="addTodo">Add</button>
  </div>
</template>

<style></style>
