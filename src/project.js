'use-strict';

const project = (() => {
  const create = (name, id) => {
    name = name === '' ? 'Untitled Project' : name;
    let todos = [];
    let todoIdCount = 0;
    return {name, id, todos, todoIdCount};
  };

  const addTodo = (newTodo, index, currentProject) => {
    if (index) {
      currentProject.todos.splice(index, 0, newTodo);
    } else {
      currentProject.todos.push(newTodo);
    }
    currentProject.todoIdCount++;
  };

  const removeTodo = (todoId, currentProject) => {
    let indexRemoved = null;
    for (let i = 0; i < currentProject.todos.length; i++) {
      if (currentProject.todos[i].id == todoId) {
        currentProject.todos.splice(i, 1);
        indexRemoved = i;
      }
    }
    return indexRemoved;
  };

  return {create, addTodo, removeTodo};
})();

export default project;
