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

// 파일 내용 저장 데이터
const fileContents = {};

// 파일 편집 모달 요소
const editContentModal = document.getElementById('edit-content-modal');
const fileContentTextarea = document.getElementById('file-content');
const editFileTitle = document.getElementById('edit-file-title');
const saveContentBtn = document.getElementById('save-content-btn');
const downloadFileBtn = document.getElementById('download-file-btn');

// 현재 선택된 전공
let currentSubject = null;

// 현재 편집 중인 파일 정보
let currentEditFile = null;
let currentEditSubject = null;

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
            openFile(fileName, subject);
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
    
    // 파일 카드 이벤트 수정
    card.querySelector('.file-open-btn').addEventListener('click', () => {
        openFile(fileName, subject);
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

// 파일 열기 함수
function openFile(fileName, subject) {
    currentEditFile = fileName;
    currentEditSubject = subject;
    
    // 모달 타이틀 설정
    editFileTitle.textContent = fileName;
    
    // 저장된 내용이 있으면 불러오기, 없으면 샘플 내용 생성
    const fileKey = `${subject.id}_${fileName}`;
    if (fileContents[fileKey]) {
        fileContentTextarea.value = fileContents[fileKey];
    } else {
        // 파일 유형에 따른 샘플 내용 생성
        const fileType = fileName.split('.').pop().toLowerCase();
        switch (fileType) {
            case 'txt':
                fileContentTextarea.value = `${fileName} 파일입니다.\n\n${subject.name} 전공에 관한 텍스트 파일입니다.\n작성일: ${new Date().toLocaleDateString()}`;
                break;
            case 'pdf':
                fileContentTextarea.value = `PDF 내용은 이 편집기에서 편집할 수 없습니다. 다운로드 후 PDF 뷰어로 열어주세요.`;
                break;
            case 'docx':
                fileContentTextarea.value = `Word 문서 내용입니다. 실제 Word 형식으로 다운로드하려면 다운로드 버튼을 누르세요.`;
                break;
            case 'ppt':
                fileContentTextarea.value = `PowerPoint 프레젠테이션 내용입니다. 실제 PPT로 보려면 다운로드 버튼을 누르세요.`;
                break;
            default:
                fileContentTextarea.value = `${fileName} 파일의 내용을 여기에 작성하세요.`;
        }
    }
    
    // 모달 열기
    editContentModal.classList.add('active');
}

// 파일 내용 저장
saveContentBtn.addEventListener('click', () => {
    const content = fileContentTextarea.value;
    const fileKey = `${currentEditSubject.id}_${currentEditFile}`;
    
    // 내용 저장
    fileContents[fileKey] = content;
    
    // 저장 알림
    alert(`${currentEditFile} 파일이 저장되었습니다.`);
    
    // 모달 닫기
    editContentModal.classList.remove('active');
});

// 파일 다운로드
downloadFileBtn.addEventListener('click', () => {
    const content = fileContentTextarea.value;
    const fileName = currentEditFile;
    
    // 파일 타입에 맞는 MIME 타입 설정
    const fileType = fileName.split('.').pop().toLowerCase();
    let mimeType;
    
    switch (fileType) {
        case 'txt':
            mimeType = 'text/plain';
            break;
        case 'pdf':
            mimeType = 'application/pdf';
            break;
        case 'docx':
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            break;
        case 'ppt':
            mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
            break;
        default:
            mimeType = 'text/plain';
    }
    
    // Blob 객체 생성
    const blob = new Blob([content], { type: mimeType });
    
    // 다운로드 링크 생성 및 클릭
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // 메모리 누수 방지를 위한 URL 해제
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }, 100);
});

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

// 그래프 뷰 관련 변수
const listViewBtn = document.getElementById('list-view-btn');
const graphViewBtn = document.getElementById('graph-view-btn');
const listContainer = document.getElementById('list-container');
const graphContainer = document.getElementById('graph-container');
let graphInitialized = false;
let graphSvg, graphSimulation, graphNodes, graphLinks;

