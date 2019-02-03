
'use strict';

const todo = (id, title, description, dueDate, priority) => {

    title = title === '' ? 'Untitled Task' : title;

    return {id, title, description, dueDate, priority};
}

export default todo;
