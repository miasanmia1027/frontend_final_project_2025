// 플래너 앱 클래스 정의
class PlannerApp {
    constructor() {
        // 현재 날짜 저장
        this.currentDate = new Date();
        // 선택된 날짜 저장
        this.selectedDate = null;
        // 할 일 목록 불러오기
        this.todos = this.loadTodos();
        // 초기화 함수 호출
        this.init();
    }

    // 초기화 함수
    init() {
        this.renderCalendar(); // 달력 렌더링
        this.setupEventListeners(); // 이벤트 리스너 등록
        this.updateTreeGrowth(); // 나무 성장 상태 업데이트
        this.renderPendingTasks(); // 미완료 할 일 렌더링
    }

    // 이벤트 리스너 등록 함수
    setupEventListeners() {
        // 이전 달 버튼 클릭 시
        document.getElementById('prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        // 다음 달 버튼 클릭 시
        document.getElementById('next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // 할 일 추가 버튼 클릭 시
        document.getElementById('add-todo').addEventListener('click', () => {
            this.addTodo();
        });

        // 엔터키로 할 일 추가
        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // 할 일 창 닫기 버튼 클릭 시
        document.getElementById('close-todo').addEventListener('click', () => {
            this.closeTodoSection();
        });
    }

    // 달력 렌더링 함수
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // 달력 제목 업데이트
        document.getElementById('calendar-title').textContent = 
            `${year}년 ${month + 1}월`;

        // 기존 달력 날짜 삭제
        const existingDays = document.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // 이번 달의 첫째 날, 마지막 날 구하기
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        // 달력 시작 날짜(해당 달의 첫째 주 일요일) 구하기
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const calendarGrid = document.getElementById('calendar-grid');

        // 6주(42일) 만큼 달력 생성
        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            const dayElement = this.createDayElement(currentDay, month);
            calendarGrid.appendChild(dayElement);
        }
    }

    // 달력의 각 날짜 셀 생성 함수
    createDayElement(date, currentMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        // 이번 달이 아니면 흐리게 표시
        if (date.getMonth() !== currentMonth) {
            dayElement.classList.add('other-month');
        }

        const dateString = this.formatDate(date);
        const dayTodos = this.todos[dateString] || [];
        
        // 할 일이 있으면 표시
        if (dayTodos.length > 0) {
            dayElement.classList.add('has-todos');
        }

        dayElement.innerHTML = `
            <span>${date.getDate()}</span>
            ${dayTodos.length > 0 ? `<span class="todo-count">${dayTodos.length}</span>` : ''}
        `;

        // 날짜 클릭 시 해당 날짜 선택
        dayElement.addEventListener('click', () => {
            this.selectDate(date);
        });

        return dayElement;
    }