// 그래프 뷰 초기화
function initGraphView() {
    const width = graphContainer.clientWidth;
    const height = graphContainer.clientHeight;
    
    // 기존 그래프 삭제
    d3.select("#graph-view svg").remove();
    
    // 그래프 데이터 준비
    const nodes = [];
    const links = [];
    
    // 중앙 노드 추가 (루트)
    nodes.push({
        id: "root",
        name: "전공 노트",
        group: 0,
        size: 20
    });
    
    // 전공 노드 추가
    subjects.forEach(subject => {
        nodes.push({
            id: subject.id,
            name: subject.name,
            group: 1,
            size: 15,
            color: subject.color
        });
        
        // 루트와 전공 연결
        links.push({
            source: "root",
            target: subject.id,
            value: 2
        });
        
        // 파일 노드 추가
        subject.files.forEach(file => {
            const fileId = `${subject.id}-${file}`;
            nodes.push({
                id: fileId,
                name: file,
                group: 2,
                size: 10,
                parentId: subject.id
            });
            
            // 전공과 파일 연결
            links.push({
                source: subject.id,
                target: fileId,
                value: 1
            });
        });
    });
    
    graphNodes = nodes;
    graphLinks = links;
    
    // SVG 생성 및 설정
    graphSvg = d3.select("#graph-view")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", [0, 0, width, height])
        .call(d3.zoom().on("zoom", (event) => {
            g.attr("transform", event.transform);
        }));
    
    const g = graphSvg.append("g");
    
    // 노드 개수에 따라 포스 설정을 다르게 함
    const totalNodes = nodes.length;
    const isLargeGraph = totalNodes >= 6; // 6개 이상인 경우 대규모 그래프로 간주
    
    // 링크 거리 및 전하력 계산 - 노드 수에 따라 조정
    const linkDistance = isLargeGraph ? 180 : 100; // 노드가 많으면 링크 거리 증가
    const chargeStrength = isLargeGraph ? -800 : -300; // 노드가 많으면 반발력 증가
    const centerForceStrength = isLargeGraph ? 0.01 : 1; // 노드가 많으면 중앙으로 당기는 힘 감소
    
    // 시뮬레이션 설정
    graphSimulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(linkDistance))
        .force("charge", d3.forceManyBody().strength(chargeStrength))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(centerForceStrength));
    
    // 노드가 많은 경우 추가 포스 설정
    if (isLargeGraph) {
        // 충돌 감지 - 노드 겹침 방지
        graphSimulation.force("collide", d3.forceCollide().radius(d => d.size * 2).strength(0.7));
        
        // 파일 노드끼리 같은 전공 내에서 클러스터링
        graphSimulation.force("x", d3.forceX().x(d => {
            if (d.group === 2) { // 파일 노드
                const subject = subjects.find(s => s.id === d.parentId);
                if (subject) {
                    const idx = subjects.indexOf(subject);
                    return width/2 + Math.cos(idx * 2 * Math.PI / subjects.length) * width/3;
                }
            }
            return width/2;
        }).strength(d => d.group === 2 ? 0.2 : 0.05));
        
        graphSimulation.force("y", d3.forceY().y(d => {
            if (d.group === 2) { // 파일 노드
                const subject = subjects.find(s => s.id === d.parentId);
                if (subject) {
                    const idx = subjects.indexOf(subject);
                    return height/2 + Math.sin(idx * 2 * Math.PI / subjects.length) * height/3;
                }
            }
            return height/2;
        }).strength(d => d.group === 2 ? 0.2 : 0.05));
    }
    
    // 링크 생성
    const link = g.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));
    
    // 노드 생성
    const node = g.append("g")
        .selectAll(".node")
        .data(nodes)
        .join("g")
        .attr("class", "node")
        .call(drag(graphSimulation));
    
    // 노드 원 생성
    node.append("circle")
        .attr("r", d => d.size)
        .attr("fill", d => d.color || colorByGroup(d.group))
        .on("click", (event, d) => {
            if (d.group === 1) { // 전공 노드 클릭 시
                const subject = subjects.find(s => s.id === d.id);
                if (subject) {
                    // 리스트 뷰로 전환
                    listViewBtn.click();
                    // 해당 전공 선택
                    const subjectHeader = document.querySelector(`.tree-item-header[data-id="${d.id}"]`);
                    if (subjectHeader) {
                        subjectHeader.click();
                    }
                }
            } else if (d.group === 2) { // 파일 노드 클릭 시
                // 파일 이름과 전공 ID 추출
                const fileName = d.name;
                const subjectId = d.parentId;
                const subject = subjects.find(s => s.id === subjectId);
                
                if (subject) {
                    openFile(fileName, subject);
                }
            }
        });
    
    // 노드 텍스트 생성
    node.append("text")
        .attr("dy", d => d.size + 12)
        .text(d => d.name);
    
    // 시뮬레이션 업데이트
    graphSimulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        node
            .attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    // 그룹별 색상 설정
    function colorByGroup(group) {
        const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"];
        return colors[group % colors.length];
    }

    // 드래그 기능 설정
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    
    // 확대/축소 버튼 이벤트
    document.getElementById('zoom-in').addEventListener('click', () => {
        const currentTransform = d3.zoomTransform(graphSvg.node());
        graphSvg.transition().duration(300).call(
            d3.zoom().transform,
            d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(currentTransform.k * 1.5)
        );
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
        const currentTransform = d3.zoomTransform(graphSvg.node());
        graphSvg.transition().duration(300).call(
            d3.zoom().transform,
            d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(currentTransform.k / 1.5)
        );
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
        const width = graphContainer.clientWidth;
        const height = graphContainer.clientHeight;
        graphSvg.transition().duration(500).call(
            d3.zoom().transform,
            d3.zoomIdentity.translate(width/2, height/2).scale(1)
        );
        
        // 노드들의 위치도 중앙으로 재설정
        graphSimulation.force("center", d3.forceCenter(width / 2, height / 2));
        graphSimulation.alpha(1).restart(); // 시뮬레이션 다시 실행
    });
    
    graphInitialized = true;
}

