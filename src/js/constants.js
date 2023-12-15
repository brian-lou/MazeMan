export const WALL_COLOR = 0xfbe9d2;
export const FLOOR_COLOR = 0xc8baa8;
export const MOVEMENT_EPS = 0.025; // turning EPS for smoother turns, use smaller value. Scales with movement speed
export const MOVEMENT_FACTOR = 500;
export const EXP_PER_LEVEL = 100;

export const COUNTDOWN_DURATION = 2000;
export const STARTING_IMMUNITY_DURATION = 2000;
export const STARTING_LOAD_DURATION = 100;

// Item variables
// If you change this, update the item menu at mainScreen.html
export const SPEED_BOOST_COUNT = 8;
export const SPEED_BOOST_MULTIPLIER = 1.5;
export const SPEED_BOOST_DURATION = 5000; // in ms

export const GHOST_COUNT = 6;
export const GHOST_DURATION = 5000;

export const EXP_BOOST_COUNT = 8;
export const EXP_BOOST_MULTIPLIER = 2;
export const EXP_BOOST_DURATION = 5000;

export const TELEPORT_IMMUNE_DURATION = 2000;
export const TELEPORT_COOLDOWN = 4000; // cooldown strictly greater

export const HP_RESTORE_COUNT = 8;
export const HP_RESTORE_FACTOR = 0.25;

export const BUFF_COUNT = 6;
export const BUFF_MULTIPLIER = 1.5;
export const BUFF_DURATION = 5000;

export const COIN_COUNT = 4;

export const FREEZE_COUNT = 6;
export const FREEZE_DURATION = 3000;

export const WALL_TEXTURES = [
    "https://raw.githubusercontent.com/brian-lou/GraphicsFinalProject/main/src/textures/brickBlue.png",
    "https://raw.githubusercontent.com/brian-lou/GraphicsFinalProject/main/src/textures/goldBrick.png",
    "https://raw.githubusercontent.com/brian-lou/GraphicsFinalProject/main/src/textures/brick.png"
]