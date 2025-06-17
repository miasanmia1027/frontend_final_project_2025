// 현재 날짜 표시
function updateDate() {
    const now = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    };
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
      dateElement.textContent = now.toLocaleDateString('ko-KR', options);
    }
  }
  
  // 날씨 정보 랜덤 표시
  function getWeather() {
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const tempText = document.querySelector('.weather');
  
    const weatherTypes = [
      { image: 'sunny.jpg', desc: '맑음', temp: '22°C' },
      { image: 'cloudy.jpg', desc: '흐림', temp: '18°C' },
      { image: 'rainy.jpg', desc: '비', temp: '14°C' }
    ];
  
    const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
    if (weatherIcon) weatherIcon.src = `../../assets/weather/${weather.image}`;
    if (weatherInfo) weatherInfo.textContent = `현재 날씨: ${weather.desc}`;
    if (tempText) tempText.textContent = weather.temp;
  }
  
  // 별자리 운세
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
  
  // 명언
  const quotes = [
    { text: "달을 향해 쏴라 빗나가도 별이 될테니" },
    { text: "너의 상상으로 만든 불안에 지지마" },
    { text: "마음이 불안한건 실력이 부족해서가 아니라 꿈이 너무 간절하기 때문."},
    { text: "도망친 곳에 낙원은 없다."},
    { text: "인간은 한때의 기억으로 평생을 살아간다."}
  ];
  
  // 랜덤 요소 추출
  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // 초기 실행
  document.addEventListener('DOMContentLoaded', () => {
    // 네비게이션 표시
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.top-nav a').forEach(link => {
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  
    // 날짜, 날씨, 명언, 운세
    updateDate();
    getWeather();
  
    const zodiacSign = getRandomElement(Object.keys(zodiacFortunes));
    const zodiacEl = document.getElementById('zodiac-fortune');
    if (zodiacEl) zodiacEl.textContent = `${zodiacSign}: ${zodiacFortunes[zodiacSign]}`;
  
    const quote = getRandomElement(quotes);
    const quoteTextEl = document.getElementById('daily-quote');
    const quoteAuthorEl = document.getElementById('quote-author');
    if (quoteTextEl) quoteTextEl.textContent = quote.text;
    if (quoteAuthorEl) quoteAuthorEl.textContent = `- ${quote.text}`;
  
    // 캘린더 틀 유지용 (내용 제거)
    const calendarDaysEl = document.getElementById('calendar-days');
    const monthYearEl = document.getElementById('current-month-year');
    const weekdaysEl = document.getElementById('calendar-weekdays');
  
    if (calendarDaysEl) {
      calendarDaysEl.innerHTML = `<div style="text-align:center; color:#888; width:100%; padding:20px;">
        📅 캘린더 기능은 준비 중입니다!
      </div>`;
    }
    if (monthYearEl) monthYearEl.textContent = '';
    if (weekdaysEl) weekdaysEl.innerHTML = '';
    
    // 유튜브 재생 버튼
    document.getElementById('play')?.addEventListener('click', () => {
      window.open('https://www.youtube.com/watch?v=LNETckymbzk', '_blank');
    });
  });
  
  