var currentPosition = 0;
let tasks = [];
var container = document.querySelector(".container");
var topDiv = document.querySelector(".top-div");
function taskItem(task, position) {
  this.task = task;
  this.currentPosition = currentPosition;
}
function addTask() {
  const tempTask = new taskItem(document.querySelector("#task").value, top);
  tasks.push(tempTask);
  console.log(tasks);
  currentPosition++;
  addTaskToDOM(tempTask);
  document.querySelector("#task").value = "";
}

function addTaskToDOM(tempTask) {
  const taskItem = document.createElement("div");
  taskItem.classList.add(`task-${tempTask.currentPosition}`);
  taskItem.innerHTML = `<p>${tempTask.task}</p><button onclick="popTask(${tempTask.currentPosition})" class="popTask">X</button>`;
  container.insertBefore(taskItem, topDiv.nextSibling);
}

function popTask(position) {
  if (position != tasks.length - 1) {
    length = tasks.length - 1;
    for (let i = position; i <= length; i++) {
      container.removeChild(document.querySelector(`.task-${i}`));
      tasks.pop(i - 1);
    }
    return;
  }
  console.log(position);
  container.removeChild(document.querySelector(`.task-${position}`));
  tasks.pop(position);
}
