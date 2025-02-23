'use strict';

const todoList = $('.todo-list');
const todoInput = $('#todo-main-input');
const todoBlock = $('.todo-block');
const deleteButtonAll = $('#del-allbtn');

const todoTasksArr = getTasksFromStorage();

todoTasksArr.forEach(task => addTodoToDOM(task));

todoBlock.on('click', '#add-todo', function() {
        addTodo();
    })
    .on('click', '.delete-item', function() {
        deleteTodoItem($(this));
    })
    .on('click', '.edit-item', function() {
        handleEdit($(this));  
    })
    .on('click', '.todo-p', function() {
        showTodoModal($(this));
    })
    .on('click', '#del-allbtn', function() {
        clearAllTodos();
    })

todoList.on('change', '.done-item', function () {
    toggleTodoCompletion($(this));
});

function addTodo() {
    const data = {
        id: generateRandomId(),
        text: todoInput.val().trim(),
        completed: false
    };

    if (!data.text) {
        alert('Текст завдань не може бути порожнім');
        return;
    }

    todoTasksArr.push(data);
    saveTaskInStorage();
    addTodoToDOM(data);
    todoInput.val('');
    updateDeleteButtonAll();
}

function addTodoToDOM(task) {
    const todoItem = $('<li>', { class: 'todo-item', 'data-id': task.id });
    if (task.completed) {
        todoItem.addClass('check-bg');
    }

    todoItem.html(`
        <div class='todo-p'>${task.text}</div>
        <div class='edit-panel'>
            <button class='edit-item'></button>
            <input type='checkbox' class='done-item' ${task.completed ? 'checked' : ''}>
            <button class='delete-item'>X</button>
        </div>
    `);

    todoList.prepend(todoItem);
}

function deleteTodoItem(button) {
    const todoItem = button.closest('.todo-item');
    const currentTaskIndex = getCurrentIndexItem(todoItem);
    
    todoTasksArr.splice(currentTaskIndex, 1);
    saveTaskInStorage();
    todoItem.remove();
    updateDeleteButtonAll();
}

function handleEdit(button) {
    const todoItem = button.closest('.todo-item');
    const editPanel = button.closest('.edit-panel');
    const textElement = todoItem.find('.todo-p');
    const currentText = textElement.text();
    const indexCurrentItem = getCurrentIndexItem(todoItem);

    toggleOtherTodoButtons(todoItem, false);

    const editInput = $('<input>', { type: 'text', class: 'todo-input', value: currentText });
    const saveButton = $('<button>', { class: 'save-item', text: 'Save' });

    textElement.replaceWith(editInput);
    editPanel.append(saveButton);
    button.hide();

    saveButton.on('click', () => {
        const newText = editInput.val().trim();
        if (!newText) {
            alert('Текст завдань не може бути порожнім');
            return;
        }

        todoTasksArr[indexCurrentItem].text = newText;
        saveTaskInStorage();

        editInput.replaceWith($('<div>', { class: 'todo-p', text: newText }));
        saveButton.remove();
        button.show();
        toggleOtherTodoButtons(todoItem, true);
    });
}

function toggleTodoCompletion(checkbox) {
    const todoItem = checkbox.closest('.todo-item');
    const indexCurrentItem = getCurrentIndexItem(todoItem);

    todoTasksArr[indexCurrentItem].completed = checkbox.prop('checked');
    saveTaskInStorage();
    todoItem.toggleClass('check-bg');
}

function clearAllTodos() {
    todoList.empty();
    todoTasksArr.length = 0;
    saveTaskInStorage();
    updateDeleteButtonAll();
}

function updateDeleteButtonAll() {
    deleteButtonAll.toggle(todoTasksArr.length > 1);
}

function toggleOtherTodoButtons(todoItem, visible) {
    todoItem.find('.done-item, .delete-item').toggle(visible);
}

function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem('tasksTodo')) || [];
}

function saveTaskInStorage() {
    localStorage.setItem('tasksTodo', JSON.stringify(todoTasksArr));
}

function getCurrentIndexItem(item) {
    const currentItemId = item.data('id');
    return todoTasksArr.findIndex(task => task.id === currentItemId);
}

function generateRandomId() {
    const randomNumber = Math.floor(Math.random() * 100000);
    const randomLetters = Math.random().toString(36).substring(2, 8);
    return randomNumber + randomLetters;
}

function showTodoModal(target) {
    $('.modal-task-text').text(target.text());
    $('#exampleModalCenter').modal('show');
}

updateDeleteButtonAll();

