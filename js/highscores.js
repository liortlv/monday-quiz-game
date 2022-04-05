const highScoresList = document.querySelector('#highScoresList');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

highScores.map (score => {
    const  li = document.createElement('li');
    li.classList.add('high-score');
    li.textContent = `${score.name} - ${score.score}`;
    highScoresList.appendChild(li);
})