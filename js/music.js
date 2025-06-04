// 음악 추천
const musicRecommendations = [
    "NCT wish - steady",
    "NCT wish - wish",
    "NCT wish - poppop",
    "NCT wish - Hands Up",
    "NCT wish - NASA"
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