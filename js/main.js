// Imports
import { saveDataOnLocalStorage, readLocalStorageData } from './modules/localStorage.js';

// Global variables
let userName = null;

// Modal variables
const modalForm = document.getElementById('modal-form');
const modalInputName = document.getElementById('modal-input-name');

// Event Listeners
window.addEventListener('load', checkUser);
modalForm.addEventListener('submit', submitName);

// Functions
function submitName(event) {
    setModalVisibility(false);
    event.preventDefault();
    const newUserName = modalInputName.value.trim();
    saveDataOnLocalStorage('userName', newUserName);
    userName = newUserName;
}

function checkUser() {
    const localStorageName = readLocalStorageData('userName');

    if (localStorageName) {
        userName = localStorageName;
        setModalVisibility(false);
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

