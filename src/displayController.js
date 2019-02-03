import {format, isValid, distanceInWordsToNow} from 'date-fns';
('use-stict');

const displayController = (() => {
  const formButton = document.getElementById('toggle-form-button');
  const todoForm = document.getElementById('todo-form');
  const editForm = document.getElementById('edit-form');
  const content = document.getElementById('content');
  const cancelButton = document.getElementById('cancel-todo-button');
  const cancelEditButton = document.getElementById('cancel-edit-button');
  const createTodoButton = document.getElementById('create-todo-button');
  const projectsElement = document.getElementById('projects');
  const projectSelectorButton = document.getElementById('project-selector');

  const toggleForm = () => {
    todoForm.style.display =
      todoForm.style.display === 'flex' ? 'none' : 'flex';
  };

  const toggleEditForm = () => {
    editForm.style.display =
      editForm.style.display === 'flex' ? 'none' : 'flex';
  };

  const toggleProjects = () => {
    projectsElement.style.display =
      projectsElement.style.display === 'flex' ? 'none' : 'flex';
  };

  const renderProject = projectItem => {
    if (projectItem.id == 0) {
      projectsElement.insertAdjacentHTML(
        'afterbegin',
        `<span id='project${projectItem.id}' class='project'><span>${
          projectItem.name
        }</span></span>`,
      );
    } else {
      projectsElement.insertAdjacentHTML(
        'afterbegin',
        `<span id='project${projectItem.id}' class='project'><span>${
          projectItem.name
        }</span><span class='delete-project'>&#10007;</span></span>`,
      );
    }
  };

  const updateCurrentProjectName = currentProjectName => {
    projectSelectorButton.innerHTML =
      currentProjectName + ' &blacktriangledown;';
  };

  const cloneSaveEditButton = () => {
    let saveEditButton = document.getElementById('edit-todo-button');
    let clone = saveEditButton.cloneNode(true);
    let saveEditButtonParent = saveEditButton.parentElement;
    saveEditButtonParent.removeChild(saveEditButton);
    saveEditButtonParent.insertBefore(clone, saveEditButtonParent.firstChild);
    return clone;
  };

  const renderTodo = todoItem => {
    let todoElement = document.getElementById(todoItem.id);
    if (!todoElement) {
      content.insertAdjacentHTML(
        'beforeend',
        `<div class='item' id='${todoItem.id}'></div>`,
      );
    } else {
      todoElement.parentElement.removeChild(todoElement.nextSibling);
      todoElement.innerHTML = '';
    }
    addTodoPreviewChild(todoItem);
    addTodoOptionsChild(todoItem);
    addTodoDetailsSibling(todoItem);
    let todoDiv = document.getElementById(todoItem.id);
    switch (todoItem.priority) {
      case 'low':
        todoDiv.style['border-color'] = 'rgb(135, 157, 191)';
        break;
      case 'medium':
        todoDiv.style['border-color'] = 'orange';
        break;
      case 'high':
        todoDiv.style['border-color'] = 'red';
        break;
    }
  };

  const addTodoPreviewChild = todoItem => {
    let dueDatePreview = isValid(new Date(todoItem.dueDate))
      ? ' (due ' +
        distanceInWordsToNow(format(todoItem.dueDate, 'YYYY-MM-DD'), {
          addSuffix: true,
        }) +
        ')'
      : '';
    let todoPreview = `<div class='preview'> ${
      todoItem.title
    } ${dueDatePreview} </div>`;
    document
      .getElementById(todoItem.id)
      .insertAdjacentHTML('afterbegin', todoPreview);
  };

  const addTodoOptionsChild = todoItem => {
    let todoOptions =
      "<div class='todo-options'><button class='delete-todo-button' type='submit'>  &#10007;  </button></div></div>";
    document
      .getElementById(todoItem.id)
      .insertAdjacentHTML('beforeend', todoOptions);
  };

  const addTodoDetailsSibling = todoItem => {
    let dueDate = isValid(new Date(todoItem.dueDate))
      ? format(todoItem.dueDate, 'MMM D, YYYY')
      : '(not set)';
    let todoDetails = `<div class='item details'><div class='details-1'> <span><b>Task:</b> ${
      todoItem.title
    }</span> <span><b>Due:</b> ${dueDate}</span><span><b>Priority:</b> ${
      todoItem.priority
    }</span> <button class='edit'>edit</button></div><p>${
      todoItem.description
    }</p> </div>`;
    document
      .getElementById(todoItem.id)
      .insertAdjacentHTML('afterend', todoDetails);
  };

  const toggleDetails = todoId => {
    let details = document.getElementById(todoId).nextElementSibling;
    details.style.display = details.style.display === 'flex' ? 'none' : 'flex';
  };

  return {
    toggleForm,
    toggleEditForm,
    cloneSaveEditButton,
    formButton,
    createTodoButton,
    cancelButton,
    cancelEditButton,
    content,
    renderTodo,
    toggleDetails,
    projectSelectorButton,
    projectsElement,
    toggleProjects,
    renderProject,
    updateCurrentProjectName,
  };
})();

export default displayController;
