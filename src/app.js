/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import {
    WebGLRenderer,
    PerspectiveCamera,
    Vector3,
    Clock,
    AudioListener,
    Audio,
    AudioLoader,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Level } from 'scenes';
import {
    handleKeyDown,
    handleKeyUp,
    updateScore,
    updateAttributes,
    handleMenus,
    updateStats,
    handleResume,
    handleRestart,
    handleMain,
} from './js/handlers';
import * as pages from './js/pages.js';
import './styles.css';
import { loadSounds } from './sounds/sounds.js';

// ******** Global Vars ***********
export const keypress = {
    ' ': 0,
    up: 0,
    down: 0,
    left: 0,
    right: 0,
}; // dict that stores which keys are pressed
//dict storing menus
const menus = {
    main: true,
    lose: false,
    win: false,
    pause: false,
    countdown: false,
    nextLevel: false,
};
// ******** Initialize Core ThreeJS components ***********

export const elements = {
    camera: new PerspectiveCamera(65),
    scene: null,
    listener: null,
};
const listener = new AudioListener();
elements.camera.add(listener);
elements.listener = listener;
elements.scene = new Level(keypress, elements.camera);

export const SOUNDS = {
    enemyDeathSound: null,
    playerDeath: null,
    bgMusic: null,
    levelUp: null,
    pickUpSound: null,
    loaded: false,
    listener: listener,
};

export const renderer = new WebGLRenderer({ antialias: true });

// ******** Camera ***********
const cameraOffset = new Vector3(-5, 10, 0);
elements.camera.position.add(cameraOffset);
// camera.lookAt(new Vector3(40, 40, 40));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.id = 'canvas';
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.appendChild(canvas);

// ******** Controls ***********
const controls = new OrbitControls(elements.camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
// disable camera panning by user
controls.enabled = true;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// ******** Render Loop ***********
const clock = new Clock();
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    const deltaT = clock.getDelta() * 1000;
    if (!menus['pause'] && !menus['countdown'] && document.hasFocus()) {
        // Update scene based on player movement
        let playerPosition = new Vector3();
        let player = elements.scene.getPlayer();
        player.getWorldPosition(playerPosition);
        elements.scene.update &&
            elements.scene.update(
                Math.round(playerPosition.x),
                Math.round(playerPosition.z),
                deltaT,
                renderer
            );

        elements.camera.position.copy(playerPosition).add(cameraOffset);
        elements.camera.lookAt(playerPosition);
        renderer.render(elements.scene, elements.camera);
    }

    // update score and attributes
    if (
        !(
            menus['main'] ||
            menus['lose'] ||
            menus['win'] ||
            menus['pause'] ||
            menus['nextLevel']
        )
    ) {
        updateStats(document, menus);
    }

    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    elements.camera.aspect = innerWidth / innerHeight;
    elements.camera.updateProjectionMatrix();
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
window.addEventListener(
    'keydown',
    (event) => handleMenus(document, event, menus, canvas),
    false
);
/****************************AUDIO*************************************/
// const listener = new THREE.AudioListener();
// camera.add(listener);
// const audioLoader = new THREE.AudioLoader();
// const whirring = new THREE.Audio(listener);
// audioLoader.load('https://raw.githubusercontent.com/brian-lou/GraphicsFinalProject/src/sounds/music.mp3', function(buffer) {
//     explosion.setBuffer(buffer);
//     explosion.setLoop(false);
//     explosion.setVolume(0.3);
// });
// ******** INIT ***********
pages.initIcons(document);
pages.main(document);
