// 로그인 폼 처리
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // TODO: 실제 백엔드 API 연동
            console.log('로그인 시도:', { email, password });
            
            // 임시 로그인 성공 처리
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            
            alert('로그인 성공!');
            window.location.href = 'index.html';
        } catch (error) {
            const shouldSignup = confirm('로그인에 실패했습니다. 회원가입을 하시겠습니까?');
            if (shouldSignup) {
                window.location.href = 'signup.html';
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
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            // TODO: 실제 백엔드 API 연동
            console.log('회원가입 시도:', { name, email, password });
            
            alert('회원가입이 완료되었습니다!');
            window.location.href = 'login.html';
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
    const signupLink = document.querySelector('.signup');

    if (isLoggedIn) {
        if (loginLink) {
            loginLink.textContent = '로그아웃';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userEmail');
                window.location.href = 'login.html';
            });
        }
        if (signupLink) signupLink.style.display = 'none';
    } else {
        if (loginLink) {
            loginLink.textContent = '로그인';
            loginLink.href = 'login.html';
        }
        if (signupLink) signupLink.style.display = 'inline-block';
    }
}

// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', updateAuthUI); 