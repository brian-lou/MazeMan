export function game(document, canvas) {
    document.body.appendChild(canvas);

    let scoreCounter = document.createElement('div');
    scoreCounter.id = 'score';

    let instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.prepend(scoreCounter);
    document.body.appendChild(instructions);

    let healthBar = document.createElement('span');
    healthBar.id = 'health';
    healthBar.innerHTML =
        '<i id="healthNum" class="fa-solid fa-2xl fa-heart"></i>';

    let atkBar = document.createElement('span');
    atkBar.id = 'attack';
    atkBar.innerHTML =
        '<i id="atkNum" class="fa-solid fa-2xl fa-hand-fist"></i>';
    let defBar = document.createElement('span');
    defBar.id = 'defense';
    defBar.innerHTML = '<i id="defNum" class="fa-solid fa-2xl fa-shield"></i>';

    let items = document.createElement('span');
    items.id = 'items';

    let attributes = document.createElement('div');
    attributes.id = 'attributes';
    attributes.append(healthBar);
    attributes.append(atkBar);
    attributes.append(defBar);
    attributes.append(items);
    document.body.appendChild(attributes);
}

export function initIcons(document) {
    let icons = document.createElement('script');
    icons.id = 'icons';
    icons.src = 'https://kit.fontawesome.com/d73ba46279.js';
    icons.crossorigin = 'anonymous';
    document.head.appendChild(icons);
}
