const easyScoresList = document.querySelector('#easyScoresList');
const mediumScoresList = document.querySelector('#mediumScoresList');
const hardScoresList = document.querySelector('#hardScoresList');
const easyScores = JSON.parse(localStorage.getItem('easyHighScores')) || [];
const mediumScores = JSON.parse(localStorage.getItem('mediumHighScores')) || [];
const hardScores = JSON.parse(localStorage.getItem('hardHighScores')) || [];

function printScores(scores, scoresList) {
    scores.map(score => {
        const li = document.createElement('li');
        li.classList.add('high-score');
        li.textContent = `${score.name} - ${score.score}`;
        scoresList.appendChild(li);
    })
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

function sortScores(scores) {
    scores.sort((a, b) => {
        return b.score - a.score;
    })
    scores.splice(5);
}

demoScores.easy.forEach(score => easyScores.push(score));
demoScores.medium.forEach(score => mediumScores.push(score));
demoScores.hard.forEach(score => hardScores.push(score));

sortScores(easyScores);
sortScores(mediumScores);
sortScores(hardScores);

printScores(easyScores, easyScoresList);
printScores(mediumScores, mediumScoresList);
printScores(hardScores, hardScoresList);