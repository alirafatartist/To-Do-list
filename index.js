let input = document.querySelector("input");
let addBtn = document.querySelector(".addbtn");
let tasksDiv = document.querySelector(".tasks");
let imgWarapper = document.querySelector(".img-warapper");
let modalInput = document.querySelector(".modal-body input");
let btnSave = document.querySelector(".btn-save");
let modal = document.querySelector(".modal");

console.log(modal);

let allTasks = [];

function check() {
  if (
    (localStorage.getItem("allTasks") == null ||
      localStorage.getItem("allTasks") == "[]") &&
    allTasks.length == 0
  ) {
    allTasks = [];
    tasksDiv.innerHTML = `
                <div class="w-50 img-warapper">
                      <img
                        class="w-100"
                        src="./images/icon-empty.41c83759.svg"
                        alt="Empty List"
                        draggable="false"
                      />
                    </div>
                `;
  } else {
    allTasks = JSON.parse(localStorage.getItem("allTasks"));

    displayTasks();
  }
}
check();

window.onkeyup = function (e) {
  if (e.key == "Enter") addTask();
};

function addTask() {
  if (input.value != " " && input.value.trim().length !== 0) {
    if (imgWarapper) imgWarapper.remove();
    let objTask = {
      id: tasksDiv.childElementCount,
      content: input.value,
      checked: false,
    };
    allTasks.push(objTask);
    clearInput();
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    displayTasks();
  }
}

function displayTasks() {
  let tasks = JSON.parse(localStorage.getItem("allTasks"));
  //   console.log(tasks);
  let cartoona = "";
  for (let i = 0; i < tasks.length; i++) {
    let task = `
        <div class="task d-flex justify-content-between align-items-center">
        <div
        class="task-detalis d-flex justify-content-center align-items-center"
        >
        <input type="checkbox" name="" id="" onchange='handleChange(this,${i})' ${
      tasks[i].checked ? "checked" : ""
    }/>
        <p>${tasks[i].content}</p>
        </div>
        <div class="options d-flex justify-content-center align-items-center">
        

        <button type="button" class="edit" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick='editTask(${i})'>
    <i class="fa-solid fa-pen-to-square"></i>
  </button>

        <i class="fa-solid fa-trash" onclick="removeTask(event,${i})"></i>
        </div>
        </div>
        `;
    cartoona += task;
  }
  tasksDiv.innerHTML = cartoona;
}

function clearInput() {
  input.value = "";
}

function removeTask(e, i) {
  e.target.parentElement.parentElement.remove();
  allTasks.splice(i, 1);
  console.log(allTasks);
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
  check();
}

function handleChange(e, i) {
  //   console.log(e,i);
  if (e.checked == true) {
    allTasks[i].checked = true;
    console.log(allTasks);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    // console.log(checkbox);
  } else if (e.checked == false) {
    allTasks[i].checked = false;
    console.log(allTasks);
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
  }
}

function editTask(i) {
  editIndex = i;
  modalInput.value = allTasks[i].content;
}

btnSave.addEventListener("click", () => {
  let modal = document.querySelector(".modal");
  let modalBackdrop = document.querySelectorAll(".modal-backdrop");
  let body = document.querySelector("body");
  if (editIndex !== null) {
    console.log(modal);
    allTasks[editIndex].content = modalInput.value;
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    displayTasks();
    editIndex = null;
    modal.classList.remove("show");
    modal.removeAttribute("role");
    modal.removeAttribute("aria-modal");
    modal.removeAttribute("style");
    modalBackdrop[0].remove();
    modalBackdrop[1].remove();
    body.classList.remove("modal-open");
    console.log(body);
  }
});
