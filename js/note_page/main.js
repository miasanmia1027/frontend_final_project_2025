// 전공 데이터
const subjects = [
    { id: 'computer', name: '컴퓨터공학', color: '#e74c3c', 
      files: ['알고리즘 기초.txt', '자료구조 요약.pdf', '프로그래밍 언어론.ppt'] },
    { id: 'math', name: '수학', color: '#2ecc71',
      files: ['미적분학 노트.txt', '선형대수 문제풀이.pdf', '확률과 통계.docx'] },
    { id: 'physics', name: '물리학', color: '#f39c12',
      files: ['역학 노트.pdf', '전자기학 정리.txt', '양자역학 기초.ppt'] },
    { id: 'chemistry', name: '화학', color: '#9b59b6',
      files: ['유기화학 반응.txt', '무기화학 요약.pdf', '분석화학 실험.docx'] },
    { id: 'biology', name: '생물학', color: '#16a085',
      files: ['세포생물학.pdf', '유전학 노트.txt', '생태계 분석.docx'] },
    { id: 'literature', name: '문학', color: '#3498db',
      files: ['현대시 분석.pdf', '소설의 이해.txt', '문학 비평.docx'] }
];

// DOM 요소
const subjectsTree = document.getElementById('subjects-tree');
const filesGrid = document.getElementById('files-grid');
const currentTitle = document.getElementById('current-title');
const currentColor = document.getElementById('current-color');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// 모달 요소
const addSubjectModal = document.getElementById('add-subject-modal');
const addFileModal = document.getElementById('add-file-modal');
const addSubjectBtn = document.getElementById('add-subject-btn');
const addFileBtn = document.getElementById('add-file-btn');
const saveSubjectBtn = document.getElementById('save-subject-btn');
const saveFileBtn = document.getElementById('save-file-btn');
const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-close-btn');

// 현재 선택된 전공
let currentSubject = null;

// 트리 메뉴 초기화
function initTreeMenu() {
    // 모든 파일 항목
    const allFilesItem = document.createElement('li');
    allFilesItem.className = 'tree-item';
    allFilesItem.innerHTML = `
        <div class="tree-item-header active" data-id="all">
            <div class="tree-item-color" style="background-color: #3498db;"></div>
            <span>모든 파일</span>
        </div>
    `;
    subjectsTree.appendChild(allFilesItem);
    
    // 전공별 트리 아이템
    subjects.forEach(subject => {
        const treeItem = createSubjectTreeItem(subject);
        subjectsTree.appendChild(treeItem);
    });
    
    // 트리 아이템 클릭 이벤트
    subjectsTree.addEventListener('click', handleTreeClick);
}

// 전공 트리 아이템 생성
function createSubjectTreeItem(subject) {
    const li = document.createElement('li');
    li.className = 'tree-item';
    
    li.innerHTML = `
        <div class="tree-item-header" data-id="${subject.id}">
            <div class="tree-item-toggle">+</div>
            <div class="tree-item-color" style="background-color: ${subject.color};"></div>
            <span>${subject.name}</span>
        </div>
        <ul class="tree-item-children" data-parent="${subject.id}">
            ${subject.files.map(file => `
                <li class="tree-item">
                    <div class="tree-item-header" data-id="${subject.id}" data-file="${file}">
                        <div class="tree-item-color" style="background-color: transparent;"></div>
                        <span>${file}</span>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;
    
    return li;
}

// 트리 클릭 이벤트 처리
function handleTreeClick(e) {
    const header = e.target.closest('.tree-item-header');
    if (!header) return;
    
    // 활성화된 항목 표시
    document.querySelectorAll('.tree-item-header.active').forEach(item => {
        item.classList.remove('active');
    });
    header.classList.add('active');
    
    // 토글 버튼 클릭 처리
    if (e.target.classList.contains('tree-item-toggle')) {
        const parentId = header.dataset.id;
        const childrenContainer = document.querySelector(`.tree-item-children[data-parent="${parentId}"]`);
        
        if (childrenContainer) {
            childrenContainer.classList.toggle('expanded');
            e.target.textContent = childrenContainer.classList.contains('expanded') ? '-' : '+';
            return;
        }
    }
    
    // 파일 표시
    const subjectId = header.dataset.id;
    const fileName = header.dataset.file;
    
    if (subjectId === 'all') {
        // 모든 파일 표시
        showAllFiles();
        currentSubject = null;
        currentTitle.textContent = '모든 파일';
        currentColor.style.backgroundColor = '#3498db';
    } else if (fileName) {
        // 특정 파일 열기
        const subject = subjects.find(s => s.id === subjectId);
        if (subject) {
            alert(`${fileName} 파일을 엽니다.`);
        }
    } else {
        // 전공별 파일 표시
        const subject = subjects.find(s => s.id === subjectId);
        if (subject) {
            showSubjectFiles(subject);
            currentSubject = subject;
            currentTitle.textContent = `${subject.name} 파일`;
            currentColor.style.backgroundColor = subject.color;
        }
    }
}

// 모든 파일 표시
function showAllFiles() {
    filesGrid.innerHTML = '';
    subjects.forEach(subject => {
        subject.files.forEach(fileName => {
            const fileCard = createFileCard(fileName, subject);
            filesGrid.appendChild(fileCard);
        });
    });
}

// 전공별 파일 표시
function showSubjectFiles(subject) {
    filesGrid.innerHTML = '';
    subject.files.forEach(fileName => {
        const fileCard = createFileCard(fileName, subject);
        filesGrid.appendChild(fileCard);
    });
}

