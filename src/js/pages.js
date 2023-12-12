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
        '<i class="fa-solid fa-2xl fa-heart"></i><i class="fa-solid fa-2xl fa-heart"></i><i class="fa-solid fa-2xl fa-heart"></i>';

    let items = document.createElement('span');
    items.id = 'items';

    let space = document.createElement('span');
    space.id = 'space';

    let attributes = document.createElement('div');
    attributes.id = 'attributes';
    attributes.append(healthBar);
    attributes.append(space);
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
