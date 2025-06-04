// 음악 추천
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

// 페이지 로드시 실행
document.addEventListener('DOMContentLoaded', () => {
    
    // 음악 추천
    document.getElementById('music-recommendation').textContent = 
        getRandomElement(musicRecommendations);
}); 