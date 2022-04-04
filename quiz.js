const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const choiceContainer3 = document.querySelector('.choice-container3');
const choiceContainer4 = document.querySelector('.choice-container4');
const time = document.querySelector('#time');

const SCORE_POINTS = 100;
const MAX_QUESTIONS = 10;

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let questions;
let rightChoice;
let timePerQuestion = 30;
let timeLeft = timePerQuestion;
let timer;

function startGame() {
    questionCounter = 0;
    score = 0;
    getNewQuestion();
}

/* Gets new question, either true/false or 4 possible answers. 
   Presents the question and possible choices. */
function getNewQuestion() {
    if (questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);

        return window.location.assign('/game-end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    currentQuestion = questions[questionCounter];
    question.innerText = atob(currentQuestion.question);

    const allChoices = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];

    shuffleArray(allChoices);

    // For true/false question hides the 3rd and 4th choices
    if (currentQuestion.type == btoa('boolean')) {
        choiceContainer3.classList.add('hidden');
        choiceContainer4.classList.add('hidden');
        choices[0].innerText = 'True';
        choices[1].innerText = 'False';
    } else {
        choiceContainer3.classList.remove('hidden');
        choiceContainer4.classList.remove('hidden');
        let choiceCounter = 0;
        choices.forEach(choice => {
            choice.innerText = atob(allChoices[choiceCounter]);
            choiceCounter++;
        })
    }

    // Finds the right choice after the shuffle (to mark the right answer when user is wrong)
    choices.forEach(choice => {
        if (btoa(choice.innerText) == currentQuestion.correct_answer) {
            rightChoice = choice;
        }
    })

    console.log(atob(currentQuestion.correct_answer))
    timeLeft = timePerQuestion;
    time.innerText = timeLeft;
    timer = setInterval(countdown, 1000);

    acceptingAnswers = true;
}

// When the user clicks an answer
choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        clearInterval(timer);

        acceptingAnswers = false;
        const selectedChoice = e.target;
        let classToApply = btoa(selectedChoice.innerText) == currentQuestion.correct_answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(SCORE_POINTS);
        } else {
            // when user wrong, color the right answer
            rightChoice.parentElement.classList.add('correct');
        }

        // Color the container according to correct/incorrect user answer
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            rightChoice.parentElement.classList.remove('correct');
            getNewQuestion();
        }, 2000)
    })
})

function countdown() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        rightChoice.parentElement.classList.add('correct');
        time.innerText = timeLeft;
        question.innerText = 'Time over!';
        question.classList.add('time-out');

        setTimeout(() => {
            question.classList.remove('time-out');
            rightChoice.parentElement.classList.remove('correct');
            getNewQuestion();
        }, 2000)
    } else {
        time.innerText = timeLeft;
        timeLeft -= 1;
    }
}

function incrementScore(num) {
    score += num;
    scoreText.innerText = score;
}

// Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Fetch questions from API in base64 encoding
async function getApiQuestions() {
    const API_URL = 'https://opentdb.com/api.php?amount=30&encode=base64';
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.results;
}

// main gets API questions and starts the game
(async function main() {
    questions = await getApiQuestions();
    startGame()
})()