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
    setSubjectObj();
}

function setSubjectObj() {
    const subjectName = document.getElementById('subject-name').value;
    const N1 = parseFloat(document.getElementById('score-1').value);
    const N2 = parseFloat(document.getElementById('score-2').value);
    const N3 = parseFloat(document.getElementById('score-3').value);
    const N4 = parseFloat(document.getElementById('score-4').value);
    const scores = [N1, N2, N3, N4];
    const isAllScoresFilled = scores.every(score => !isNaN(score));
    let subjectAverage = null;
    let subjectStatusMsg = '';


    if (isAllScoresFilled) {

        subjectAverage = ((N1 * 1.5) + (N2 * 1.5) + (N3 * 4) + (N4 * 3)) / 10;

        if (subjectAverage >= 7) {
            subjectStatusMsg = 'Você passou nessa matéria. Atingiu todos os pontos necessários.';
        } else {
            subjectStatusMsg = 'Você não passou nessa matéria. Não atingiu todos os pontos necessários.';
        }

    } else {
        const minimumScoreNeeded = 'Waiting...';
        subjectStatusMsg = `Você precisa obter no mínimo ${minimumScoreNeeded} para passar na matéria.`;
    }
}
