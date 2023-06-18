// Imports
import { saveDataOnLocalStorage, readLocalStorageData } from './modules/localStorage.js';

// DOM Global Variables
const displayedName = document.getElementById('user-name');
const subjectForm = document.getElementById('subject-form');

// Global variables
let userName = null;
let lastSubjectObj = {};

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
    const score1 = parseInt(document.getElementById('score-1').value);
    const score2 = parseInt(document.getElementById('score-2').value);
    const score3 = parseInt(document.getElementById('score-3').value);
    const score4 = parseInt(document.getElementById('score-4').value);
    const scoreArray = [score1, score2, score3, score4];
    const areAllScoresFilled = scoreArray.every(score => !isNaN(score));

    let calculatedAverage = null;
    let statusMessage = '';

    if (areAllScoresFilled) {
        calculatedAverage = ((score1 * 1.5) + (score2 * 1.5) + (score3 * 4) + (score4 * 3)) / 10;

        if (calculatedAverage >= 7) {
            subjectObjConstructor(scoreArray, 'Você foi aprovado na diciplina.', calculatedAverage, inputSubjectName);
        } else {
            subjectObjConstructor(scoreArray, 'Infelizmente você não atingiu os pontos necessários na diciplina.', calculatedAverage, inputSubjectName);
        }
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
                    subjectObjConstructor(scoreArray, `Você precisa tirar pelo menos ${Math.ceil(remainingScoreTotal / divisor)} na nota ${score}.`, calculatedAverage, inputSubjectName, true);
                } else {
                    subjectObjConstructor(scoreArray, `Infelizmente você não ira atingir os pontos necessários na diciplina.`, calculatedAverage, inputSubjectName, false);
                }
            });
        } else {
            if (unfilledScores.includes('score1') && unfilledScores.includes('score2')) {
                const calculateResponse = calculateRequiredScores(1.5, 1.5, remainingScoreTotal);
                subjectObjConstructor(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
            }
            if (unfilledScores.includes('score3') && unfilledScores.includes('score4')) {
                const calculateResponse = calculateRequiredScores(4, 3, remainingScoreTotal);
                subjectObjConstructor(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
            }
            if (unfilledScores.includes('score1') && unfilledScores.includes('score3')) {
                const calculateResponse = calculateRequiredScores(1.5, 4, remainingScoreTotal);
                subjectObjConstructor(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
            }
            if (unfilledScores.includes('score2') && unfilledScores.includes('score4')) {
                const calculateResponse = calculateRequiredScores(1.5, 3, remainingScoreTotal);
                subjectObjConstructor(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
            }
            if (unfilledScores.includes('score1') && unfilledScores.includes('score4')) {
                const calculateResponse = calculateRequiredScores(1.5, 3, remainingScoreTotal);
                subjectObjConstructor(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
            }
            if (unfilledScores.includes('score2') && unfilledScores.includes('score3')) {
                const calculateResponse = calculateRequiredScores(1.5, 4, remainingScoreTotal);
                subjectObjConstructor(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
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
        return { message: 'Infelizmente você não ira atingir os pontos necessários na diciplina.', toHold: false };
    } else {
        return { message: `Voce precisa tirar ${requiredScore1} e ${requiredScore2} nas avaliações não feitas.`, toHold: true };
    }
}

function subjectObjConstructor(scores, statusMessage, averageValue, subjectName, isHolding) {
    const subjectObj = {
        name: subjectName,
        scores: {
            score1: scores[0],
            score2: scores[1],
            score3: scores[2],
            score4: scores[3],
        },
        average: averageValue,
        statusMsg: statusMessage,
        approved: averageValue >= 7,
        hold: isHolding,
    };
    console.log(subjectObj);
}



function validateForm() {

}