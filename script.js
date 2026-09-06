
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const modal = document.getElementById("modal");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let filter = "all";
let priorityFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
    taskList.innerHTML = "";

    let list = tasks;

    if (filter === "completed") {
        list = list.filter(task => task.completed);
    }

    if (filter === "high") {
        list = list.filter(task => task.priority === "high");
    }

    if (filter === "today") {
        list = list.filter(task => task.today);
    }

    if (priorityFilter !== "all") {
        list = list.filter(task => task.priority === priorityFilter);
    }

    document.getElementById("empty").style.display =
        list.length === 0 ? "block" : "none";

    list.forEach(task => {

        const div = document.createElement("div");

        div.className = task.completed ? "task done" : "task";

        div.innerHTML = `
            <button class="check" data-id="${task.id}"></button>

            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <span class="priority ${task.priority}">
                    ${task.priority}
                </span>
            </div>

            <button class="delete" data-delete="${task.id}">×</button>
        `;

        taskList.appendChild(div);
    });
}

function updateStats() {

    const completed = tasks.filter(task => task.completed).length;
    const remaining = tasks.length - completed;

    let percent = 0;

    if (tasks.length > 0) {
        percent = Math.round((completed / tasks.length) * 100);
    }

    document.getElementById("completed").textContent = completed;
    document.getElementById("remaining").textContent = remaining;
    document.getElementById("progress").textContent = percent + "%";
    document.getElementById("progressText").textContent = percent + "%";
    document.getElementById("progressFill").style.width = percent + "%";
}

function updatePage() {
    showTasks();
    updateStats();
}

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("taskName").value.trim();
    const priority = document.getElementById("taskPriority").value;

    if (!name) return;

    tasks.unshift({
        id: Date.now(),
        name: name,
        priority: priority,
        completed: false,
        today: true
    });

    saveTasks();
    updatePage();

    taskForm.reset();
    document.getElementById("taskPriority").value = "medium";

    modal.classList.remove("show");
});

taskList.addEventListener("click", function(event) {

    const check = event.target.closest(".check");

    if (check) {

        const id = Number(check.dataset.id);
        const task = tasks.find(task => task.id === id);

        if (task) {
            task.completed = !task.completed;
            saveTasks();
            updatePage();
        }

        return;
    }

    const deleteButton = event.target.closest(".delete");

    if (deleteButton) {

        const id = Number(deleteButton.dataset.delete);

        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        updatePage();
    }
});

document.querySelectorAll(".menu button").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".menu button")
            .forEach(item => item.classList.remove("active"));

        this.classList.add("active");

        filter = this.dataset.filter;

        const titles = {
            all: "All Tasks",
            today: "Today's Tasks",
            high: "High Priority",
            completed: "Completed"
        };

        document.getElementById("taskHeading").textContent =
            titles[filter];

        updatePage();
    });
});

document.querySelectorAll(".filters button").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filters button")
            .forEach(item => item.classList.remove("selected"));

        this.classList.add("selected");

        priorityFilter = this.dataset.priority;

        updatePage();
    });
});

document.getElementById("addBtn").addEventListener("click", function() {
    modal.classList.add("show");
    document.getElementById("taskName").focus();
});

document.getElementById("closeBtn").addEventListener("click", function() {
    modal.classList.remove("show");
});

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

document.getElementById("themeBtn").addEventListener("click", function() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        this.textContent = "Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        this.textContent = "Dark Mode";
        localStorage.setItem("theme", "light");
    }
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeBtn").textContent = "Light Mode";
}

document.getElementById("date").textContent =
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

updatePage();

