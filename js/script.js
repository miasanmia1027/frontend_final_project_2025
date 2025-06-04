// 현재 날짜 표시
function updateDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    };
    document.getElementById('current-date').textContent = now.toLocaleDateString('ko-KR', options);
}

// 별자리 운세 데이터
const zodiacFortunes = {
    '양자리': '오늘은 새로운 도전을 시작하기 좋은 날입니다.',
    '황소자리': '재물운이 좋은 날이니 투자나 구매를 고려해보세요.',
    '쌍둥이자리': '대인관계가 원활해질 것입니다.',
    '게자리': '가족과의 시간이 행복을 가져다 줄 것입니다.',
    '사자자리': '리더십을 발휘할 수 있는 좋은 기회가 올 것입니다.',
    '처녀자리': '세심한 관찰력이 필요한 일을 처리하기 좋은 날입니다.',
    '천칭자리': '조화로운 관계를 맺을 수 있는 기회가 있습니다.',
    '전갈자리': '직관력이 예민해져 중요한 결정을 내리기 좋은 날입니다.',
    '사수자리': '여행이나 새로운 경험을 쌓기 좋은 날입니다.',
    '염소자리': '목표를 향해 한 걸음 더 나아갈 수 있는 날입니다.',
    '물병자리': '창의적인 아이디어가 떠오를 것입니다.',
    '물고기자리': '예술적 감각이 예민해져 창작활동에 좋은 날입니다.'
};

// 명언 데이터
const quotes = [
    { text: "오늘 할 수 있는 일을 내일로 미루지 마세요.", author: "벤자민 프랭클린" },
    { text: "작은 진전이라도 매일 이루어내세요.", author: "로버트 콜리어" },
    { text: "성공은 매일 반복된 작은 노력들의 합입니다.", author: "로버트 콜리어" },
    { text: "당신이 할 수 있다고 믿든 할 수 없다고 믿든, 당신이 옳습니다.", author: "헨리 포드" },
    { text: "오늘의 투자는 내일의 성공입니다.", author: "알렉산더 그레이엄 벨" }
];

// 날씨 정보 가져오기 (OpenWeatherMap API 사용 예시)
async function getWeather() {
    // 실제 구현시 API 키와 도시 정보를 사용해야 합니다
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.textContent = "날씨 정보를 불러오는 중...";
    
    // API 호출 예시 (실제 구현 필요)
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Seoul&appid=YOUR_API_KEY`);
    // const data = await response.json();
    // weatherInfo.textContent = `현재 기온: ${Math.round(data.main.temp - 273.15)}°C, ${data.weather[0].description}`;
}

// 음악 추천 데이터
const musicRecommendations = [
    "BTS - Dynamite",
    "IU - Celebrity",
    "NewJeans - Hype Boy",
    "LE SSERAFIM - UNFORGIVEN",
    "IVE - I AM"
];

// 랜덤 요소 선택 함수
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 캘린더 생성
function renderCalendar(year, month) {
    const calendarDaysEl = document.getElementById('calendar-days');
    const monthYearEl = document.getElementById('current-month-year');
    const weekdaysEl = document.getElementById('calendar-weekdays');

    // clear previous days
    calendarDaysEl.innerHTML = '';
    weekdaysEl.innerHTML = '';

    const date = new Date(year, month, 1);
    const firstDayOfMonth = date.getDay(); // 0 for Sunday, 6 for Saturday
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    // Display month and year
    monthYearEl.textContent = `${year}.${String(month + 1).padStart(2, '0')}`;

    // Display weekdays
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    weekdays.forEach(day => {
        const weekdayEl = document.createElement('div');
        weekdayEl.classList.add('weekday');
        weekdayEl.textContent = day;
        weekdaysEl.appendChild(weekdayEl);
    });

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day-cell');
         emptyCell.classList.add('empty'); // Add empty class
        calendarDaysEl.appendChild(emptyCell);
    }

    // Add day cells
    for (let day = 1; day <= lastDayOfMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.innerHTML = `<div class="date-number">${day}</div>`;
        // Add event rendering logic here if needed
        calendarDaysEl.appendChild(dayCell);
    }
}

// Navigate calendar
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    
    // 별자리 운세 표시
    const zodiacSign = getRandomElement(Object.keys(zodiacFortunes));
    document.getElementById('zodiac-fortune').textContent = 
        `${zodiacSign}: ${zodiacFortunes[zodiacSign]}`;
    
    // 명언 표시
    const quote = getRandomElement(quotes);
    document.getElementById('daily-quote').textContent = quote.text;
    document.getElementById('quote-author').textContent = `- ${quote.author}`;
    
    // 날씨 정보 가져오기
    getWeather();

    // Initial calendar render
    renderCalendar(currentYear, currentMonth);

    // Event listeners for calendar navigation
    document.querySelector('.month-navigation .prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });

    document.querySelector('.month-navigation .next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentYear, currentMonth);
    });

    document.getElementById('today-button').addEventListener('click', () => {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        renderCalendar(currentYear, currentMonth);
    });

    // 음악 추천 표시
    document.getElementById('music-recommendation').textContent = 
        getRandomElement(musicRecommendations);

    // Placeholder for memo and checklist functionality
    // const memoContent = document.getElementById('memo-content'); // Removed memo
    // if (memoContent) memoContent.placeholder = "오늘의 메모를 작성하세요...";

    // const checklistItems = document.getElementById('checklist-items'); // Removed checklist
    // Add logic to dynamically add/manage checklist items
}); 