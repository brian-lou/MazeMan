import { EXP_PER_LEVEL } from './constants.js';
import * as pages from './pages.js';
import { BaseStats, BonusStatsMisc, BonusStatsFromLevels, Stats, StatsMultipliers } from './stats.js';

// when key is pressed down
export function handleKeyDown(event, keypress) {
    if (event.key == 'ArrowUp') keypress['up'] = Date.now();
    if (event.key == 'ArrowDown') keypress['down'] = Date.now();
    if (event.key == 'ArrowLeft') keypress['left'] = Date.now();
    if (event.key == 'ArrowRight') keypress['right'] = Date.now();
    if (event.key == 'w') keypress['up'] = Date.now();
    if (event.key == 's') keypress['down'] = Date.now();
    if (event.key == 'a') keypress['left'] = Date.now();
    if (event.key == 'd') keypress['right'] = Date.now();
    if (event.key == ' ') {
        for (let p in keypress) {
            keypress[p] = 0;
        }
        keypress[' '] = Date.now();
    }
}

// when key is released
export function handleKeyUp(event, keypress) {
    // if (event.key == 'ArrowUp') keypress['up'] = false;
    // if (event.key == 'ArrowDown') keypress['down'] = false;
    // if (event.key == 'ArrowLeft') keypress['left'] = false;
    // if (event.key == 'ArrowRight') keypress['right'] = false;
    // if (event.key == 'w') keypress['up'] = false;
    // if (event.key == 's') keypress['down'] = false;
    // if (event.key == 'a') keypress['left'] = false;
    // if (event.key == 'd') keypress['right'] = false;
}

// switches between main, pause, and ending menus.
export function handleMenus(document, event, menus, canvas) {
    // start game from main menu
    if (event.key == ' ' && menus['main']) {
        menus['main'] = false;
        pages.game(document, canvas);
    }
    // handle pause menu
    if (event.key == 'p' || event.key == 'Escape') {
        let pause = document.getElementById('pause');
        if (!menus['pause']) {
            menus['pause'] = true;
            pause.classList.remove('notVisible');
        } else {
            menus['pause'] = false;
            pause.classList.add('notVisible');
        }
    }
}

export function updateStats(document){
    const lvl = Math.floor(Stats.score / EXP_PER_LEVEL);
    let missingHp = Math.min(0, Stats.health - Stats.maxHealth);
    let prevMaxHp = Stats.maxHealth;
    let prevHp = Stats.health;
    for (let [k,v] of Object.entries(BaseStats)){
        let mult = StatsMultipliers[k];
        Stats[k] = mult * (v + BonusStatsMisc[k] + (lvl * BonusStatsFromLevels[k]));
    }
    if (prevMaxHp < Stats.maxHealth){ // maxhp went up
        Stats.health = Stats.maxHealth + missingHp;
    } else { // maxhp went down, we first take away the missing hp
        Stats.health = Math.min(prevHp, Stats.maxHealth);
    }
    updateScore(document);
    updateAttributes(document);
}

// update score and level to UI
export function updateScore(document) {
    let expBar = document.getElementById('exp');
    let level = document.getElementById('level');
    const modScore = Stats.score % EXP_PER_LEVEL;
    expBar.value = modScore;
    let lvl = Math.floor(Stats.score / EXP_PER_LEVEL);
    level.innerHTML = 'LVL '.concat(lvl);
}

// update attributes to UI
export function updateAttributes(document) {
    let healthBar = document.getElementById('healthNum');
    let atkBar = document.getElementById('atkNum');
    let defBar = document.getElementById('defNum');
    let itemBar = document.getElementById('items');

    healthBar.innerHTML = ` ${Stats.health} / ${Stats.maxHealth}`;
    atkBar.innerHTML = ` ${Stats.attack}`;
    defBar.innerHTML = ` ${Stats.defense}`;
    itemBar.innerHTML = 'Active Items: TBD';
}
