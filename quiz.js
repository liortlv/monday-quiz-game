const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

const API_URL = 'https://opentdb.com/api.php?amount=100&encode=base64';
const SCORE_POINTS = 100;
const MAX_QUESTIONS = 5;

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions;

async function getApiQuestions() {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.results;
}

function startGame() {
    questionCounter = 1;
    score = 0;
    availableQuestions = questions;
    getNewQuestion();
}

function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);

        return window.location.assign('/end.html');
    }
    
    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    currentQuestion = questions[questionCounter];
    question.innerText = atob(currentQuestion.question);

    const allChoices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    shuffleArray(allChoices);
    let choiceCounter = 0;
    choices.forEach(choice => {
        choice.innerText = atob(allChoices[choiceCounter]);
        choiceCounter++;
    })
    acceptingAnswers = true;
    console.log(atob(currentQuestion.question));
    console.log(atob(currentQuestion.correct_answer));
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        let classToApply = btoa(selectedChoice.innerText) == currentQuestion.correct_answer ? 'correct' : 'incorrect';


        if (classToApply === 'correct') {
            incrementScore(SCORE_POINTS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 2000)
    })
})

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

(async function main() {
    questions = await getApiQuestions();
    startGame()
})()