// 파일 카드 생성
function createFileCard(fileName, subject) {
    const fileType = fileName.split('.').pop().toLowerCase();
    
    const card = document.createElement('div');
    card.className = 'file-card';
    card.setAttribute('draggable', true);
    card.dataset.file = fileName;
    card.dataset.subject = subject.id;
    
    card.innerHTML = `
        <div class="file-card-header">
            <div class="file-icon ${fileType}">${fileType}</div>
            <div class="file-name">${fileName}</div>
        </div>
        <div class="file-card-body">
            ${subject.name}
        </div>
        <div class="file-actions">
            <button class="file-action-btn file-open-btn">열기</button>
            <button class="file-action-btn file-edit-btn">수정</button>
            <button class="file-action-btn file-delete-btn">삭제</button>
        </div>
    `;
    
    // 파일 카드 이벤트
    card.querySelector('.file-open-btn').addEventListener('click', () => {
        alert(`${fileName} 파일을 엽니다.`);
    });
    
    card.querySelector('.file-edit-btn').addEventListener('click', () => {
        const newName = prompt('파일 이름 수정:', fileName);
        if (newName && newName !== fileName) {
            const index = subject.files.indexOf(fileName);
            subject.files[index] = newName;
            if (currentSubject === subject) {
                showSubjectFiles(subject);
            } else {
                showAllFiles();
            }
            updateTreeMenu();
        }
    });
    
    card.querySelector('.file-delete-btn').addEventListener('click', () => {
        if (confirm(`${fileName} 파일을 삭제하시겠습니까?`)) {
            const index = subject.files.indexOf(fileName);
            subject.files.splice(index, 1);
            if (currentSubject === subject) {
                showSubjectFiles(subject);
            } else {
                showAllFiles();
            }
            updateTreeMenu();
        }
    });
    
    // 드래그 앤 드롭 이벤트
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({
            file: fileName,
            fromSubject: subject.id
        }));
        card.classList.add('dragging');
    });
    
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });
    
    return card;
}

// 드래그 앤 드롭 이벤트 - 파일 이동
filesGrid.addEventListener('dragover', (e) => {
    e.preventDefault();
});

filesGrid.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!currentSubject) return; // 모든 파일 보기에서는 이동 불가
    
    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const fromSubject = subjects.find(s => s.id === data.fromSubject);
        
        if (fromSubject && fromSubject !== currentSubject) {
            // 파일 이동
            const index = fromSubject.files.indexOf(data.file);
            if (index !== -1) {
                fromSubject.files.splice(index, 1);
                currentSubject.files.push(data.file);
                showSubjectFiles(currentSubject);
                updateTreeMenu();
            }
        }
    } catch (err) {
        console.error('드래그 앤 드롭 오류:', err);
    }
});

// 트리 메뉴 업데이트
function updateTreeMenu() {
    subjectsTree.innerHTML = '';
    initTreeMenu();
}

// 검색 기능
searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        if (currentSubject) {
            showSubjectFiles(currentSubject);
        } else {
            showAllFiles();
        }
        return;
    }
    
    filesGrid.innerHTML = '';
    
    subjects.forEach(subject => {
        const matchingFiles = subject.files.filter(file => 
            file.toLowerCase().includes(query));
        
        matchingFiles.forEach(fileName => {
            const fileCard = createFileCard(fileName, subject);
            filesGrid.appendChild(fileCard);
        });
    });
    
    currentTitle.textContent = `"${query}" 검색 결과`;
}

// 모달 이벤트
addSubjectBtn.addEventListener('click', () => {
    addSubjectModal.classList.add('active');
});

addFileBtn.addEventListener('click', () => {
    const fileSubjectSelect = document.getElementById('file-subject');
    fileSubjectSelect.innerHTML = '';
    
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = subject.name;
        if (currentSubject && subject.id === currentSubject.id) {
            option.selected = true;
        }
        fileSubjectSelect.appendChild(option);
    });
    
    addFileModal.classList.add('active');
});

modalCloseButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = button.closest('.modal');
        modal.classList.remove('active');
    });
});

saveSubjectBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('subject-name');
    const subjectName = nameInput.value.trim();
    
    if (subjectName) {
        // 새 전공 추가
        const id = subjectName.toLowerCase().replace(/\s+/g, '_');
        const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#16a085', '#3498db', '#e67e22', '#1abc9c'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const newSubject = {
            id,
            name: subjectName,
            color,
            files: []
        };
        
        subjects.push(newSubject);
        updateTreeMenu();
        showSubjectFiles(newSubject);
        currentSubject = newSubject;
        currentTitle.textContent = `${newSubject.name} 파일`;
        currentColor.style.backgroundColor = newSubject.color;
        
        nameInput.value = '';
        addSubjectModal.classList.remove('active');
    }
});

saveFileBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('file-name');
    const typeSelect = document.getElementById('file-type');
    const subjectSelect = document.getElementById('file-subject');
    
    const fileName = nameInput.value.trim();
    const fileType = typeSelect.value;
    const subjectId = subjectSelect.value;
    
    if (fileName && subjectId) {
        const fullFileName = `${fileName}.${fileType}`;
        const subject = subjects.find(s => s.id === subjectId);
        
        if (subject) {
            subject.files.push(fullFileName);
            updateTreeMenu();
            
            if (currentSubject === subject) {
                showSubjectFiles(subject);
            } else {
                currentSubject = subject;
                showSubjectFiles(subject);
                currentTitle.textContent = `${subject.name} 파일`;
                currentColor.style.backgroundColor = subject.color;
            }
            
            nameInput.value = '';
            addFileModal.classList.remove('active');
        }
    }
});

// 초기화
initTreeMenu();
showAllFiles();
