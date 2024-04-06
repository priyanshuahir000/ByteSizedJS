var currentPosition = 0;
let tasks = [];
var container = document.querySelector(".container");
var topDiv = document.querySelector(".top-div");

// Task Item Constructor
function taskItem(task, position) {
  this.task = task;
  this.currentPosition = currentPosition;
}

// Fetch data from the local storage and display it on the DOM
document.addEventListener("DOMContentLoaded", () => {
  if (
    navigator.userAgent.includes("Windows") ||
    navigator.userAgent.includes("Mac")
  ) {
    document.querySelector("#task").attributes.autofocus.value = true;
  }
  tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks.length != 0) {
    document.body.removeChild(document.querySelector(".doodle"));
    for (let i = 0; i < tasks.length; i++) {
      addTaskToDOM(tasks[i]);
    }
  }
});

// Add Task on Enter Key Press
document.querySelector("#task").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Add Task to Local Storage
function addTask() {
  if (document.querySelector(".doodle")) {
    document.body.removeChild(document.querySelector(".doodle"));
  } // Remove Doodle
  const tempTask = new taskItem(
    document.querySelector("#task").value,
    currentPosition
  );
  tasks.push(tempTask);
  currentPosition++;
  addTaskToDOM(tempTask);
  document.querySelector("#task").value = "";
  localStorage.setItem("tasks", JSON.stringify(tasks));
  if (
    navigator.userAgent.includes("Windows") ||
    navigator.userAgent.includes("Mac")
  ) {
    document.querySelector("#task").attributes.autofocus.value = true;
  }
}

// Add Task to DOM
function addTaskToDOM(tempTask) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task-item");
  taskItem.classList.add(`task-${tempTask.currentPosition}`);
  taskItem.innerHTML = `<p>${tempTask.task}</p><button id="clear-task" title="Pop Task" onclick="popTask(${tempTask.currentPosition})" class="popTask"><svg height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m15.8333 5.34166-1.175-1.175-4.6583 4.65834-4.65833-4.65834-1.175 1.175 4.65833 4.65834-4.65833 4.6583 1.175 1.175 4.65833-4.6583 4.6583 4.6583 1.175-1.175-4.6583-4.6583z" fill="#393a37"></path></svg></button>`;
  container.insertBefore(taskItem, topDiv.nextSibling);
}

// Pop Task from DOM and Local Storage
function popTask(position) {
  if (position != tasks.length - 1) {
    last = tasks[tasks.length - 1].currentPosition;
    for (let i = position; i <= last; i++) {
      document.querySelector(`.task-${i}`).style.animation =
        "taskSlideOut 0.5s ease-out forwards";
      setTimeout(() => {
        container.removeChild(document.querySelector(`.task-${i}`));
      }, 500);
      tasks.pop(i - 1);
    }
    currentPosition = tasks.length;
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].currentPosition = i;
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return;
  }
  document.querySelector(`.task-${position}`).style.animation =
    "taskSlideOut 0.5s ease-out forwards";
  setTimeout(() => {
    container.removeChild(document.querySelector(`.task-${position}`));
  }, 500);
  tasks.pop(position);
  currentPosition = tasks.length;
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
