import { Audio, AudioLoader } from "three";
// Load in all sound assets
export function loadSounds(sounds){
    const listener = sounds.listener;
    const audioLoader = new AudioLoader();
    const enemyDeathSound = new Audio(listener);
    audioLoader.load('https://raw.githubusercontent.com/brian-lou/MazeMan/main/src/sounds/enemy_kill.mp3', function(buffer) {
        enemyDeathSound.setBuffer(buffer);
        enemyDeathSound.setLoop(false);
        enemyDeathSound.setVolume(0.5);
    });
    const audioLoader2 = new AudioLoader();
    const playerDeathSound = new Audio(listener);
    audioLoader2.load('https://raw.githubusercontent.com/brian-lou/MazeMan/main/src/sounds/player_dying.mp3', function(buffer) {
        playerDeathSound.setBuffer(buffer);
        playerDeathSound.setLoop(false);
        playerDeathSound.setVolume(1);
    });
    
    const audioLoader3 = new AudioLoader();
    const bgMusic = new Audio(listener);
    audioLoader3.load('https://raw.githubusercontent.com/brian-lou/MazeMan/main/src/sounds/music.mp3', function(buffer) {
        bgMusic.setBuffer(buffer);
        bgMusic.setLoop(true);
        bgMusic.setVolume(0.2);
        bgMusic.play();
    });
    const audioLoaderLvlUp = new AudioLoader();
    const levelUp = new Audio(listener);
    audioLoaderLvlUp.load('https://raw.githubusercontent.com/brian-lou/MazeMan/main/src/sounds/level_up.mp3', function(buffer) {
        levelUp.setBuffer(buffer);
        levelUp.setLoop(false);
        levelUp.setVolume(1);
    });
    
    const audioLoader4 = new AudioLoader();
    const pickUpSound = new Audio(listener);
    audioLoader4.load('https://raw.githubusercontent.com/brian-lou/MazeMan/main/src/sounds/coin_pickup.mp3', function(buffer) {
      pickUpSound.setBuffer(buffer);
      pickUpSound.setLoop(false);
      pickUpSound.setVolume(1);
    });
    
    const audioLoader5 = new AudioLoader();
    const levelPass = new Audio(listener);
    audioLoader5.load('https://raw.githubusercontent.com/brian-lou/MazeMan/main/src/sounds/level_pass.mp3', function(buffer) {
      levelPass.setBuffer(buffer);
      levelPass.setLoop(false);
      levelPass.setVolume(1);
    });

    
    const audioLoader6 = new AudioLoader();
    const gameWin = new Audio(listener);
    audioLoader6.load('https://raw.githubusercontent.com/brian-lou/MazeMan/main/src/sounds/game_win.mp3', function(buffer) {
        gameWin.setBuffer(buffer);
        gameWin.setLoop(false);
        gameWin.setVolume(1);
    });

    sounds.loaded = true;
    sounds.enemyDeathSound = enemyDeathSound;
    sounds.playerDeathSound = playerDeathSound;
    sounds.bgMusic = bgMusic;
    sounds.levelUp = levelUp;
    sounds.pickUpSound = pickUpSound;
    sounds.levelPass = levelPass;
    sounds.gameWin = gameWin;
}