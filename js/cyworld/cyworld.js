// 사이월드 기능을 위한 JS

// DOM 요소
const cyBgmPlay = document.getElementById('cy-bgm-play');
const cyBgmStop = document.getElementById('cy-bgm-stop');
const cyMenuNotes = document.getElementById('cy-menu-notes');
const cyMenuGraph = document.getElementById('cy-menu-graph');
const cyMenuAddSubject = document.getElementById('cy-menu-add-subject');
const cyMenuAddFile = document.getElementById('cy-menu-add-file');
const cyGuestbookForm = document.querySelector('.cy-guestbook-form button');
const cyGuestbookTextarea = document.querySelector('.cy-guestbook-form textarea');
const cyGuestbookEntries = document.querySelector('.cy-guestbook-entries');
const cySkinOptions = document.querySelectorAll('.cy-skin-option');

// BGM 오디오 요소 생성
const bgmAudio = new Audio();
bgmAudio.src = 'https://drive.google.com/uc?export=download&id=1X4RJ41zj86JE0rKJphoqdfCpdiQMYNPy';
// 이미지 파일이 없으므로 Google Drive 등에서 공유된 URL을 사용하여 샘플 BGM 제공
// 실제로는 로컬 파일 경로(예: '../../audio/cyworld/cyworld-bgm.mp3')를 사용할 수 있습니다.
bgmAudio.loop = true;
bgmAudio.volume = 0.5;

// 효과음 생성
const clickSound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

// 페이지 로드시 방문자 수 업데이트
function updateVisitorCount() {
    const todayCount = document.querySelector('.cy-header-today strong:first-child');
    const totalCount = document.querySelector('.cy-header-today strong:last-child');
    
    // 로컬스토리지에서 방문자 카운트 가져오기
    let today = parseInt(localStorage.getItem('cy-today-count') || '0');
    let total = parseInt(localStorage.getItem('cy-total-count') || '0');
    
    // 방문자 카운트 증가
    today++;
    total++;
    
    // 업데이트된 카운트 저장
    localStorage.setItem('cy-today-count', today);
    localStorage.setItem('cy-total-count', total);
    
    // 화면에 표시
    if (todayCount) todayCount.textContent = today;
    if (totalCount) totalCount.textContent = total.toLocaleString();
}

// BGM 컨트롤
if(cyBgmPlay) {
    cyBgmPlay.addEventListener('click', () => {
        playClickSound();
        bgmAudio.play().catch(e => console.log('BGM 재생 실패:', e));
        cyBgmPlay.style.color = '#ff5e5e';
        cyBgmStop.style.color = '';
    });
}

if(cyBgmStop) {
    cyBgmStop.addEventListener('click', () => {
        playClickSound();
        bgmAudio.pause();
        bgmAudio.currentTime = 0;
        cyBgmStop.style.color = '#ff5e5e';
        cyBgmPlay.style.color = '';
    });
}

// 메뉴 클릭 이벤트
if(cyMenuNotes) {
    cyMenuNotes.addEventListener('click', (e) => {
        e.preventDefault();
        playClickSound();
        // 메뉴 활성화
        document.querySelectorAll('.cy-menu a').forEach(item => item.classList.remove('active'));
        cyMenuNotes.classList.add('active');
        
        // 리스트 뷰로 전환
        document.getElementById('list-view-btn').click();
    });
}

if(cyMenuGraph) {
    cyMenuGraph.addEventListener('click', (e) => {
        e.preventDefault();
        playClickSound();
        // 메뉴 활성화
        document.querySelectorAll('.cy-menu a').forEach(item => item.classList.remove('active'));
        cyMenuGraph.classList.add('active');
        
        // 그래프 뷰로 전환
        document.getElementById('graph-view-btn').click();
    });
}

if(cyMenuAddSubject) {
    cyMenuAddSubject.addEventListener('click', (e) => {
        e.preventDefault();
        playClickSound();
        // 메뉴 활성화
        document.querySelectorAll('.cy-menu a').forEach(item => item.classList.remove('active'));
        cyMenuAddSubject.classList.add('active');
        
        // 전공 추가 모달 오픈
        document.getElementById('add-subject-btn').click();
    });
}

