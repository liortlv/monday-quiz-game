const playButton = document.querySelector('#play');

const easyButton = document.createElement("div");
const mediumButton = document.createElement("div");
const hardButton = document.createElement("div");

playButton.addEventListener('click', e => {
    showLevel(easyButton, 'Easy');
    showLevel(mediumButton, 'Medium');
    showLevel(hardButton, 'Hard');
}, { once: true })

function showLevel(button, level) {
    playButton.append(button);
    button.innerText = level;
    button.classList.add('levelButton');
}

easyButton.addEventListener('click', e => {
    sessionStorage.setItem('level', 'easy');
    location.href = '/quiz.html'
})

mediumButton.addEventListener('click', e => {
    sessionStorage.setItem('level', 'medium');
    location.href = '/quiz.html'
})

hardButton.addEventListener('click', e => {
    sessionStorage.setItem('level', 'hard');
    location.href = '/quiz.html'
})