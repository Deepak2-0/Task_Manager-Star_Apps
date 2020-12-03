let taskArray = [];
let taskIdToPut = 1;
let serverIdToPut = 2; // 1 is used from default
let serverArray = [{ id: "S1", isTaskDoing: false }];
let serversDeletePending = 0;
// let timeToCompleteTask = 20;
let taskPerSecond = 5;
let minServerAllowed = 1;
let maxServerAllowed = 10;

function addTask() {
  let taskValue = document.getElementById("inputTask").value;
  document.getElementById("inputTask").value = 1; //assigning input to 1
  initializeTask(taskValue);
}

function initializeTask(num) {
  for (let i = 0; i < num; i++) {
    let taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container");
    let taskId = `T${taskIdToPut}`;
    taskContainer.setAttribute("id", taskId);

    let item = document.createElement("div");
    item.textContent = "waiting...";
    item.classList.add("task-bar");
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-task");

    deleteButton.addEventListener(
      "click",
      handleDeleteTask.bind(this, taskId),
      false
    );
    let icon = document.createElement("i");
    icon.classList.add("fas", "fa-trash-alt");

    deleteButton.appendChild(icon);

    taskContainer.appendChild(item);
    taskContainer.appendChild(deleteButton);

    document.getElementById("taskExecuter").appendChild(taskContainer);

    // For taskArray
    let task = {
      id: taskId,
      isStarted: false
    };

    taskArray.push(task);
    //taskQueue.push(taskId);
    //doTask(taskId);

    // assignServer(taskId);
    assignTask();
    taskIdToPut++;
  }
}

function handleDeleteTask(taskId) {
  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i].id === taskId) {
      if (taskArray[i].isStarted === false) {
        deleteTask(taskId);
      } else return;
    }
  }
}

function deleteTask(taskId) {
  //console.log(taskId);

  document.getElementById(taskId).remove(); //fot deleting html element

  // For deleting from task Array
  let indexToDelete = -1;
  for (let i = 0; i < taskArray.length; i++) {
    if (taskArray[i].id === taskId) {
      indexToDelete = i;
      break;
    }
  }

  taskArray.splice(indexToDelete, 1);
  //console.log(taskArray);
}

function addServer() {
  if (serverArray.length >= maxServerAllowed) return;

  let server = document.createElement("div");
  server.classList.add("server-list");
  let serverId = `S${serverIdToPut}`;
  server.setAttribute("id", serverId);
  server.innerHTML = `Server ${serverIdToPut}`;
  document.getElementById("serverContainer").appendChild(server);

  // For Server Array
  let serverItem = {
    id: serverId,
    isTaskDoing: false
  };

  serverArray.push(serverItem);
  assignTask();

  serverIdToPut++;
}

function handleRemoveServer() {
  if (serverArray.length === minServerAllowed) return;

  let flag = false;

  for (let i = 0; i < serverArray.length; i++) {
    if (serverArray[i].isTaskDoing === false) {
      flag = true;
      deleteServer(serverArray[i].id);
      break;
    }
  }

  if (!flag) {
    serversDeletePending++;
  }
}

function deleteServer(serverId) {
  //console.log(serverId);

  document.getElementById(serverId).remove(); //fot deleting html element

  // For deleting from server Array
  let indexToDelete = -1;
  for (let i = 0; i < serverArray.length; i++) {
    if (serverArray[i].id === serverId) {
      indexToDelete = i;
      break;
    }
  }

  serverArray.splice(indexToDelete, 1);
  //console.log(serverArray);
}

function assignTask() {
  for (let i = 0; i < serverArray.length; i++) {
    for (let j = 0; j < taskArray.length; j++) {
      if (!serverArray[i].isTaskDoing & !taskArray[j].isStarted) {
        doTask(taskArray[i].id, serverArray[i].id);
        serverArray[i].isTaskDoing = true;
        taskArray[i].isStarted = true;
        break;
      }
    }
  }
}

function doTask(taskId, serverId) {
  let task = document.getElementById(taskId).children[0];
  task.innerHTML = "";
  let spanElement = document.createElement("span");
  task.appendChild(spanElement);
  let taskToStart = task.children[0];
  let taskCompleted = 0;
  let startTimer = 20;

  let timerId = setInterval(frame, 1000);

  function frame() {
    taskCompleted += taskPerSecond;
    startTimer--;
    let timeLeftFormat = startTimer.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
    let formattedTime = `00:${timeLeftFormat}`;
    taskToStart.setAttribute("style", `width:${taskCompleted}%;`);
    taskToStart.innerHTML = `${formattedTime}`;

    if (taskCompleted >= 100) {
      for (let i = 0; i < serverArray.length; i++) {
        if (serverArray[i].id === serverId) {
          serverArray[i].isTaskDoing = false;
          break;
        }
      }

      deleteTask(taskId);
      checkServerDeletePending(serverId);
      clearInterval(timerId);
    }
  }
}

function checkServerDeletePending(serverId) {
  if (serversDeletePending > 0) {
    serversDeletePending--;

    if (serverArray.length === minServerAllowed) return; //as minimum 1 server required
    deleteServer(serverId);
    return;
  }

  assignTask();
}
