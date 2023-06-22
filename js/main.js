// Imports

import { saveDataOnLocalStorage, readLocalStorageData, clearLocalStorageData } from './modules/localStorage.js';

// DOM Global Variables

const displayedNameDOM = document.getElementById('user-name');
const subjectFormDOM = document.getElementById('subject-form');
const subjectListDOM = document.getElementById('saved-subjects-list');
const clearListButton = document.getElementById('clear-btn');

// Global variables

let userName = null;
let lastSubjectObj = {};
let subjectList = [];

// Modal variables

const modalForm = document.getElementById('modal-form');
const modalInputName = document.getElementById('modal-input-name');

// Event Listeners

window.addEventListener('load', checkUser);
modalForm.addEventListener('submit', submitName);
subjectFormDOM.addEventListener('submit', submitSubjectForm);
clearListButton.addEventListener('click', clearSubjectList);


// Functions


// Modal --------------
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
    const localStorageList = readLocalStorageData('localSubjectList');

    // Local Storage Name
    if (localStorageName) {
        userName = localStorageName;
        setModalVisibility(false);
        setUsernameOnScreen();
    } else {
        setModalVisibility(true);
        userName = null;
    }

    // Local Storage List
    if (!localStorageList) {
        saveDataOnLocalStorage('localSubjectList', []);
    } else {
        subjectList = readLocalStorageData('localSubjectList');
        renderSubjectList();
    }
}
function setModalVisibility(isVisible) {
    const modal = document.getElementById('modal');
    modal.classList.toggle('show', isVisible);
    modal.classList.toggle('hidden', !isVisible);
}
function setUsernameOnScreen() {
    displayedNameDOM.innerText = userName;
}
// --------------------

