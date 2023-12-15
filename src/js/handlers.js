import { elements, renderer, keypress } from '../app.js';
import { Vector3 } from 'three';
import { Level } from 'scenes';
import {
    EXP_PER_LEVEL,
    COUNTDOWN_DURATION,
    STARTING_IMMUNITY_DURATION,
} from './constants.js';
import * as pages from './pages.js';
import {
    BaseStats,
    BonusStatsMisc,
    BonusStatsFromLevels,
    Stats,
    StatsMultipliers,
    ActiveItemCount,
    EnemyHpByLvl,
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
        pages.game(document, canvas);
        pages.initPauseButtons(document, canvas, menus);
        // countdown before start
        menus['countdown'] = true;
        countdown.classList.remove('notVisible');
        setTimeout(() => {
            menus['countdown'] = false;
            countdown.classList.add('notVisible');
            // starting immunity
            Stats.immune = true;
            setTimeout(() => {
                Stats.immune = false;
            }, STARTING_IMMUNITY_DURATION);
        }, COUNTDOWN_DURATION);
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

        // countdown before start
        menus['countdown'] = true;
        countdown.classList.remove('notVisible');
        setTimeout(() => {
            menus['countdown'] = false;
            countdown.classList.add('notVisible');
            // starting immunity
            Stats.immune = true;
            setTimeout(() => {
                Stats.immune = false;
            }, STARTING_IMMUNITY_DURATION);
        }, COUNTDOWN_DURATION);
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
            // countdown before start on unpause
            menus['countdown'] = true;
            countdown.classList.remove('notVisible');
            setTimeout(() => {
                menus['countdown'] = false;
                countdown.classList.add('notVisible');
            }, COUNTDOWN_DURATION);
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
        elements.scene = new Level(keypress, elements.camera);
        menus['pause'] = false;
        pages.game(document, canvas);
        pages.initPauseButtons(document, canvas, menus);

        // Do an initial render
        let playerPosition = new Vector3();
        let player = elements.scene.getPlayer();
        player.getWorldPosition(playerPosition);
        elements.scene.update &&
            elements.scene.update(
                Math.round(playerPosition.x),
                Math.round(playerPosition.z),
                0,
                renderer
            );
        const cameraOffset = new Vector3(-5, 10, 0);
        elements.camera.position.copy(playerPosition).add(cameraOffset);
        elements.camera.lookAt(playerPosition);
        renderer.render(elements.scene, elements.camera);

        // delay so stuff can load in
        setTimeout(() => {
            // countdown
            menus['countdown'] = true;
            countdown.classList.remove('notVisible');
            setTimeout(() => {
                menus['countdown'] = false;
                countdown.classList.add('notVisible');
                // starting immunity
                Stats.immune = true;
                setTimeout(() => {
                    Stats.immune = false;
                }, STARTING_IMMUNITY_DURATION);
            }, COUNTDOWN_DURATION);
        }, 700);
    }
}
export function handleQuit(document, canvas, menus) {
    menus['main'] = true;
    menus['pause'] = false;
    pages.main(document);
}

export function updateStats(document, menus) {
    const lvl = Math.floor(Stats.score / EXP_PER_LEVEL);
    let missingHp = Math.min(0, Stats.health - Stats.maxHealth);
    let prevMaxHp = Stats.maxHealth;
    let prevHp = Stats.health;
    for (let [k, v] of Object.entries(BaseStats)) {
        let mult = StatsMultipliers[k];
        Stats[k] =
            mult * (v + BonusStatsMisc[k] + lvl * BonusStatsFromLevels[k]);
    }
    Stats.health = Stats.maxHealth + missingHp;
    // if (prevMaxHp < Stats.maxHealth){ // maxhp went up
    //     Stats.health = Stats.maxHealth + missingHp;
    // } else { // maxhp went down, we first take away the missing hp
    //     Stats.health = Math.min(prevHp, Stats.maxHealth);
    // }
    updateScore(document);
    updateAttributes(document);

    if (elements.scene.getNumEnemies() <= 0) {
        // menus['win'] = true;
        // Add next level screen here
        // also reset the level
        Stats.level += 1;
        if (!menus['win'] && Stats.level == EnemyHpByLvl.length) {
            // Win Screen here
            menus['win'] = true;
            pages.win(document);
        } else if (!menus['nextLevel']) {
            // Next level screen here (similar to game start)
            // also need to recreate the elements.scene = Level()
            menus['nextLevel'] = true;
            pages.nextLevel(document);
        }
    } /* 
    if (Stats.health <= 0) {
        menus['lose'] = true;
        pages.lose(document);
        Stats.health = 20;
    } */
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
