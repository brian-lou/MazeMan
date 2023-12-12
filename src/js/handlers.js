// when key is pressed down
export function handleKeyDown(event, keypress) {
    if (event.key == 'ArrowUp') keypress['up'] = true;
    if (event.key == 'ArrowDown') keypress['down'] = true;
    if (event.key == 'ArrowLeft') keypress['left'] = true;
    if (event.key == 'ArrowRight') keypress['right'] = true;
    if (event.key == 'w') keypress['up'] = true;
    if (event.key == 's') keypress['down'] = true;
    if (event.key == 'a') keypress['left'] = true;
    if (event.key == 'd') keypress['right'] = true;
}

// when key is released
export function handleKeyUp(event, keypress) {
    if (event.key == 'ArrowUp') keypress['up'] = false;
    if (event.key == 'ArrowDown') keypress['down'] = false;
    if (event.key == 'ArrowLeft') keypress['left'] = false;
    if (event.key == 'ArrowRight') keypress['right'] = false;
    if (event.key == 'w') keypress['up'] = false;
    if (event.key == 's') keypress['down'] = false;
    if (event.key == 'a') keypress['left'] = false;
    if (event.key == 'd') keypress['right'] = false;
}

// update score to UI
export function updateScore(document, score) {
    let scoreCounter = document.getElementById('score');
    scoreCounter.innerHTML = 'Score: '.concat(score);
}

// update attributes to UI
export function updateAttributes(document, health, items) {
    let healthBar = document.getElementById('health');
    let itemBar = document.getElementById('items');
    //healthBar.innerHTML = 'Health: '.concat(health);
    itemBar.innerHTML = 'Items: TBD';
}
