class PlannerApp {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.todos = this.loadTodos();
        this.init();
    }

    init() {
        this.renderCalendar();
        this.setupEventListeners();
        this.updateTreeGrowth();
    }

    setupEventListeners() {
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        document.getElementById('add-todo').addEventListener('click', () => {
            this.addTodo();
        });

        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        document.getElementById('close-todo').addEventListener('click', () => {
            this.closeTodoSection();
        });
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update calendar title
        document.getElementById('calendar-title').textContent = 
            `${year}년 ${month + 1}월`;

        // Clear existing calendar days
        const existingDays = document.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarGrid = document.getElementById('calendar-grid');

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(currentDay, month);
            calendarGrid.appendChild(dayElement);
        }
    }

    createDayElement(date, currentMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (date.getMonth() !== currentMonth) {
            dayElement.classList.add('other-month');
        }

        const dateString = this.formatDate(date);
        const dayTodos = this.todos[dateString] || [];
        
        if (dayTodos.length > 0) {
            dayElement.classList.add('has-todos');
        }

        dayElement.innerHTML = `
            <span>${date.getDate()}</span>
            ${dayTodos.length > 0 ? `<span class="todo-count">${dayTodos.length}</span>` : ''}
        `;

        dayElement.addEventListener('click', () => {
            this.selectDate(date);
        });

        return dayElement;
    }

    selectDate(date) {
        this.selectedDate = date;
        
        // Update selected day styling
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        event.target.closest('.calendar-day').classList.add('selected');

        // Show todo section
        document.getElementById('todo-section').classList.add('active');
        document.getElementById('selected-date').textContent = 
            `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

        this.renderTodos();
    }

    renderTodos() {
        if (!this.selectedDate) return;

        const dateString = this.formatDate(this.selectedDate);
        const dayTodos = this.todos[dateString] || [];
        const todoList = document.getElementById('todo-list');

        todoList.innerHTML = '';

        dayTodos.forEach((todo, index) => {
            const todoElement = this.createTodoElement(todo, index, dateString);
            todoList.appendChild(todoElement);
        });
    }

    createTodoElement(todo, index, dateString) {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        todoElement.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="planner.toggleTodo('${dateString}', ${index})">
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button class="delete-btn" onclick="planner.deleteTodo('${dateString}', ${index})">
                    🗑️
                </button>
            </div>
        `;

        return todoElement;
    }

    addTodo() {
        if (!this.selectedDate) return;

        const input = document.getElementById('todo-input');
        const text = input.value.trim();
        
        if (!text) return;

        const dateString = this.formatDate(this.selectedDate);
        
        if (!this.todos[dateString]) {
            this.todos[dateString] = [];
        }

        this.todos[dateString].push({
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        });

        input.value = '';
        this.saveTodos();
        this.renderTodos();
        this.renderCalendar();
        this.updateTreeGrowth();
    }

    toggleTodo(dateString, index) {
        if (this.todos[dateString] && this.todos[dateString][index]) {
            this.todos[dateString][index].completed = !this.todos[dateString][index].completed;
            this.saveTodos();
            this.renderTodos();
            this.updateTreeGrowth();
        }
    }

    deleteTodo(dateString, index) {
        if (this.todos[dateString]) {
            this.todos[dateString].splice(index, 1);
            if (this.todos[dateString].length === 0) {
                delete this.todos[dateString];
            }
            this.saveTodos();
            this.renderTodos();
            this.renderCalendar();
            this.updateTreeGrowth();
        }
    }

    closeTodoSection() {
        document.getElementById('todo-section').classList.remove('active');
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        this.selectedDate = null;
    }

    updateTreeGrowth() {
        const totalTodos = this.getTotalTodos();
        const completedTodos = this.getCompletedTodos();
        const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

        // Update progress text
        document.getElementById('progress-text').textContent = 
            `진행률: ${Math.round(completionRate)}% (${completedTodos}/${totalTodos})`;

        // Update tree growth
        const tree = document.getElementById('tree');
        tree.className = 'tree';

        if (completionRate >= 25) {
            tree.classList.add('growth-1');
        }
        if (completionRate >= 50) {
            tree.classList.add('growth-2');
        }
        if (completionRate >= 75) {
            tree.classList.add('growth-3');
        }
    }

    getTotalTodos() {
        let total = 0;
        Object.values(this.todos).forEach(dayTodos => {
            total += dayTodos.length;
        });
        return total;
    }

    getCompletedTodos() {
        let completed = 0;
        Object.values(this.todos).forEach(dayTodos => {
            completed += dayTodos.filter(todo => todo.completed).length;
        });
        return completed;
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('planner-todos');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading todos:', error);
            return {};
        }
    }

    saveTodos() {
        try {
            localStorage.setItem('planner-todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    }
}

// Initialize the app
const planner = new PlannerApp();