// 그래프 뷰 업데이트 함수
function updateGraphView() {
    // 그래프가 이미 초기화되었는지 여부에 상관없이 항상 업데이트
    if (graphInitialized) {
        // 그래프 데이터 재생성
        initGraphView();
    }
}

// 트리 메뉴 업데이트 함수 수정
function updateTreeMenu() {
    subjectsTree.innerHTML = '';
    initTreeMenu();
    updateGraphView(); // 그래프 뷰도 함께 업데이트
}

// 모달 열기 관련 함수 개선
addSubjectBtn.addEventListener('click', () => {
    // 다른 모달이 열려있을 경우 닫기
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // 전공 추가 모달 열기
    addSubjectModal.classList.add('active');
});

addFileBtn.addEventListener('click', () => {
    // 다른 모달이 열려있을 경우 닫기
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    
    // 전공 선택 드롭다운 초기화
    const fileSubjectSelect = document.getElementById('file-subject');
    fileSubjectSelect.innerHTML = '';
    
    // 전공 목록 추가
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject.id;
        option.textContent = subject.name;
        if (currentSubject && subject.id === currentSubject.id) {
            option.selected = true;
        }
        fileSubjectSelect.appendChild(option);
    });
    
    // 파일 추가 모달 열기
    document.getElementById('file-name').value = ''; // 입력 필드 초기화
    addFileModal.classList.add('active');
});

// 파일 추가 이벤트 핸들러 수정
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
            // 파일 중복 검사
            if (subject.files.includes(fullFileName)) {
                alert(`이미 '${fullFileName}' 파일이 존재합니다.`);
                return;
            }
            
            subject.files.push(fullFileName);
            // 새 파일의 내용 초기화
            const fileKey = `${subject.id}_${fullFileName}`;
            fileContents[fileKey] = `${fullFileName}\n\n새로 생성된 파일입니다. 내용을 입력하세요.`;
            
            // 트리 및 그래프 업데이트
            updateTreeMenu();
            
            // 그래프 뷰 강제 업데이트
            graphInitialized = false; // 그래프 초기화 상태 리셋
            
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

// 전공 추가 이벤트 핸들러 수정
saveSubjectBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('subject-name');
    const subjectName = nameInput.value.trim();
    
    if (subjectName) {
        // 새 전공 추가
        const id = subjectName.toLowerCase().replace(/\s+/g, '_');
        
        // 전공 중복 검사
        if (subjects.some(s => s.id === id || s.name === subjectName)) {
            alert(`이미 '${subjectName}' 전공이 존재합니다.`);
            return;
        }
        
        const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#16a085', '#3498db', '#e67e22', '#1abc9c'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const newSubject = {
            id,
            name: subjectName,
            color,
            files: []
        };
        
        subjects.push(newSubject);
        
        // 트리 및 그래프 업데이트
        updateTreeMenu();
        
        // 그래프 뷰 강제 업데이트
        graphInitialized = false; // 그래프 초기화 상태 리셋
        
        showSubjectFiles(newSubject);
        currentSubject = newSubject;
        currentTitle.textContent = `${newSubject.name} 파일`;
        currentColor.style.backgroundColor = newSubject.color;
        
        nameInput.value = '';
        addSubjectModal.classList.remove('active');
    }
});

// 뷰 전환 이벤트
listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add('active');
    graphViewBtn.classList.remove('active');
    listContainer.style.display = 'flex';
    graphContainer.style.display = 'none';
});

graphViewBtn.addEventListener('click', () => {
    graphViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    graphContainer.style.display = 'block';
    listContainer.style.display = 'none';
    
    // 항상 그래프 다시 그리기
    initGraphView();
});

// 초기화 코드
initTreeMenu();
showAllFiles();
// 기본적으로 리스트 뷰로 시작
listViewBtn.classList.add('active');
graphViewBtn.classList.remove('active');
listContainer.style.display = 'flex';
graphContainer.style.display = 'none';

// 모달 닫기 버튼에 이벤트 추가 - 코드 하단으로 이동
document.querySelectorAll('.modal-close, .modal-close-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = button.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
        }
    });
});
