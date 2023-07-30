const itemsContainer = document.querySelector(".items-container");
const writeBox = document.getElementById("write-box");

let todos = [];

function renderTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || "{}";
  if (todos.length > 0 && typeof todos !== "string") {
    Array.from(todos).map((todo) => {
      let {
        editBtn,
        textBox,
        parent,
        inputBox,
        roundCheckBox,
        editDiv,
        cancelBtn,
      } = createTodo(todo.text, todo.done);
      parent.setAttribute("data-key", todo.id);
      itemsContainer.appendChild(parent);
      checkAndEdit(
        roundCheckBox,
        inputBox,
        textBox,
        editDiv,
        editBtn,
        cancelBtn,
        parent
      );
    });
  } else return;
}
renderTodos();

writeBox.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    appendTodo(e.target.value);
    writeBox.value = "";
  }
});

function appendTodo(text) {
  let data = JSON.parse(localStorage.getItem("todos")) || "{}";
  let {
    parent,
    editBtn,
    textBox,
    inputBox,
    roundCheckBox,
    editDiv,
    cancelBtn,
  } = createTodo(text, false);
  parent.setAttribute("data-key", Date.now());
  itemsContainer.appendChild(parent);
  checkAndEdit(
    roundCheckBox,
    inputBox,
    textBox,
    editDiv,
    editBtn,
    cancelBtn,
    parent
  );
  if (typeof data !== "string") {
    todos = [
      ...data,
      { id: parent.dataset.key, text, editMode: false, done: false },
    ];
    localStorage.setItem("todos", JSON.stringify(todos));
  } else {
    todos.push({ id: parent.dataset.key, text, editMode: false, done: false });
    localStorage.setItem("todos", JSON.stringify(todos));
  }
}

/**
 * create to do function
 */
function createTodo(value, marked) {
  let todo = document.createElement("div");
  todo.classList.add("todo");

  const leftDiv = todo.appendChild(document.createElement("div"));
  const checkBoxDiv = leftDiv.appendChild(document.createElement("div"));
  const inputCheckBox = checkBoxDiv.appendChild(
    document.createElement("input")
  );
  const label = checkBoxDiv.appendChild(document.createElement("label"));
  const textArea = leftDiv.appendChild(document.createElement("textarea"));

  inputCheckBox.type = "checkbox";
  inputCheckBox.checked = marked;

  leftDiv.classList.add("left-div");
  checkBoxDiv.classList.add("checkbox-container");

  textArea.classList.add("text-input");
  textArea.value = value;
  textArea.disabled = true;

  const rightDiv = todo.appendChild(document.createElement("div"));
  const editDiv = rightDiv.appendChild(document.createElement("div"));
  const editBtn = editDiv.appendChild(document.createElement("img"));
  const cancelBtn = rightDiv.appendChild(document.createElement("img"));
  const checkedGreen = rightDiv.appendChild(document.createElement("icon"));

  editBtn.src = "media/edit-3.svg";
  editBtn.width = 20;
  cancelBtn.src = "media/cancel.svg";
  cancelBtn.width = 20;

  rightDiv.classList.add("right-div");
  editBtn.classList.add("edit-btn");
  cancelBtn.classList.add("cancel-btn");
  checkedGreen.classList.add("checked-green");
  editDiv.classList.add("edit-div");

  if (marked) {
    textArea.classList.add("strike");
    editDiv.setAttribute("style", "cursor: not-allowed");
    editBtn.setAttribute("style", "pointer-events: none");
  }

  return {
    editBtn,
    textBox: textArea,
    parent: todo,
    inputBox: inputCheckBox,
    roundCheckBox: checkBoxDiv,
    editDiv,
    cancelBtn,
  };
}

function checkAndEdit(
  checkBoxDiv,
  inputCheckBox,
  textArea,
  editDiv,
  editIcon,
  xbtn,
  todo
) {
  checkBoxDiv.addEventListener("click", () => {
    let data = JSON.parse(localStorage.getItem("todos")) || "{}";
    let target =
      typeof data !== "string" &&
      data.find((item) => item.id === todo.dataset.key);
    if (!target.done) {
      inputCheckBox.checked = true;
      textArea.classList.add("strike");
      editDiv.setAttribute("style", "cursor: not-allowed");
      editIcon.setAttribute("style", "pointer-events: none");
      data.splice(data.indexOf(target), 1, {
        id: todo.dataset.key,
        text: textArea.value,
        editMode: false,
        done: true,
      });
      localStorage.setItem("todos", JSON.stringify(data));
    } else {
      inputCheckBox.checked = false;
      textArea.classList.remove("strike");
      editDiv.removeAttribute("style");
      editIcon.removeAttribute("style");
      data.splice(data.indexOf(target), 1, {
        id: todo.dataset.key,
        text: textArea.value,
        editMode: false,
        done: false,
      });
      localStorage.setItem("todos", JSON.stringify(data));
    }
  });
  editIcon.addEventListener("click", () => {
    let data = JSON.parse(localStorage.getItem("todos")) || "{}";
    let target =
      typeof data !== "string" &&
      data.find((item) => item.id === todo.dataset.key);

    let end = textArea.value.length;
    if (!target.editMode) {
      textArea.disabled = false;
      textArea.setSelectionRange(end, end);
      textArea.focus();
      editIcon.src = "media/check.svg";
      data.splice(data.indexOf(target), 1, {
        id: todo.dataset.key,
        text: textArea.value,
        editMode: true,
        done: false,
      });
      localStorage.setItem("todos", JSON.stringify(data));
    } else {
      textArea.disabled = true;
      editIcon.src = "media/edit-3.svg";
      data.splice(data.indexOf(target), 1, {
        id: todo.dataset.key,
        text: textArea.value,
        editMode: false,
        done: false,
      });
      localStorage.setItem("todos", JSON.stringify(data));
    }
  });
  xbtn.addEventListener("click", () => {
    let data = JSON.parse(localStorage.getItem("todos"));
    let target = data.find((item) => item.id === todo.dataset.key);
    let newData = data.filter((item) => item.id !== target.id);
    deleteTodo(todo, target.done, newData);
  });
}

function deleteTodo(todo, marked, data) {
  if (marked) {
    localStorage.setItem("todos", JSON.stringify(data));
    todo.remove();
  } else return;
}
