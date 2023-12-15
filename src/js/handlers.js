import { STRING } from 'mysql/lib/protocol/constants/types.js';
import { EXP_PER_LEVEL } from './constants.js';
import * as pages from './pages.js';
import {
    BaseStats,
    BonusStatsMisc,
    BonusStatsFromLevels,
    Stats,
    StatsMultipliers,
    ActiveItemCount,
} from './stats.js';

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

// switches between main, pause, and win/lose ending menus.
export function handleMenus(document, event, menus, canvas) {
    // start game from main menu
    if (event.key == ' ' && menus['main']) {
        menus['main'] = false;
        menus['pause'] = false;
        pages.game(document, canvas);
        pages.initPauseButtons(document, canvas, menus);
    }
    // losing screen back to main menu
    else if (event.key == ' ' && menus['lose']) {
        menus['main'] = true;
        menus['lose'] = false;
        pages.main(document);
    }
    // win screen back to game (next level)
    else if (event.key == ' ' && menus['win']) {
        menus['win'] = false;
        pages.game(document, canvas);
    }
    // test win screen
    else if (event.key == 't') {
        menus['win'] = true;
        pages.win(document);
    }
    // handle pause menu
    else if (!menus['main'] && (event.key == 'p' || event.key == 'Escape')) {
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

// handle pause menu buttons
export function handleResume(document, canvas, menus) {
    let pause = document.getElementById('pause');
    if (!pause.classList.contains('notVisible')) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    }
}
export function handleRestart(document, canvas, menus) {
    let pause = document.getElementById('pause');
    if (!pause.classList.contains('notVisible')) {
        // TODO: restart level
        menus['pause'] = false;
        pages.game(document, canvas);

        pages.initPauseButtons(document, canvas, menus);
    }
}
export function handleQuit(document, canvas, menus) {
    menus['main'] = true;
    menus['pause'] = false;
    pages.main(document);
}

export function updateStats(document) {
    const lvl = Math.floor(Stats.score / EXP_PER_LEVEL);
    let missingHp = Math.min(0, Stats.health - Stats.maxHealth);
    let prevMaxHp = Stats.maxHealth;
    let prevHp = Stats.health;
    for (let [k, v] of Object.entries(BaseStats)) {
        let mult = StatsMultipliers[k];
        Stats[k] =
            mult * (v + BonusStatsMisc[k] + lvl * BonusStatsFromLevels[k]);
    }
    if (prevMaxHp < Stats.maxHealth) {
        // maxhp went up
        Stats.health = Stats.maxHealth + missingHp;
    } else {
        // maxhp went down, we first take away the missing hp
        Stats.health = Math.min(prevHp, Stats.maxHealth);
    }
    updateScore(document);
    updateAttributes(document);
    if (Stats.health <= 0) {
        menus['lose'] = true;
        pages.lose(document);
    }
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
    let coinBar = document.getElementById('coinNum');

    healthBar.innerHTML = ` ${Stats.health} / ${Stats.maxHealth}`;
    atkBar.innerHTML = ` ${Stats.attack}`;
    defBar.innerHTML = ` ${Stats.defense}`;
    coinNum.innerHTML = ` ${ActiveItemCount.coin}`;

    const speedBoostImage = document.getElementById('speed-boost-item');
    const ghostImage = document.getElementById('ghost-item');
    const expBoostImage = document.getElementById('exp-boost-item');
    const teleportImage = document.getElementById('teleport-item');
    const buffImage = document.getElementById('buff-item');
    const freezeImage = document.getElementById('freeze-item');

    if (ActiveItemCount.speedBoost) {
        speedBoostImage.style.display = 'block';
    } else {
        speedBoostImage.style.display = 'none';
    }
    if (ActiveItemCount.ghost) {
        ghostImage.style.display = 'block';
    } else {
        ghostImage.style.display = 'none';
    }
    if (ActiveItemCount.expBoost) {
        expBoostImage.style.display = 'block';
    } else {
        expBoostImage.style.display = 'none';
    }
    if (ActiveItemCount.teleporter) {
        teleportImage.style.display = 'block';
    } else {
        teleportImage.style.display = 'none';
    }
    if (ActiveItemCount.buff) {
        buffImage.style.display = 'block';
    } else {
        buffImage.style.display = 'none';
    }
    if (ActiveItemCount.freeze) {
        freezeImage.style.display = 'block';
    } else {
        freezeImage.style.display = 'none';
    }
}

export function handleHpBuy() {
    // 4 points of max health costs 1 coin
    if (ActiveItemCount.coin > 0) {
        ActiveItemCount.coin--;
        BonusStatsMisc.maxHealth += 4;
    }
}

export function handleAtkBuy() {
    // each point of atk costs 1 point for now
    // 1 point is also hardcoded into the html if you want to
    // change that
    if (ActiveItemCount.coin > 0) {
        ActiveItemCount.coin--;
        BonusStatsMisc.attack++;
    }
}

export function handleDefBuy() {
    if (ActiveItemCount.coin > 0) {
        ActiveItemCount.coin--;
        BonusStatsMisc.defense++;
    }
}
