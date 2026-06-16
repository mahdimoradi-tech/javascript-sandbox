let todos = loadFormLocalStorage();
let filterValue = "all";
let currentEditTodoId = null;

//Selecting:
const submitForm = document.querySelector(".todo-form");
const userInput = document.querySelector(".todo-input");
const todoList = document.querySelector(".todolist");
const filterBtn = document.querySelector(".filter-todos");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".modal__close");
const modalSubmitForm = document.querySelector(".modal__content");
const modalUserInput = document.querySelector(".edit-input");
const backdrop = document.querySelector(".backdrop");

//Events:
submitForm.addEventListener("submit", addNewTodo);

filterBtn.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", () => {
  todos = loadFormLocalStorage();
  filterTodos();
});

modalSubmitForm.addEventListener("submit", modalSubmitFormEvent);
backdrop.addEventListener("click", addHiddenClassToModal);

//Functions:
function createTodoList(todos) {
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
          <p class="todo__title ${todo.isCompleted && "completed"}" >${
      todo.title
    }</p>
          <span class="todo__createdAt">${new Date(
            todo.createdAt
          ).toLocaleDateString("fa-IR")}</span>
          <button class="todo__check" data-todo-id=${
            todo.id
          }><i class="far fa-check-square"></i></button>
          <button class="todo__edit" data-todo-id=${
            todo.id
          }><i class="fa-solid fa-pen"></i></button>
          <button class="todo__remove" data-todo-id=${
            todo.id
          }><i class="far fa-trash-alt"></i></button>
        </li>`;
  });

  todoList.innerHTML = result;
  userInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const editBtns = [...document.querySelectorAll(".todo__edit")];
  editBtns.forEach((btn) => btn.addEventListener("click", todoEditBtn));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));
}

function addNewTodo(e) {
  e.preventDefault();

  if (!userInput.value) return;

  const newTodo = {
    id: Date.now(),
    title: userInput.value.trim(),
    createdAt: new Date().toISOString(),
    isCompleted: false,
  };
  todos.push(newTodo);
  saveToLocalStorage(todos);

  filterTodos();
}

function filterTodos() {
  switch (filterValue) {
    case "all": {
      createTodoList(todos);
      break;
    }
    case "completed": {
      const completedFilter = todos.filter((todo) => todo.isCompleted);
      createTodoList(completedFilter);
      break;
    }
    case "uncompleted": {
      const unCompletedFilter = todos.filter((todo) => !todo.isCompleted);
      createTodoList(unCompletedFilter);
      break;
    }
    default:
      createTodoList(todos);
  }
}

function removeTodo(e) {
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((todo) => todo.id !== todoId);
  saveToLocalStorage(todos);
  filterTodos();
}

function todoEditBtn(e) {
  currentEditTodoId = Number(e.target.dataset.todoId);
  const todo = todos.find((todo) => todo.id === currentEditTodoId);
  modalUserInput.value = todo.title;
  modal.classList.remove("hidden");
  backdrop.classList.remove("hidden");

  // Close modal
  closeModalBtn.addEventListener("click", addHiddenClassToModal);
}

function checkTodo(e) {
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((todo) => todo.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveToLocalStorage(todos);
  filterTodos();
}

function saveToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadFormLocalStorage() {
  const data = localStorage.getItem("todos");
  return data ? JSON.parse(data) : [];
}

function addHiddenClassToModal() {
  modal.classList.add("hidden");
  backdrop.classList.add("hidden");
}

function modalSubmitFormEvent(e) {
  e.preventDefault();
  const todo = todos.find((todo) => todo.id === currentEditTodoId);
  if (!todo) return;
  todo.title = modalUserInput.value.trim();
  saveToLocalStorage(todos);
  filterTodos();
  addHiddenClassToModal();
}