function submitSubjectForm(event) {
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
            const createdObject = buildSubjectObject(scoreArray, `Você foi aprovado na diciplina com uma média de ${calculatedAverage}.`, calculatedAverage, inputSubjectName);
            populateSubjectList(createdObject);
        } else {
            const createdObject = buildSubjectObject(scoreArray, `Você foi reprovado na diciplina com uma média de ${calculatedAverage}.`, calculatedAverage, inputSubjectName);
            populateSubjectList(createdObject);
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

        if (filledScores.length <= 1) {
            alert('Preencha pelo menos 2 campos de nota');
        } else {
            if (unfilledScores.length === 1) {
                const score = unfilledScores[0];
                const scoreFormatedName = score.replace('score', 'AV ');
                const i = parseInt(score.replace('score', '')) - 1;
                const divisor = [1.5, 1.5, 4, 3][i];
                const missingScore = Math.ceil(remainingScoreTotal / divisor);

                if (missingScore <= 10 && missingScore > 0) {
                    const createdObject = buildSubjectObject(scoreArray, `Você precisa tirar pelo menos ${missingScore} na nota da ${scoreFormatedName}.`, calculatedAverage, inputSubjectName, true);
                    populateSubjectList(createdObject);
                    return;
                }
                if (missingScore > 10) {
                    const createdObject = buildSubjectObject(scoreArray, `Infelizmente você não irá atingir os pontos necessários na disciplina.`, calculatedAverage, inputSubjectName, false);
                    populateSubjectList(createdObject);
                    return;
                }
                if (missingScore === 0) {
                    const createdObject = buildSubjectObject(scoreArray, `Você tecnicamente já passou na diciplina, porem precisa tirar pelo menos 1 na nota da ${scoreFormatedName}.`, calculatedAverage, inputSubjectName, true);
                    populateSubjectList(createdObject);
                    return;
                }


            } else {
                if (unfilledScores.includes('score1') && unfilledScores.includes('score2')) {
                    const calculateResponse = calculateRequiredScores(1.5, 1.5, remainingScoreTotal);
                    const createdObject = buildSubjectObject(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
                    populateSubjectList(createdObject);
                }
                if (unfilledScores.includes('score3') && unfilledScores.includes('score4')) {
                    const calculateResponse = calculateRequiredScores(4, 3, remainingScoreTotal);
                    const createdObject = buildSubjectObject(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
                    populateSubjectList(createdObject);
                }
                if (unfilledScores.includes('score1') && unfilledScores.includes('score3')) {
                    const calculateResponse = calculateRequiredScores(1.5, 4, remainingScoreTotal);
                    const createdObject = buildSubjectObject(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
                    populateSubjectList(createdObject);
                }
                if (unfilledScores.includes('score2') && unfilledScores.includes('score4')) {
                    const calculateResponse = calculateRequiredScores(1.5, 3, remainingScoreTotal);
                    const createdObject = buildSubjectObject(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
                    populateSubjectList(createdObject);
                }
                if (unfilledScores.includes('score1') && unfilledScores.includes('score4')) {
                    const calculateResponse = calculateRequiredScores(1.5, 3, remainingScoreTotal);
                    const createdObject = buildSubjectObject(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
                    populateSubjectList(createdObject);
                }
                if (unfilledScores.includes('score2') && unfilledScores.includes('score3')) {
                    const calculateResponse = calculateRequiredScores(1.5, 4, remainingScoreTotal);
                    const createdObject = buildSubjectObject(scoreArray, calculateResponse.message, calculatedAverage, inputSubjectName, calculateResponse.toHold);
                    populateSubjectList(createdObject);
                }
            }
            clearAllInputs();
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
function applyOverflow() {
    var isOverflowing = subjectListDOM.scrollWidth > subjectListDOM.clientWidth || subjectListDOM.scrollHeight > subjectListDOM.clientHeight;
    if (isOverflowing) {
        subjectListDOM.style.overflowx = "scroll";
    } else {
        subjectListDOM.style.overflow = "auto";
    }
}
function buildSubjectObject(scores, statusMessage, averageValue, subjectName, isHolding) {
    const subjectObj = {
        name: subjectName,
        scores: [
            scores[0],
            scores[1],
            scores[2],
            scores[3],
        ],
        average: averageValue,
        statusMsg: statusMessage,
        approved: averageValue >= 7,
        hold: isHolding,
    };
    return subjectObj;
}

function populateSubjectList(object) {
    subjectList.push(object);
    saveDataOnLocalStorage('localSubjectList', subjectList);
    renderSubjectList();
}

function renderSubjectList() {
    subjectListDOM.innerHTML = '';

    const localSubjectList = readLocalStorageData('localSubjectList');
    subjectList = localSubjectList;
    console.log(subjectList);

    subjectList.forEach((element) => {
        const randomID = parseInt(Math.random() * (1000000 - 100) + 1);
        const content = `
        <li class="score-item">
          <h1>${element.name}</h1>
          <ul class="score-list" id="score-list-${randomID}">
          </ul>
          <h2 id="status-message-${randomID}" class="status-message">
            <span>${element.statusMsg}</span>
          </h2>
        </li>
      `;
        subjectListDOM.insertAdjacentHTML('beforeend', content);

        // Generate list of scores
        const scoreListId = `score-list-${randomID}`;
        const scoreList = document.getElementById(scoreListId);
        element.scores.forEach((scoreElement, i) => {
            if (scoreElement === null) {
                const liContent = `<li><h3>${i + 1}º AV: </h3><span>Avaliação pendente</span></li>`;
                scoreList.insertAdjacentHTML('beforeend', liContent);
            } else {
                const liContent = `<li><h3>${i + 1}º AV: </h3><span>${scoreElement}</span></li>`;
                scoreList.insertAdjacentHTML('beforeend', liContent);
            }
        });

        // Paint the status message
        let statusColorClass = '';
        if (element.hold) {
            statusColorClass = 'holding';
        } else {
            statusColorClass = element.approved ? 'approved' : 'reproved';
        }
        const statusMessageId = `status-message-${randomID}`;
        const statusMessage = document.getElementById(statusMessageId);
        statusMessage.classList.add(statusColorClass);


        // Render clear btn
        changeClearBtnState();
    });

    // Aply overflow if needed
    applyOverflow();
}
function clearAllInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.value = '';
    });
}
function clearSubjectList() {
    subjectList.splice(0, subjectList.length);
    subjectListDOM.innerHTML = '';
    changeClearBtnState();
    saveDataOnLocalStorage('localSubjectList', []);
}
function changeClearBtnState() {
    if (subjectList.length > 0) {
        clearListButton.classList.toggle('show', true);
        clearListButton.classList.toggle('hide', false);
    } else {
        clearListButton.classList.toggle('show', false);
        clearListButton.classList.toggle('hide', true);
    }
}
