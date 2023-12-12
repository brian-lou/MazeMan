export function game(document, canvas) {
    document.body.appendChild(canvas);

    let scoreCounter = document.createElement('div');
    scoreCounter.id = 'score';

    let instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.prepend(scoreCounter);
    document.body.appendChild(instructions);

    let healthBar = document.createElement('div');
    healthBar.id = 'health';

    let items = document.createElement('div');
    items.id = 'items';

    let attributes = document.createElement('div');
    attributes.id = 'attributes';
    attributes.append(healthBar);
    attributes.append(items);
    document.body.appendChild(attributes);
}
