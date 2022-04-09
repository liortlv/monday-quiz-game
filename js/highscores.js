const easyScoresList = document.querySelector('#easyScoresList');
const mediumScoresList = document.querySelector('#mediumScoresList');
const hardScoresList = document.querySelector('#hardScoresList');
const easyScores = JSON.parse(localStorage.getItem('easyHighScores')) || [];
const mediumScores = JSON.parse(localStorage.getItem('mediumHighScores')) || [];
const hardScores = JSON.parse(localStorage.getItem('hardHighScores')) || [];

function printAllScores(level,levelScores,levelScoresList) {
    demoScores[level].forEach(score => levelScores.push(score));
    sortScores(levelScores);
    printScoreByLevel(levelScores,levelScoresList)
}

function printScoreByLevel(scores, scoresList) {
    scores.map(score => {
        const li = document.createElement('li');
        li.classList.add('high-score');
        li.textContent = `${score.name} - ${score.score}`;
        scoresList.appendChild(li);
    })
}

function sortScores(scores) {
    scores.sort((a, b) => {
        return b.score - a.score;
    })
    scores.splice(5);
}


// Adding demo scores so it won't look empty when no scores
// entered yet. When score is saved
// it is added in the correct sorted place
const demoScores = {
    easy: [{
        score: 100,
        name: 'Roy'
    },
    {
        score: 300,
        name: 'Yair'
    },
    {
        score: 600,
        name: 'Lior'
    }],
    medium: [{
        score: 100,
        name: 'Fares'
    },
    {
        score: 300,
        name: 'Roy'
    },
    {
        score: 200,
        name: 'Amir'
    },
    {
        score: 850,
        name: 'Shira'
    }],
    hard: [{
        score: 100,
        name: 'Shrek'
    },
    {
        score: 200,
        name: 'Ilay'
    },
    {
        score: 300,
        name: 'Oren'
    }],
}

printAllScores('easy',easyScores,easyScoresList);
printAllScores('medium',mediumScores,mediumScoresList);
printAllScores('hard',hardScores,hardScoresList);