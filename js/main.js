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
            subjectStatusMsg = subjectAverage;
        } else {
            subjectStatusMsg = subjectAverage;
        }

        console.log(subjectStatusMsg);
    } else {
        const scoreFilled = [];
        const scoreNotFilled = [];

        scores.forEach((element, index) => {
            if (!isNaN(element)) {
                if (index === 0 || index === 1) {
                    scoreFilled.push(element * 1.5);
                } else if (index === 2) {
                    scoreFilled.push(element * 4);
                } else {
                    scoreFilled.push(element * 3);
                }
            } else {
                scoreNotFilled.push(`N${index + 1}`);
            }
        });

        const totalScore = scoreFilled.reduce((total, number) => total + number, 0);
        const missingScoreTotal = Math.ceil(Math.abs(totalScore - 70));

        if (scoreNotFilled.length === 1) {
            scoreNotFilled.forEach((element) => {
                if (element === 'N1') {
                    console.log(Math.ceil(missingScoreTotal / 1.5));
                }
                if (element === 'N2') {
                    console.log(Math.ceil(missingScoreTotal / 1.5));
                }
                if (element === 'N3') {
                    console.log(missingScoreTotal / 4);
                }
                if (element === 'N4') {
                    console.log(missingScoreTotal / 3);
                }
            });
        } else if (scoreNotFilled.length > 1) {
            if (scoreNotFilled.includes('N1') && scoreNotFilled.includes('N2')) {
                let leftScore = Math.ceil(missingScoreTotal);
                let leftScoreN1Hold = 1;
                let leftScoreN2Hold = 1;

                for (let i = 0; i < leftScore; i++) {
                    const scoreAchive = ((leftScoreN1Hold * 1.5) + (leftScoreN2Hold * 1.5));
                    if (scoreAchive < leftScore) {
                        leftScoreN1Hold = leftScoreN1Hold + 1;
                        leftScoreN2Hold = leftScoreN2Hold + 1;
                    }
                }

                if (leftScoreN1Hold > 10 || leftScoreN2Hold > 10) {
                    console.log('Infelizmente você ja está automaticamente reprovado na diciplina');
                    return;
                }
                console.log(`Você precisa tirar pelo menos ${leftScoreN1Hold} na N1.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN2Hold} na N4.`);
            }
            if (scoreNotFilled.includes('N3') && scoreNotFilled.includes('N4')) {
                let leftScore = Math.ceil(missingScoreTotal);
                let leftScoreN3Hold = 1;
                let leftScoreN4Hold = 1;
                for (let i = 0; i < leftScore; i++) {
                    const scoreAchive = ((leftScoreN3Hold * 4) + (leftScoreN4Hold * 3));
                    if (scoreAchive < leftScore) {
                        leftScoreN3Hold = leftScoreN3Hold + 1;
                        leftScoreN4Hold = leftScoreN4Hold + 1;
                    }
                }

                if (leftScoreN3Hold > 10 || leftScoreN4Hold > 10) {
                    console.log('Infelizmente você ja está automaticamente reprovado na diciplina');
                    return;
                }

                console.log(`Você precisa tirar pelo menos ${leftScoreN3Hold} na N3.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN4Hold} na N4.`);
            }
            if (scoreNotFilled.includes('N1') && scoreNotFilled.includes('N3')) {
                let leftScore = Math.ceil(missingScoreTotal);
                let leftScoreN1Hold = 1;
                let leftScoreN3Hold = 1;

                for (let i = 0; i < leftScore; i++) {
                    const scoreAchive = ((leftScoreN1Hold * 1.5) + (leftScoreN3Hold * 4));
                    if (scoreAchive < leftScore) {
                        leftScoreN1Hold = leftScoreN1Hold + 1;
                        leftScoreN3Hold = leftScoreN3Hold + 1;
                    }
                }

                if (leftScoreN1Hold > 10 || leftScoreN3Hold > 10) {
                    console.log('Infelizmente você ja está automaticamente reprovado na diciplina');
                    return;
                }
                console.log(`Você precisa tirar pelo menos ${leftScoreN1Hold} na N1.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN3Hold} na N3.`);
            }
            if (scoreNotFilled.includes('N2') && scoreNotFilled.includes('N4')) {
                let leftScore = Math.ceil(missingScoreTotal);
                let leftScoreN2Hold = 1;
                let leftScoreN4Hold = 1;

                for (let i = 0; i < leftScore; i++) {
                    const scoreAchive = ((leftScoreN2Hold * 1.5) + (leftScoreN4Hold * 3));
                    if (scoreAchive < leftScore) {
                        leftScoreN2Hold = leftScoreN2Hold + 1;
                        leftScoreN4Hold = leftScoreN4Hold + 1;
                    }
                }

                if (leftScoreN2Hold > 10 || leftScoreN4Hold > 10) {
                    console.log('Infelizmente você ja está automaticamente reprovado na diciplina');
                    return;
                }
                console.log(`Você precisa tirar pelo menos ${leftScoreN2Hold} na N2.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN4Hold} na N4.`);
            }
            if (scoreNotFilled.includes('N1') && scoreNotFilled.includes('N4')) {
                let leftScore = Math.ceil(missingScoreTotal);
                let leftScoreN1Hold = 1;
                let leftScoreN4Hold = 1;

                for (let i = 0; i < leftScore; i++) {
                    const scoreAchive = ((leftScoreN1Hold * 1.5) + (leftScoreN4Hold * 3));
                    if (scoreAchive < leftScore) {
                        leftScoreN1Hold = leftScoreN1Hold + 1;
                        leftScoreN4Hold = leftScoreN4Hold + 1;
                    }
                }

                if (leftScoreN1Hold > 10 || leftScoreN4Hold > 10) {
                    console.log('Infelizmente você ja está automaticamente reprovado na diciplina');
                    return;
                }
                console.log(`Você precisa tirar pelo menos ${leftScoreN1Hold} na N1.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN4Hold} na N4.`);
            }
            if (scoreNotFilled.includes('N2') && scoreNotFilled.includes('N3')) {
                let leftScore = Math.ceil(missingScoreTotal);
                let leftScoreN1Hold = 1;
                let leftScoreN4Hold = 1;

                for (let i = 0; i < leftScore; i++) {
                    const scoreAchive = ((leftScoreN1Hold * 1.5) + (leftScoreN4Hold * 4));
                    if (scoreAchive < leftScore) {
                        leftScoreN1Hold = leftScoreN1Hold + 1;
                        leftScoreN4Hold = leftScoreN4Hold + 1;
                    }
                }

                if (leftScoreN1Hold > 10 || leftScoreN4Hold > 10) {
                    console.log('Infelizmente você ja está automaticamente reprovado na diciplina');
                    return;
                }
                console.log(`Você precisa tirar pelo menos ${leftScoreN1Hold} na N1.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN4Hold} na N4.`);
            }
        }
    }
}

