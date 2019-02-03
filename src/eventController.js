import displayController from './displayController';
import todo from './todo';
import project from './project';

'use-strict';

const eventController = (() => {
	let projects = [];
	let projectIdCount = 0;
	let currentProject = undefined;
	const init = () => {
		if (localStorage.getItem('projects')) {
			projects = JSON.parse(localStorage.getItem('projects')); 
			projectIdCount = JSON.parse(localStorage.getItem('projectIdCount'));
		} else {
			let defaultProject = project.create('default', 0);
			let defaultTodo = todo(0, 'Example Todo', 'do stuff', 'May 5, 2020', 'low');
			addProject(defaultProject);
			project.addTodo(defaultTodo, undefined, defaultProject);
		}
     
		currentProject = projects[0];

		renderProjects();
		renderTodos(currentProject);

		displayController.formButton.addEventListener('click', displayController.toggleForm);
		displayController.cancelButton.addEventListener('click', displayController.toggleForm);
		displayController.createTodoButton.addEventListener('click', submitTodo);
		displayController.cancelEditButton.addEventListener('click', displayController.toggleEditForm);
		displayController.projectSelectorButton.addEventListener('click', displayController.toggleProjects);

		document.addEventListener('click', function () {
			if (event.target != document.getElementById('projects') && event.target != displayController.projectSelectorButton && event.target != document.getElementById('new-project-input')) {
				document.getElementById('projects').style.display = 'none';
			}
		});

		document.getElementById('new-project-button').addEventListener('click', function () {
			addProject(project.create(document.getElementById('new-project-input').value, projectIdCount));
			document.getElementById('new-project-input').value = '';
			currentProject = getProjectById(projectIdCount - 1);
			renderTodos(currentProject);
			renderProjects();
			//
			localStorage.setItem('projects', JSON.stringify(projects));
			localStorage.setItem('projectIdCount', JSON.stringify(projectIdCount));
		});

		// clear local storage button event listener
		//  document.getElementById('clearLocalStorage').addEventListener('click', function () {
		//      localStorage.clear();
		//      console.log('Storage cleared.');
		//  });
	};

	const addProject = (newProject) => {
		projects.push(newProject);
		projectIdCount++;
	};

	const removeProject = (projectId) => {
		for (let i=0; i<projects.length; i++) {
			if (projects[i].id == projectId) {
				projects.splice(i,1);
			}
		}
		localStorage.setItem('projects', JSON.stringify(projects));
		localStorage.setItem('projectIdCount', JSON.stringify(projectIdCount));
	};

	const getProjectById = (projectId) => {
		let gottenProject = projects[0];
		for (let i=0; i<projects.length; i++) {
			if (projects[i].id === projectId) {
				gottenProject = projects[i];
			}
		}
		return gottenProject;
	};
	const renderProjects = () => {
		let projectForm = document.getElementById('project-form');
		displayController.projectsElement.innerHTML = '';
		displayController.projectsElement.appendChild(projectForm);
		projects.forEach(function(projectItem) {
			displayController.renderProject(projectItem);
			setProjectEventListeners(projectItem);
		});
		setDeleteProjectListeners();
	};

	const submitTodo = () => {
		addTodo(getTodoFromInput());
		displayController.toggleForm();
	};
    
	const getTodoFromInput = () => {
		return todo(currentProject.todoIdCount, document.getElementById('title-input').value, document.getElementById('description-input').value, document.getElementById('due-date-input').value, document.getElementById('priority-input').value);
	};
    
	const renderTodos = (projectItem) => {
		displayController.updateCurrentProjectName(currentProject.name);
		displayController.content.innerHTML = '';
		projectItem.todos.forEach (function(todoItem) {
			displayController.renderTodo(todoItem);
			setTodoEvents(todoItem);
		});
	};

	const addTodo = (newTodo) => {
		project.addTodo(newTodo, undefined, currentProject);
		displayController.renderTodo(newTodo);
		setTodoEvents(newTodo);
		//
		localStorage.setItem('projects', JSON.stringify(projects));
		localStorage.setItem('projectIdCount', JSON.stringify(projectIdCount));
	};

	const removeTodo = (id) => {
		project.removeTodo(id, currentProject);
		let currentTodo = document.getElementById(id);
		currentTodo.parentElement.removeChild(currentTodo.nextSibling);
		currentTodo.parentElement.removeChild(currentTodo);
		//
		localStorage.setItem('projects', JSON.stringify(projects));
		localStorage.setItem('projectIdCount', JSON.stringify(projectIdCount));
	};

	const setTodoEvents = (todoItem) => {
		addRemoveTodoEvent(todoItem);
		addToggleDetailsEvent(todoItem);
		addEditTodoEvent(todoItem);
	};

	const addRemoveTodoEvent = (todoItem) => {
		document.getElementById(todoItem.id).lastChild.lastChild.addEventListener('click', function() {
			event.stopPropagation();
			removeTodo(todoItem.id);
		});
	};

	const addToggleDetailsEvent = (todoItem) => {
		document.getElementById(todoItem.id).addEventListener('click', function() {
			displayController.toggleDetails(todoItem.id); 
		});
	};

	const addEditTodoEvent = (todoItem) => {
		document.getElementById(todoItem.id).nextSibling.firstElementChild.lastElementChild.addEventListener('click', function addEditListener() {
			displayController.toggleEditForm();
			addPlaceholders(todoItem);
			displayController.cloneSaveEditButton().addEventListener('click', function() {
				displayController.toggleEditForm();
				todoItem.title = document.getElementById('edit-title-input').value;
				todoItem.description = document.getElementById('edit-description-input').value;
				todoItem.dueDate = document.getElementById('edit-due-date-input').value;
				todoItem.priority = document.getElementById('edit-priority-input').value;
				displayController.renderTodo(todoItem);
				addRemoveTodoEvent(todoItem);
				addEditTodoEvent(todoItem);
				displayController.toggleDetails(todoItem.id);
				//
				localStorage.setItem('projects', JSON.stringify(projects));
				localStorage.setItem('projectIdCount', JSON.stringify(projectIdCount));
			});
		});
	};

	const setProjectEventListeners = (projectItem) => {
		document.getElementById(`project${projectItem.id}`).addEventListener('click', function () {
			currentProject = projectItem;
			renderTodos(currentProject);
		});
	};

	const setDeleteProjectListeners = () => {
		Array.from(document.getElementsByClassName('delete-project')).forEach( function (deleteButton) {
			deleteButton.addEventListener('click', function () {
				event.stopPropagation();
				let parentIdNumber = parseInt(deleteButton.parentElement.id.substring(7));
				removeProject(parentIdNumber);
				currentProject = projects[0];
				renderProjects();
				renderTodos(currentProject);
			});
		});
	};
    
	const addPlaceholders = (todoItem) => {
		document.getElementById('edit-title-input').value = todoItem.title;
		document.getElementById('edit-description-input').value = todoItem.description;
		document.getElementById('edit-due-date-input').value = todoItem.dueDate == '' ? '' : new Date(todoItem.dueDate).toISOString().substring(0, 10);
		document.getElementById('edit-priority-input').value = todoItem.priority;
	};

    

	return { init }; 

})();

export default eventController;
