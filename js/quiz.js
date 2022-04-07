const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const choiceContainer3 = document.querySelector('.choice-container3');
const choiceContainer4 = document.querySelector('.choice-container4');
const time = document.querySelector('#time');
const extraTime = document.querySelector('#extra-time');
const nextQuestion = document.querySelector('#next-question');

const SCORE_POINTS = 100;
const MAX_QUESTIONS = 5;

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let questions;
let rightChoice;
let timePerQuestion = 20;
let timeLeft = timePerQuestion;
let timer;
let scoreCombo = 0;

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
            scoreCombo++;
            if (scoreCombo >= 2) {
                incrementScore(SCORE_POINTS + scoreCombo * 50);
                question.innerText = `Combo! ${scoreCombo} consecutive correct answers!`;
                question.classList.add('combo');
                setTimeout(() => {
                    question.classList.remove('combo');
                }, 2000)

            } else {
                incrementScore(SCORE_POINTS);
            }
        } else {
            scoreCombo = 0;
            // when user wrong, color the right answer
            revealCorrectAnswer();
        }

        // Color the container according to correct/incorrect user answer
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 2000)
    })
})

// Extra 20 seconds button
extraTime.addEventListener('click', e => {
    timeLeft += 20;
    extraTime.classList.add('crossed');
    extraTime.classList.remove('hovered');
}, { once: true })

// Skip question button
nextQuestion.addEventListener('click', e => {
    revealCorrectAnswer();
    setTimeout(() => {
        questionCounter--;
        questions.shift();
        getNewQuestion();
    }, 2000)

    nextQuestion.classList.add('crossed');
    nextQuestion.classList.remove('hovered');
}, { once: true })

function revealCorrectAnswer() {
    clearInterval(timer);
    rightChoice.parentElement.classList.add('correct');
    setTimeout(() => {
        rightChoice.parentElement.classList.remove('correct');
    }, 2000)
}

function countdown() {
    if (timeLeft <= 0) {
        revealCorrectAnswer();
        time.innerText = timeLeft;
        question.innerText = 'Time is over!';
        question.classList.add('time-out');
        scoreCombo = 0;

        setTimeout(() => {
            question.classList.remove('time-out');
            getNewQuestion();
        }, 2000)
    } else {
        timeLeft -= 1;
        time.innerText = timeLeft;
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
    let API_URL;
    if (sessionStorage.getItem('level') == 'easy') {
        API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=easy&encode=base64';
    }
    if (sessionStorage.getItem('level') == 'medium') {
        API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=medium&encode=base64';
    }
    if (sessionStorage.getItem('level') == 'hard') {
        API_URL = 'https://opentdb.com/api.php?amount=10&difficulty=hard&encode=base64';
    }

    const response = await fetch(API_URL);
    const data = await response.json();
    return data.results;
}

// main gets API questions and starts the game
(async function main() {
    questions = await getApiQuestions();
    startGame()
})()