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
                let remainingScore = Math.ceil(remainingScoreTotal);
                let requiredScoreN1 = 1;
                let requiredScoreN2 = 1;

                for (let iteration = 0; iteration < remainingScore; iteration++) {
                    const achievedScore = ((requiredScoreN1 * 1.5) + (requiredScoreN2 * 1.5));
                    if (achievedScore <= remainingScore) {
                        requiredScoreN1 = requiredScoreN1 + 1;
                        requiredScoreN2 = requiredScoreN2 + 1;
                    }
                }

                if (requiredScoreN1 > 10 || requiredScoreN2 > 10) {
                    console.log('Unfortunately, you are already automatically failing the subject.');
                    return;
                }
                console.log(`You need to score at least ${requiredScoreN1} on Score 1.`);
                console.log(`You need to score at least ${requiredScoreN2} on Score 2.`);
            }
            if (unfilledScores.includes('score3') && unfilledScores.includes('score4')) {
                let remainingScore = Math.ceil(remainingScoreTotal);
                let requiredScoreN3 = 1;
                let requiredScoreN4 = 1;

                for (let iteration = 0; iteration < remainingScore; iteration++) {
                    const achievedScore = ((requiredScoreN3 * 4) + (requiredScoreN4 * 3));
                    if (achievedScore <= remainingScore) {
                        requiredScoreN3 = requiredScoreN3 + 1;
                        requiredScoreN4 = requiredScoreN4 + 1;
                    }
                }

                if (requiredScoreN3 > 10 || requiredScoreN4 > 10) {
                    console.log('Unfortunately, you are already automatically failing the subject.');
                    return;
                }

                console.log(`You need to score at least ${requiredScoreN3} on Score 3.`);
                console.log(`You need to score at least ${requiredScoreN4} on Score 4.`);
            }
            if (unfilledScores.includes('score1') && unfilledScores.includes('score3')) {
                let remainingScore = Math.ceil(remainingScoreTotal);
                let requiredScoreN1 = 1;
                let requiredScoreN3 = 1;

                for (let iteration = 0; iteration < remainingScore; iteration++) {
                    const achievedScore = ((requiredScoreN1 * 1.5) + (requiredScoreN3 * 4));
                    if (achievedScore <= remainingScore) {
                        requiredScoreN1 = requiredScoreN1 + 1;
                        requiredScoreN3 = requiredScoreN3 + 1;
                    }
                }

                if (requiredScoreN1 > 10 || requiredScoreN3 > 10) {
                    console.log('Unfortunately, you are already automatically failing the subject.');
                    return;
                }
                console.log(`You need to score at least ${requiredScoreN1} on Score 1.`);
                console.log(`You need to score at least ${requiredScoreN3} on Score 3.`);
            }
            if (unfilledScores.includes('score2') && unfilledScores.includes('score4')) {
                let remainingScore = Math.ceil(remainingScoreTotal);
                let requiredScoreN2 = 1;
                let requiredScoreN4 = 1;

                for (let iteration = 0; iteration < remainingScore; iteration++) {
                    const achievedScore = ((requiredScoreN2 * 1.5) + (requiredScoreN4 * 3));
                    if (achievedScore <= remainingScore) {
                        requiredScoreN2 = requiredScoreN2 + 1;
                        requiredScoreN4 = requiredScoreN4 + 1;
                    }
                }

                if (requiredScoreN2 > 10 || requiredScoreN4 > 10) {
                    console.log('Unfortunately, you are already automatically failing the subject.');
                    return;
                }
                console.log(`You need to score at least ${requiredScoreN2} on Score 2.`);
                console.log(`You need to score at least ${requiredScoreN4} on Score 4.`);
            }
            if (unfilledScores.includes('score1') && unfilledScores.includes('score4')) {
                let remainingScore = Math.ceil(remainingScoreTotal);
                let requiredScoreN1 = 1;
                let requiredScoreN4 = 1;

                for (let iteration = 0; iteration < remainingScore; iteration++) {
                    const achievedScore = ((requiredScoreN1 * 1.5) + (requiredScoreN4 * 3));
                    if (achievedScore <= remainingScore) {
                        console.log(remainingScore);
                        requiredScoreN1 = requiredScoreN1 + 1;
                        requiredScoreN4 = requiredScoreN4 + 1;
                    }
                }

                if (requiredScoreN1 > 10 || requiredScoreN4 > 10) {
                    console.log('Unfortunately, you are already automatically failing the subject.');
                    return;
                }
                console.log(`You need to score at least ${requiredScoreN1} on Score 1.`);
                console.log(`You need to score at least ${requiredScoreN4} on Score 4.`);
            }
            if (unfilledScores.includes('score2') && unfilledScores.includes('score3')) {
                let remainingScore = Math.ceil(remainingScoreTotal);
                let requiredScoreN2 = 1;
                let requiredScoreN3 = 1;

                for (let iteration = 0; iteration < remainingScore; iteration++) {
                    const achievedScore = ((requiredScoreN2 * 1.5) + (requiredScoreN3 * 4));
                    if (achievedScore <= remainingScore) {
                        requiredScoreN2 = requiredScoreN2 + 1;
                        requiredScoreN3 = requiredScoreN3 + 1;
                    }
                }

                if (requiredScoreN2 > 10 || requiredScoreN3 > 10) {
                    console.log('Unfortunately, you are already automatically failing the subject.');
                    return;
                }
                console.log(`You need to score at least ${requiredScoreN2} on Score 2.`);
                console.log(`You need to score at least ${requiredScoreN3} on Score 3.`);
            }
        }
    }
}


