import PAUSE from '../pauseScreen.html';
import GAME from '../gameScreen.html';
import MAIN from '../mainScreen.html';
import { handleHpBuy, handleAtkBuy, handleDefBuy } from './handlers';

// concept from https://github.com/harveyw24/Glider/blob/main/src/js/pages.js

export function main(document) {
    document.body.innerHTML = '';
    let intro = document.createElement('div');
    intro.id = 'intro';
    intro.innerHTML = MAIN;
    document.body.appendChild(intro);
}

export function game(document, canvas) {
    document.getElementById('main').remove();
    document.getElementById('intro').remove();

    document.body.appendChild(canvas);
    let game = document.createElement('div');
    game.innerHTML = GAME;
    document.body.appendChild(game);

    let pause = document.createElement('div');
    pause.id = 'pause';
    pause.innerHTML = PAUSE;
    pause.classList.add('notVisible');
    document.body.appendChild(pause);
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

export function initCoinButtons(document) {
    const coinHpButton = document.getElementById('coin-hp');
    const coinAtkButton = document.getElementById('coin-atk');
    const coinDefButton = document.getElementById('coin-def');
    coinHpButton.addEventListener('click', handleHpBuy);
    coinAtkButton.addEventListener('click', handleAtkBuy);
    coinDefButton.addEventListener('click', handleDefBuy);
}
