/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MazeScene } from 'scenes';
import {
    handleKeyDown,
    handleKeyUp,
    updateScore,
    updateAttributes,
} from './js/handlers';
import * as pages from './js/pages.js';
import './styles.css';

// ******** Global Vars ***********
const keypress = {}; // dict that stores which keys are pressed
let score = 0; // score
let health = 3; // health
let items; // items

// ******** Initialize Core ThreeJS components ***********
const scene = new MazeScene(keypress);
const camera = new PerspectiveCamera(65);
const renderer = new WebGLRenderer({ antialias: true });

// ******** Camera ***********
const cameraOffset = new Vector3(-5, 10, 0);
camera.position.add(cameraOffset);
// camera.lookAt(new Vector3(40, 40, 40));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// ******** Controls ***********
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
// disable camera panning by user
controls.enabled = true;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// ******** Render Loop ***********
let prevTimestamp = 0;
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    scene.update && scene.update(timeStamp - prevTimestamp, renderer);

    // Update camera location to follow the player
    let playerPosition = new Vector3();
    let player = scene.getPlayer();
    player.getWorldPosition(playerPosition);
    camera.position.copy(playerPosition).add(cameraOffset);
    camera.lookAt(playerPosition);

    renderer.render(scene, camera);
    // update score
    score += 0.01;
    updateScore(document, score.toFixed(2));
    updateAttributes(document, health, items);
    window.requestAnimationFrame(onAnimationFrameHandler);
    prevTimestamp = timeStamp;
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
// ******** Handlers ***********
window.addEventListener('resize', windowResizeHandler, false);
window.addEventListener(
    'keydown',
    (event) => handleKeyDown(event, keypress),
    false
);
window.addEventListener(
    'keyup',
    (event) => handleKeyUp(event, keypress),
    false
);
// ******** INIT ***********
pages.game(document, canvas);
