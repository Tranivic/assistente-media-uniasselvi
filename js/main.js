// Imports
import { saveDataOnLocalStorage, readLocalStorageData } from './modules/localStorage.js';

// DOM Global Variables
const displayedName = document.getElementById('user-name');
const subjectForm = document.getElementById('subject-form');

// Global variables
let userName = null;
let newSubject = {
    name: '',
    score1: null,
    score2: null,
    score3: null,
    score4: null,
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
    saveNewSubject();
    console.log(newSubject);
}

function saveNewSubject() {
    newSubject = {
        name: document.getElementById('subject-name').value,
        score1: document.getElementById('score-1').value,
        score2: document.getElementById('score-2').value,
        score3: document.getElementById('score-3').value,
        score4: document.getElementById('score-4').value,
        statusMessage: generateStatusMsg(),
    };
}

function generateStatusMsg() {
    return 'Satus message';
}