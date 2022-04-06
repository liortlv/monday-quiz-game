const playButton = document.querySelector('#play');

const easyButton = document.createElement("div");
const mediumButton = document.createElement("div");
const hardButton = document.createElement("div");

playButton.addEventListener('click', e => {
    playButton.append(easyButton);
    playButton.append(mediumButton);
    playButton.append(hardButton);

    easyButton.innerText = 'Easy';
    mediumButton.innerText = 'Medium';
    hardButton.innerText = 'Hard';

    easyButton.classList.add('levelButton');
    mediumButton.classList.add('levelButton');
    hardButton.classList.add('levelButton');
}, { once: true })

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