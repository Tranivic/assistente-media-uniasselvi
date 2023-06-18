// Imports
import { saveDataOnLocalStorage, readLocalStorageData } from './modules/localStorage.js';

// DOM Global Variables
const displayedName = document.getElementById('user-name');
const subjectForm = document.getElementById('subject-form');

// Global variables
let userName = null;

let subjectObj = {
    name: '',
    scores: {
        score1: null,
        score2: null,
        score3: null,
        score4: null,
    },
    average: null,
    statusMsg: '',
    aproved: false,
};

// Modal variables
const modalForm = document.getElementById('modal-form');
const modalInputName = document.getElementById('modal-input-name');

// Event Listeners
window.addEventListener('load', checkUser);
modalForm.addEventListener('submit', submitName);
subjectForm.addEventListener('submit', submitSubject);

// Functions
function submitName(event) {
    setModalVisibility(false);
    event.preventDefault();
    const newUserName = modalInputName.value.trim();
    saveDataOnLocalStorage('userName', newUserName);
    userName = newUserName;
    setUsernameOnScreen();
}
function checkUser() {
    const localStorageName = readLocalStorageData('userName');

    if (localStorageName) {
        userName = localStorageName;
        setModalVisibility(false);
        setUsernameOnScreen();
    } else {
        setModalVisibility(true);
        userName = null;
    }

}
function setModalVisibility(isVisible) {
    const modal = document.getElementById('modal');
    modal.classList.toggle('show', isVisible);
    modal.classList.toggle('hidden', !isVisible);
}
function setUsernameOnScreen() {
    displayedName.innerText = userName;
}
function submitSubject(event) {
    event.preventDefault();
    calculateSubjectStatus();
}

function calculateSubjectStatus() {
    const inputSubjectName = document.getElementById('subject-name').value;
    const score1 = parseFloat(document.getElementById('score-1').value);
    const score2 = parseFloat(document.getElementById('score-2').value);
    const score3 = parseFloat(document.getElementById('score-3').value);
    const score4 = parseFloat(document.getElementById('score-4').value);
    const scoreArray = [score1, score2, score3, score4];
    const areAllScoresFilled = scoreArray.every(score => !isNaN(score));
    let calculatedAverage = null;
    let statusMessage = '';

    if (areAllScoresFilled) {
        calculatedAverage = ((score1 * 1.5) + (score2 * 1.5) + (score3 * 4) + (score4 * 3)) / 10;

        if (calculatedAverage >= 7) {
            statusMessage = 'Pass';
        } else {
            statusMessage = 'Fail';
        }

        console.log(statusMessage);
        console.log(calculatedAverage);
    } else {
        const filledScores = [];
        const unfilledScores = [];

        scoreArray.forEach((score, index) => {
            if (!isNaN(score)) {
                if (index === 0 || index === 1) {
                    filledScores.push(score * 1.5);
                } else if (index === 2) {
                    filledScores.push(score * 4);
                } else {
                    filledScores.push(score * 3);
                }
            } else {
                unfilledScores.push(`score${index + 1}`);
            }
        });

        const sumOfScores = filledScores.reduce((total, number) => total + number, 0);
        const remainingScoreTotal = Math.ceil(Math.abs(sumOfScores - 70));

        if (unfilledScores.length === 1) {
            unfilledScores.forEach((score) => {
                const index = score.replace('score', '');
                const divisor = [1.5, 1.5, 4, 3][index - 1];
                const missingScore = Math.ceil(remainingScoreTotal / divisor);

                if (missingScore <= 10) {
                    console.log(`You need to score at least ${Math.ceil(remainingScoreTotal / divisor)} on ${score}.`);
                } else {
                    console.log(`Not enough ${score} score to pass...`);
                }
            });
        } else {
            if (unfilledScores.includes('score1') && unfilledScores.includes('score2')) {
                console.log(calculateRequiredScores(1.5, 1.5, remainingScoreTotal));
            }
            if (unfilledScores.includes('score3') && unfilledScores.includes('score4')) {
                console.log(calculateRequiredScores(4, 3, remainingScoreTotal));
            }
            if (unfilledScores.includes('score1') && unfilledScores.includes('score3')) {
                console.log(calculateRequiredScores(1.5, 4, remainingScoreTotal));
            }
            if (unfilledScores.includes('score2') && unfilledScores.includes('score4')) {
                console.log(calculateRequiredScores(1.5, 3, remainingScoreTotal));
            }
            if (unfilledScores.includes('score1') && unfilledScores.includes('score4')) {
                console.log(calculateRequiredScores(1.5, 3, remainingScoreTotal));
            }
            if (unfilledScores.includes('score2') && unfilledScores.includes('score3')) {
                console.log(calculateRequiredScores(1.5, 4, remainingScoreTotal));
            }
        }
    }
}

function calculateRequiredScores(weigth1, weigth2, remainingScoreTotal) {
    const remainingScoreCeiled = Math.ceil(remainingScoreTotal);

    let requiredScore1 = 1;
    let requiredScore2 = 1;

    for (let iteration = 0; iteration < remainingScoreCeiled; iteration++) {
        const achievedScore = ((requiredScore1 * weigth1) + (requiredScore2 * weigth2));

        if (achievedScore <= remainingScoreCeiled) {
            requiredScore1 = requiredScore1 + 1;
            requiredScore2 = requiredScore2 + 1;
        }
    }

    if (requiredScore1 > 10) {
        return 'Unfortunately, you are already automatically failing the subject.';
    } else {
        return `$These are the 2 scores ${requiredScore1} and ${requiredScore2}`;
    }
}