    // 날짜 선택 함수
    selectDate(date) {
        this.selectedDate = date;
        
        // 선택된 날짜 스타일 적용
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        event.target.closest('.calendar-day').classList.add('selected');

        // 할 일 섹션 보이기
        document.getElementById('todo-section').classList.add('active');
        document.getElementById('selected-date').textContent = 
            `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;

        this.renderTodos();
        this.updateTreeGrowth(); // 선택된 날짜에 따라 나무 업데이트
    }

    // 할 일 목록 렌더링 함수
    renderTodos() {
        if (!this.selectedDate) return;

        const dateString = this.formatDate(this.selectedDate);
        const dayTodos = this.todos[dateString] || [];
        const todoList = document.getElementById('todo-list');

        todoList.innerHTML = '';

        // 각 할 일 항목 생성
        dayTodos.forEach((todo, index) => {
            const todoElement = this.createTodoElement(todo, index, dateString);
            todoList.appendChild(todoElement);
        });
    }

    // 할 일 항목 생성 함수
    createTodoElement(todo, index, dateString) {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        // 체크박스, 텍스트, 삭제 버튼 포함
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

    // 할 일 추가 함수
    addTodo() {
        if (!this.selectedDate) return;

        const input = document.getElementById('todo-input');
        const text = input.value.trim();
        
        if (!text) return;

        const dateString = this.formatDate(this.selectedDate);
        
        if (!this.todos[dateString]) {
            this.todos[dateString] = [];
        }

        // 새 할 일 추가
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
        this.renderPendingTasks(); // 미완료 할 일 업데이트
    }

    // 할 일 완료 체크 토글 함수
    toggleTodo(dateString, index) {
        if (this.todos[dateString] && this.todos[dateString][index]) {
            this.todos[dateString][index].completed = !this.todos[dateString][index].completed;
            this.saveTodos();
            this.renderTodos();
            this.updateTreeGrowth();
            this.renderPendingTasks(); // 미완료 할 일 업데이트
        }
    }

    // 할 일 삭제 함수
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
            this.renderPendingTasks(); // 미완료 할 일 업데이트
        }
    }

    // 할 일 창 닫기 함수
    closeTodoSection() {
        document.getElementById('todo-section').classList.remove('active');
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        this.selectedDate = null;
        this.updateTreeGrowth(); // 선택된 날짜가 없을 때 전체 진행률로 업데이트
    }

    // 나무 성장 상태 업데이트 함수
    updateTreeGrowth() {
        let totalTodos = 0;
        let completedTodos = 0;
        
        // 선택된 날짜가 있으면 해당 날짜의 진행률만 표시
        if (this.selectedDate) {
            const dateString = this.formatDate(this.selectedDate);
            const dayTodos = this.todos[dateString] || [];
            totalTodos = dayTodos.length;
            completedTodos = dayTodos.filter(todo => todo.completed).length;
            
            // 날짜 정보 추가하여 표시
            document.getElementById('progress-text').textContent = 
                `${this.selectedDate.getMonth() + 1}월 ${this.selectedDate.getDate()}일 진행률: ${totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}% (${completedTodos}/${totalTodos})`;
        } 
        // 선택된 날짜가 없으면 전체 진행률 표시
        else {
            totalTodos = this.getTotalTodos();
            completedTodos = this.getCompletedTodos();
            document.getElementById('progress-text').textContent = 
                `전체 진행률: ${totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}% (${completedTodos}/${totalTodos})`;
        }

        const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

        // 나무 성장 단계 적용
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

    // 미완료 할 일 렌더링 함수
    renderPendingTasks() {
        const pendingList = document.getElementById('pending-tasks-list');
        pendingList.innerHTML = '';

        // 오늘 날짜
        const today = new Date();
        const todayString = this.formatDate(today);

        // 날짜별 정렬을 위해 미완료 할 일을 배열로 수집
        const pendingTasks = [];

        // 모든 날짜의 할 일 검색
        Object.keys(this.todos).forEach(dateString => {
            this.todos[dateString].forEach((todo, index) => {
                if (!todo.completed) {
                    const date = new Date(dateString);
                    pendingTasks.push({
                        date: date,
                        dateString: dateString,
                        text: todo.text,
                        index: index
                    });
                }
            });
        });

        // 날짜순으로 정렬 (오늘 할 일이 맨 위)
        pendingTasks.sort((a, b) => a.date - b.date);

        if (pendingTasks.length === 0) {
            pendingList.innerHTML = '<p>미완료된 할 일이 없습니다!</p>';
            return;
        }

        // 미완료 할 일 요소 생성
        pendingTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'pending-task-item';
            
            // 오늘 할 일인 경우 강조
            if (task.dateString === todayString) {
                taskElement.style.borderLeftColor = '#ff4757';
            }

            const dateObj = new Date(task.dateString);
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            
            taskElement.innerHTML = `
                <span class="pending-task-date">${month}월 ${day}일</span>
                <span class="pending-task-text">${task.text}</span>
                <button class="mark-complete-btn" onclick="planner.markComplete('${task.dateString}', ${task.index})">
                    완료하기
                </button>
            `;
            
            pendingList.appendChild(taskElement);
        });
    }

    // 미완료 할 일 완료 처리 함수
    markComplete(dateString, index) {
        if (this.todos[dateString] && this.todos[dateString][index]) {
            this.todos[dateString][index].completed = true;
            this.saveTodos();
            this.renderPendingTasks();
            this.updateTreeGrowth();
            
            // 현재 선택된 날짜의 할 일이라면 할 일 목록도 업데이트
            if (this.selectedDate && this.formatDate(this.selectedDate) === dateString) {
                this.renderTodos();
            }
            
            this.renderCalendar();
        }
    }

    // 전체 할 일 개수 구하는 함수
    getTotalTodos() {
        let total = 0;
        Object.values(this.todos).forEach(dayTodos => {
            total += dayTodos.length;
        });
        return total;
    }

    // 완료된 할 일 개수 구하는 함수
    getCompletedTodos() {
        let completed = 0;
        Object.values(this.todos).forEach(dayTodos => {
            completed += dayTodos.filter(todo => todo.completed).length;
        });
        return completed;
    }

    // 날짜를 문자열로 변환하는 함수 (YYYY-MM-DD)
    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 할 일 목록 로드 함수 (localStorage)
    loadTodos() {
        try {
            const saved = localStorage.getItem('planner-todos');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading todos:', error);
            return {};
        }
    }

    // 할 일 목록 저장 함수 (localStorage)
    saveTodos() {
        try {
            localStorage.setItem('planner-todos', JSON.stringify(this.todos));
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    }
}

// 앱 실행 (전역 planner 객체 생성)
const planner = new PlannerApp();