if(cyMenuAddFile) {
    cyMenuAddFile.addEventListener('click', (e) => {
        e.preventDefault();
        playClickSound();
        // 메뉴 활성화
        document.querySelectorAll('.cy-menu a').forEach(item => item.classList.remove('active'));
        cyMenuAddFile.classList.add('active');
        
        // 파일 추가 모달 오픈
        document.getElementById('add-file-btn').click();
    });
}

// 방명록 추가
if(cyGuestbookForm) {
    cyGuestbookForm.addEventListener('click', () => {
        playClickSound();
        const content = cyGuestbookTextarea.value.trim();
        if (!content) return;
        
        // 현재 시간
        const now = new Date();
        const dateString = `${now.getFullYear()}.${(now.getMonth()+1).toString().padStart(2, '0')}.${now.getDate().toString().padStart(2, '0')}`;
        
        // 방명록 엔트리 생성
        const entry = document.createElement('div');
        entry.className = 'cy-guestbook-entry';
        entry.innerHTML = `
            <div class="cy-guestbook-profile">
                <img src="img/cyworld/user.jpg" alt="방문자" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"40\" height=\"40\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"10\" r=\"4\" fill=\"%23ccc\"/><path d=\"M12 14c-4.41 0-8 1.79-8 4v2h16v-2c0-2.21-3.59-4-8-4z\" fill=\"%23ccc\"/></svg>'">
            </div>
            <div class="cy-guestbook-content">
                <div class="cy-guestbook-info">
                    <span class="cy-guestbook-name">방문자</span>
                    <span class="cy-guestbook-date">${dateString}</span>
                </div>
                <p>${content}</p>
            </div>
        `;
        
        // 방명록에 추가
        if(cyGuestbookEntries) {
            cyGuestbookEntries.prepend(entry);
            cyGuestbookTextarea.value = '';
        }
    });
}

// 스킨 변경
if(cySkinOptions) {
    cySkinOptions.forEach(option => {
        option.addEventListener('click', () => {
            playClickSound();
            const skin = option.getAttribute('data-skin');
            changeSkin(skin);
        });
    });
}

// 스킨 변경 함수
function changeSkin(skin) {
    const container = document.querySelector('.cy-container');
    if(!container) return;
    
    // 기존 스킨 클래스 제거
    container.classList.remove('skin-default', 'skin-pink', 'skin-green', 'skin-orange');
    
    // 새 스킨 클래스 추가
    if (skin) {
        container.classList.add(`skin-${skin}`);
        localStorage.setItem('cy-skin', skin);
    }
}

// 효과음 재생
function playClickSound() {
    // 클릭 효과음 재생
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log('효과음 재생 실패:', e));
}

// 저장된 스킨 적용
window.addEventListener('DOMContentLoaded', () => {
    const savedSkin = localStorage.getItem('cy-skin');
    if (savedSkin) {
        changeSkin(savedSkin);
    }
    
    // 방문자 수 업데이트
    updateVisitorCount();
    
    // 사이월드 스타일 파일 카드로 변경
    applyCyStyle();
});

// 사이월드 스타일 파일 카드로 변경
function applyCyStyle() {
    // 파일 카드에 사이월드 스타일 적용
    document.querySelectorAll('.file-card').forEach(card => {
        card.classList.add('cy-file-card');
    });
    
    // 버튼에 사이월드 스타일 적용
    document.querySelectorAll('.action-buttons button, .graph-controls button').forEach(btn => {
        btn.classList.add('cy-btn');
    });
    
    // 모달에 사이월드 스타일 적용
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('cy-modal');
    });
}

// MutationObserver로 DOM 변화 감지하여 사이월드 스타일 적용
if(document.getElementById('files-grid')) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                applyCyStyle();
            }
        });
    });

    // 관찰 시작
    observer.observe(document.getElementById('files-grid'), {
        childList: true,
        subtree: true
    });
}

console.log('사이월드 스크립트 로딩 완료');
