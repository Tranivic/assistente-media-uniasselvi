// Imports
import { saveDataOnLocalStorage, readLocalStorageData } from './modules/localStorage.js';

// DOM Global Variables
const displayedNameDOM = document.getElementById('user-name');
const subjectFormDOM = document.getElementById('subject-form');
const subjectListDOM = document.getElementById('saved-subjects-list');

// Global variables
let userName = null;
let lastSubjectObj = {};
const subjectList = [];

// Modal variables
const modalForm = document.getElementById('modal-form');
const modalInputName = document.getElementById('modal-input-name');

// Event Listeners
window.addEventListener('load', checkUser);
modalForm.addEventListener('submit', submitName);
subjectFormDOM.addEventListener('submit', submitSubject);

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
    displayedNameDOM.innerText = userName;
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
            const createdObject = buildSubjectObject(scoreArray, 'Você foi aprovado na diciplina.', calculatedAverage, inputSubjectName);
            populateSubjectList(createdObject);
        } else {
            const createdObject = buildSubjectObject(scoreArray, 'Infelizmente você não atingiu os pontos necessários na diciplina.', calculatedAverage, inputSubjectName);
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


        if (unfilledScores.length === 1) {
            const score = unfilledScores[0];
            const scoreFormatedName = score.replace('score', 'AV ');
            const i = parseInt(score.replace('score', '')) - 1;
            const divisor = [1.5, 1.5, 4, 3][i];
            const missingScore = Math.ceil(remainingScoreTotal / divisor);

            alert(missingScore);

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
    subjectList.splice(0, subjectList.length);
    subjectList.push(object);
    renderSubjectList();
}

function renderSubjectList() {
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
        console.log(scoreList);
        element.scores.forEach((scoreElement, i) => {
            if (!isNaN(scoreElement)) {
                console.log(scoreElement);
                const liContent = `<li><h3>${i + 1}º AV: </h3><span>${scoreElement}</span></li>`;
                scoreList.insertAdjacentHTML('beforeend', liContent);
            } else {
                console.log(scoreElement);
                const liContent = `<li><h3>${i + 1}º AV: </h3><span>Avaliação pendente</span></li>`;
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
        console.log(element.hold);
        console.log(element.average);
        console.log(element.approved);
    });
}
