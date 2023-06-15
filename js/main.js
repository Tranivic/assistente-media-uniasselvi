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
        const scoreFilledAtTheMoment = [];
        const missingScoreAtTheMoment = [];

        scores.forEach((element, index) => {
            if (!isNaN(element)) {
                if (index === 0 || index === 1) {
                    scoreFilledAtTheMoment.push(element * 1.5);
                } else if (index === 2) {
                    scoreFilledAtTheMoment.push(element * 4);
                } else {
                    scoreFilledAtTheMoment.push(element * 3);
                }
            } else {
                missingScoreAtTheMoment.push(`N${index + 1}`);
            }
        });

        const totalScore = scoreFilledAtTheMoment.reduce((total, number) => total + number, 0);
        const missingScoreTotal = Math.ceil(Math.abs(totalScore - 70));

        console.log(scoreFilledAtTheMoment);
        console.log(missingScoreAtTheMoment);
        console.log(totalScore);
        console.log(missingScoreTotal);

        if (missingScoreAtTheMoment.length === 1) {
            missingScoreAtTheMoment.forEach((element) => {
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
        } else {
            if (missingScoreAtTheMoment.includes('N1') && missingScoreAtTheMoment.includes('N2')) {
                const leftScore = ((missingScoreTotal / 1.5) / 2).toFixed(1);
                console.log(`Você precisa tirar pelo menos ${leftScore} na N1 e N2`);
            }
            if (missingScoreAtTheMoment.includes('N3') && missingScoreAtTheMoment.includes('N4')) {
                let leftScore = Math.ceil(missingScoreTotal / 2);
                let leftScoreN3Hold = Math.ceil(leftScore / 4);

                if (leftScoreN3Hold > 10) {
                    leftScore += (leftScoreN3Hold - 10) * 4;
                    leftScoreN3Hold = 10;
                }

                let leftScoreN4Hold = Math.ceil(leftScore / 3);

                console.log(`Você precisa tirar pelo menos ${leftScoreN3Hold} na N3.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN4Hold} na N4.`);
            }
            if (missingScoreAtTheMoment.includes('N1') && missingScoreAtTheMoment.includes('N3')) {
                let leftScore = Math.ceil(missingScoreTotal / 2);
                let leftScoreN1Hold = Math.ceil(leftScore / 1.5);

                if (leftScoreN1Hold > 10) {
                    leftScore += leftScoreN1Hold - 10;
                    leftScoreN1Hold = 10;
                }

                let leftScoreN3Hold = Math.ceil(leftScore / 4);


                console.log(`Você precisa tirar pelo menos ${leftScoreN1Hold - 2} na N1.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN3Hold + 1} na N3.`);
            }
            if (missingScoreAtTheMoment.includes('N2') && missingScoreAtTheMoment.includes('N4')) {
                let leftScore = Math.ceil(missingScoreTotal / 2);
                let leftScoreN2Hold = Math.ceil(leftScore / 1.5);

                if (leftScoreN2Hold > 10) {
                    leftScore += leftScoreN2Hold - 10;
                    leftScoreN2Hold = 10;
                }

                let leftScoreN4Hold = Math.ceil(leftScore / 3);


                console.log(`Você precisa tirar pelo menos ${leftScoreN2Hold - 2} na N2.`);
                console.log(`Você precisa tirar pelo menos ${leftScoreN4Hold + 1} na N4.`);
            }

            if (missingScoreAtTheMoment.includes('N1') && missingScoreAtTheMoment.includes('N4')) {

            }
            if (missingScoreAtTheMoment.includes('N2') && missingScoreAtTheMoment.includes('N3')) {

            }
        }
    }
}

