let word = '';
let intervalId = '';
let currentSeconds = 0;
let currentMinutes=0;
const possibleWords=['timer','party','table','swift', 'candy', 'phone','water', 'gamer','lover','sleep',
                    'mouse', 'paper', 'great', 'color', 'learn', 'shoes', 'shirt', 'magic','house', 'pizza',
                    'liver','heart','whale','whole','beach','ocean','sandy','crave','frame','photo','flare',
                    'dream','dirty','dwell','thank','young','cheek','chair','venom','gloom','older','amber',
                    'smile','train','brain','choir','field'];
let randomWordIndex=Math.floor(Math.random()*possibleWords.length);
let randomWord=possibleWords[randomWordIndex];
let inputsCounter=1;

let scoreBoard={
    guess1: 0,
    guess2: 0,
    guess3: 0,
    guess4: 0,
    guess5: 0,
    guess6: 0,
}

const storedScore=localStorage.getItem('scoreBoard');
if(storedScore){
    scoreBoard=JSON.parse(storedScore);
}

document.addEventListener('DOMContentLoaded', function () {
    startTimer();
    displayScore(inputsCounter,false);

    let input = document.querySelector('#input');
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            word = input.value.toLowerCase();
            input.value='';
            checkWord(word);
        }
    });
});

function checkWord(word) {
    if (word.length !== 5) {
        alert('Not five letters');
    }
    else{
        playGame(word);
    }
}

function playGame(word){
    let lettersForInput = [];
    let lettersForRandom = [];
    let backColor = [];
    let matchedIndices = [-1,-1,-1,-1,-1];

    for (let i = 0; i < 5; i++) {
        lettersForInput.push(word.charAt(i));
        lettersForRandom.push(randomWord.charAt(i));
    }

    for (let i = 0; i < 5; i++) {
        if (lettersForRandom[i] === lettersForInput[i]) {
            backColor[i] = 'green';
            matchedIndices[i] = i;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (matchedIndices[i] === -1) {
            let matchIndex = lettersForRandom.indexOf(lettersForInput[i]);
            if (matchIndex !== -1 && matchedIndices.indexOf(matchIndex) === -1) {
                backColor[i] = '#FFBA00';
                matchedIndices[i] = matchIndex;
            } else {
                backColor[i] = 'grey';
            }
        }
        lettersForInput[i] = lettersForInput[i].toUpperCase();
    }


    const gameBody = document.getElementById('game-body');
    gameBody.innerHTML+=`<p><span class='letter' style='background:${backColor[0]}'>${lettersForInput[0]}</span>
        <span class='letter' style='background:${backColor[1]}'>${lettersForInput[1]}</span>
        <span class='letter' style='background:${backColor[2]}'>${lettersForInput[2]}</span>
        <span class='letter' style='background:${backColor[3]}'>${lettersForInput[3]}</span>
        <span class='letter' style='background:${backColor[4]}'>${lettersForInput[4]}</span>
    </p>`;

    let counter=0;
    for(let i=0;i<5;i++){
        if(backColor[i]==='green'){
            counter++;
        }
    }
    if(counter===5){
        endGame(true,randomWord);
        return;
    }

    if(inputsCounter===6){
        endGame(false,randomWord);
    }

    inputsCounter++;

}

function startTimer() {
    intervalId = setInterval(countSeconds, 1000);
}

function countSeconds() {
    let timer = document.getElementById('paragraph-for-timer');
    currentSeconds++;
    if(currentSeconds===60){
        currentSeconds=0;
        currentMinutes++;
    }

    timer.innerHTML = (currentMinutes < 10 ? `0${currentMinutes}` : `${currentMinutes}`) + ':' +
        (currentSeconds < 10 ? `0${currentSeconds}` : `${currentSeconds}`);
}

function endGame(gotTheWord, word) {
    clearInterval(intervalId);
    document.getElementById('input').disabled = true;

    if (gotTheWord) {
        document.getElementById('game-body').innerHTML +=
            "<p>Congrats! You did it in " + inputsCounter + " tries!</p>";
    } else {
        resetScore();
        document.getElementById('game-body').innerHTML +=
            "<p>Sorry! The word we were looking for is:</p>" +
            "<p>" + word.toUpperCase() + "</p>";
    }

    displayScore(inputsCounter, gotTheWord);
    localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard));
}

function displayScore(inputsCounter, gotTheWord) {
    const scoreElement = document.getElementById('score-element');
    if (gotTheWord && inputsCounter >= 1 && inputsCounter <= 6) {
        scoreBoard[`guess${inputsCounter}`]++;
    }

    scoreElement.innerHTML = `
        <h3>Scoreboard</h3>
        <div class="scores">One guess:<br> ${scoreBoard.guess1}</div>
        <div class="scores">Two guesses:<br> ${scoreBoard.guess2}</div>
        <div class="scores">Three guesses:<br> ${scoreBoard.guess3}</div>
        <div class="scores">Four guesses:<br> ${scoreBoard.guess4}</div>
        <div class="scores">Five guesses:<br> ${scoreBoard.guess5}</div>
        <div class="scores">Six guesses:<br> ${scoreBoard.guess6}</div>
    `;
}

function resetScore(){
    scoreBoard.guess1=0;
    scoreBoard.guess2=0;
    scoreBoard.guess3=0;
    scoreBoard.guess4=0;
    scoreBoard.guess5=0;
    scoreBoard.guess6=0;
}