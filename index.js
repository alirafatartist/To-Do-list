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
                        src="./assets/images/icon-empty.41c83759.svg"
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
    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    let objTask = {
      id: tasksDiv.childElementCount,
      content: escapeHtml(input.value),
      checked: false,
      date: formattedDate,
    };
    allTasks.push(objTask);
    clearInput();
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
    displayTasks();
    inputFocus();
    playAddSound();
  } else {
    showtoast();
  }
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
        <div>
        <p>${tasks[i].content}</p>
        <code class="date ">${tasks[i].date}</code>
        </div>
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
  updateLocalStorage();
  check();
  inputFocus();
}

function handleChange(e, i) {
  if (e.checked == true) {
    allTasks[i].checked = true;
    playCheckSound();
    updateLocalStorage();
    confetti({
      particleCount: 100,
      spread: 50,
      origin: { y: 0.6 },
    });
    checkallinputs();
  } else if (e.checked == false) {
    allTasks[i].checked = false;
    updateLocalStorage();
  }
}

function playCheckSound() {
  const checkSound = document.getElementById('checkSound');
  checkSound.currentTime = 0; // Reset the audio to the beginning
  checkSound.play();
}
function playAddSound() {
  const addSound = document.getElementById('addSound');
  addSound.currentTime = 0; // Reset the audio to the beginning
  addSound.play();
}

function checkallinputs() {
  const inputs = document.querySelectorAll('.task input[type="checkbox"]');
  const allChecked = Array.from(inputs).every((input) => input.checked);
  if (allChecked && inputs.length > 0) {
    triggerConfetti();
    playMultipleCheckSounds();
  }
}

function playMultipleCheckSounds() {
  const checkSound = document.getElementById('checkSound');
  const numberOfPlays = 4;
  let playCount = 0;

  function playSound() {
    checkSound.currentTime = 0;
    checkSound.play();
    playCount++;

    if (playCount < numberOfPlays) {
      // Random delay between 100ms and 300ms
      setTimeout(playSound, Math.random() * 200 + 100);
    }
  }

  playSound();
}

function triggerConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}

function editTask(i) {
  editIndex = i;
  modalInput.value = allTasks[i].content;
}

btnSave.addEventListener("click", () => {
  if (editIndex !== null) {
    allTasks[editIndex].content = modalInput.value;
    updateLocalStorage();
    displayTasks();
    editIndex = null;
    closeModal();
  }
});

function closeModal() {
  let modal = document.querySelector(".modal");
  let body = document.querySelector("body");
  let modalBackdrop = document.querySelectorAll(".modal-backdrop");
  modal.classList.remove("show");
  modal.removeAttribute("role");
  modal.removeAttribute("aria-modal");
  modal.removeAttribute("style");
  modalBackdrop[0].remove();
  modalBackdrop[1].remove();
  body.classList.remove("modal-open");
}

function updateLocalStorage() {
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

function showtoast() {
  let toast = document.getElementById("liveToast");
  inputFocus();
  toast.classList.replace("hide", "show");
  setTimeout(() => {
    toast.classList.replace("show", "hide");
    inputFocus();
  }, 5000);
}

function inputFocus() {
  input.focus();
}
inputFocus();
