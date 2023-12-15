import PAUSE from '../pauseScreen.html';
import GAME from '../gameScreen.html';
import MAIN from '../mainScreen.html';
import WIN from '../winScreen.html';
import LOSE from '../loseScreen.html';
import {
    handleHpBuy,
    handleAtkBuy,
    handleDefBuy,
    handleResume,
    handleRestart,
    handleQuit,
} from './handlers';

// concept from https://github.com/harveyw24/Glider/blob/main/src/js/pages.js

// main menu screen
export function main(document) {
    document.body.innerHTML = '';
    let intro = document.createElement('div');
    intro.id = 'intro';
    intro.innerHTML = MAIN;
    document.body.appendChild(intro);
}

// victory screen
export function win(document) {
    let win = document.createElement('div');
    win.id = 'win';
    win.innerHTML = WIN;
    document.body.appendChild(win);

    document.getElementById('canvas').remove();
    document.getElementById('statBox').remove();
    document.getElementById('instructions').remove();
    document.getElementById('pause').remove();
}

// death screen
export function lose(document) {
    let lose = document.createElement('div');
    lose.id = 'lose';
    lose.innerHTML = LOSE;
    document.body.appendChild(lose);

    document.getElementById('canvas').remove();
    document.getElementById('statBox').remove();
    document.getElementById('instructions').remove();
    document.getElementById('pause').remove();
}

// game screen
export function game(document, canvas) {
    document.body.innerHTML = GAME;
    document.body.insertBefore(canvas, document.getElementById('instructions'));

    // pause menu
    let pause = document.createElement('div');
    pause.id = 'pause';
    pause.innerHTML = PAUSE;
    pause.classList.add('notVisible');
    document.body.appendChild(pause);

    // redo buttons
    initCoinButtons(document);
}

export function initIcons(document) {
    let icons = document.createElement('script');
    icons.id = 'icons';
    icons.src = 'https://kit.fontawesome.com/d73ba46279.js';
    icons.crossorigin = 'anonymous';
    document.head.appendChild(icons);

    let bitFont = document.createElement('link');
    bitFont.id = 'titleFont';
    bitFont.rel = 'stylesheet';
    bitFont.href = 'https://fonts.googleapis.com/css?family=DotGothic16';
    document.head.appendChild(bitFont);
}

// mouse click listener for coin buttons
export function initCoinButtons(document) {
    const coinHpButton = document.getElementById('coin-hp');
    const coinAtkButton = document.getElementById('coin-atk');
    const coinDefButton = document.getElementById('coin-def');
    coinHpButton.addEventListener('click', handleHpBuy);
    coinAtkButton.addEventListener('click', handleAtkBuy);
    coinDefButton.addEventListener('click', handleDefBuy);
}

// mouse click listener for pause menu buttons
export function initPauseButtons(document, canvas, menus) {
    const resume = document.getElementById('resume-btn');
    const restart = document.getElementById('restart-btn');
    const quit = document.getElementById('quit-btn');
    resume.addEventListener('click', () =>
        handleResume(document, canvas, menus)
    );
    restart.addEventListener('click', () =>
        handleRestart(document, canvas, menus)
    );
    quit.addEventListener('click', () => handleQuit(document, canvas, menus));
}
