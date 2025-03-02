document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.querySelector('input[name="priority"]:checked').value;

    if (!title) {
        alert('Görev başlığı boş bırakılamaz!');
        return;
    }

    addTask(title, description, priority);
    this.reset();
});

function addTask(title, description, priority) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <strong>${title}</strong>
            <p>${description}</p>
            <span>Öncelik: ${priority}</span>
        </div>
        <div>
            <button class="completeBtn">Tamamlandı</button>
            <button class="deleteBtn">Sil</button>
        </div>
    `;

    taskList.appendChild(li);
}

document.getElementById('taskList').addEventListener('click', function(event) {
    if (event.target.classList.contains('completeBtn')) {
        const taskItem = event.target.closest('li');
        taskItem.classList.toggle('completed');
        event.target.textContent = taskItem.classList.contains('completed') ? 'Tamamlanmadı' : 'Tamamlandı';
        saveTasksToLocalStorage();
    }

    if (event.target.classList.contains('deleteBtn')) {
        const taskItem = event.target.closest('li');
        taskItem.remove();
        saveTasksToLocalStorage(); 
    }
});

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();

    try {
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.querySelector('input[name="priority"]:checked');

        if (!title) {
            throw new Error('Görev başlığı boş bırakılamaz!');
        }

        if (!priority) {
            throw new Error('Öncelik seçilmelidir!');
        }

        addTask(title, description, priority.value);
        this.reset();
    } catch (error) {
        alert(error.message);
    }
});
document.getElementById('filterCompleted').addEventListener('click', function() {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        if (task.classList.contains('completed')) {
            task.style.display = 'flex';
        } else {
            task.style.display = 'none';
        }
    });
});
document.getElementById('showAll').addEventListener('click', function() {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        task.style.display = 'flex';
    });
});
function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(task => {
        const title = task.querySelector('strong').textContent;
        const description = task.querySelector('p').textContent;
        const priority = task.querySelector('span').textContent.split(': ')[1];
        const isCompleted = task.classList.contains('completed');
        tasks.push({ title, description, priority, isCompleted });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Görevleri localStorage'dan yükle
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTask(task.title, task.description, task.priority, task.isCompleted);
    });
}

document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);

function addTask(title, description, priority, isCompleted = false) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    if (isCompleted) {
        li.classList.add('completed');
    }
    li.innerHTML = `
        <div>
            <strong>${title}</strong>
            <p>${description}</p>
            <span>Öncelik: ${priority}</span>
        </div>
        <div>
            <button class="completeBtn">${isCompleted ? 'Tamamlanmadı' : 'Tamamlandı'}</button>
            <button class="deleteBtn">Sil</button>
        </div>
    `;

    taskList.appendChild(li);
    saveTasksToLocalStorage();
}
document.getElementById('sortByPriority').addEventListener('click', function() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.querySelectorAll('li'));

    tasks.sort((a, b) => {
        const priorityA = a.querySelector('span').textContent.split(': ')[1];
        const priorityB = b.querySelector('span').textContent.split(': ')[1];
        const priorityOrder = { 'Düşük': 1, 'Orta': 2, 'Yüksek': 3 };
        return priorityOrder[priorityA] - priorityOrder[priorityB];
    });

    taskList.innerHTML = '';
    tasks.forEach(task => taskList.appendChild(task));
});