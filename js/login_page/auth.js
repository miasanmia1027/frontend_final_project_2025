// 로그인 폼 처리
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nickname = document.getElementById('nickname').value;
        const password = document.getElementById('password').value;

        try {
            // TODO: 실제 백엔드 API 연동
            console.log('로그인 시도:', { nickname, password });
            
            // 임시 로그인 성공 처리
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userNickname', nickname);
            
            alert('로그인 성공!');
            window.location.href = '../main_page/index.html';
        } catch (error) {
            const shouldSignup = confirm('로그인에 실패했습니다. 회원가입을 하시겠습니까?');
            if (shouldSignup) {
                window.location.href = '../signup_page/signup.html';
            }
            console.error('로그인 에러:', error);
        }
    });
}

// 회원가입 폼 처리
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nickname = document.getElementById('nickname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // TODO: 실제 백엔드 API 연동
            console.log('회원가입 시도:', { nickname, email, password });
            
            // 임시 회원가입 성공 처리
            localStorage.setItem('userNickname', nickname);
            localStorage.setItem('userEmail', email);
            
            alert('회원가입이 완료되었습니다!');
            window.location.href = '../login_page/login.html';
        } catch (error) {
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            console.error('회원가입 에러:', error);
        }
    });
}

// 로그인 상태 확인 및 UI 업데이트
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginLink = document.querySelector('.login');
    const userNickname = localStorage.getItem('userNickname');

    if (isLoggedIn) {
        if (loginLink) {
            loginLink.textContent = '로그아웃';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('userNickname');
                window.location.href = '../login_page/login.html';
            });
        }
    } else {
        if (loginLink) {
            loginLink.textContent = '로그인';
            loginLink.href = '../login_page/login.html';
        }
    }
}

// 페이지 접근 제어 함수
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['index.html', 'login.html', 'signup.html'];
    
    if (!publicPages.includes(currentPage) && !isLoggedIn) {
        alert('이 페이지를 이용하려면 로그인이 필요합니다.');
        window.location.href = '../login_page/login.html';
        return false;
    }
    return true;
}

// 페이지 로드 시 로그인 상태 확인 및 접근 제어
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    checkAuth();
}); 