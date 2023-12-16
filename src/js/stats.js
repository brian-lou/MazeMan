// Invariant: StatsMultipliers, BaseStats, BonusStats, BonusStatsFromLevels, and BonusStatsMisc must have the same items
export const BaseStats = {
    maxHealth: 10, // maxHealth
    attack: 5, // attack
    defense: 5, // defense
    playerMovementSpeed: 2, // movement speed, default to 2
    enemyMovementSpeed: 2,
};

// Do not touch these values
export const BonusStatsFromLevels = {
    maxHealth: 2,
    attack: 1,
    defense: 1,
    playerMovementSpeed: 0.05,
    enemyMovementSpeed: 0,
};

export const BonusStatsMisc = {
    maxHealth: 0,
    attack: 0,
    defense: 0,
    playerMovementSpeed: 0,
    enemyMovementSpeed: 0,
};

export const StatsMultipliers = {
    maxHealth: 1,
    attack: 1,
    defense: 1,
    playerMovementSpeed: 1,
    enemyMovementSpeed: 1,
    exp: 1
};

export const ActiveItemCount = {
    speedBoost: 0,
    ghost: 0,
    expBoost: 0,
    teleporter: 0,
    buff: 0, 
    coin: 0,
    freeze: 0,
    freezeMultiplier: 0 // temp to keep track of enemy movement speed
}

// Stats are calculated from bonus and base stats
export const Stats = {
    score: 0, // score
    level: 0, // map level, 0-indexed (start from level 0)
    health: 0, // health
    maxHealth: 0, // maxHealth
    attack: 0, // attack
    defense: 0, // defense
    playerMovementSpeed: 0,
    enemyMovementSpeed: 0,
    immune: false, // immune?
    totalEnemies: 0,
    defeatedEnemies: 0,
};
export let prevLevel = 0;

// Enemy Stat scalings by level
// Invariant: all lists must be of equal length
export const NUM_LEVELS = 3;
export const EnemyHpByLvl = [10, 20, 40];
export const EnemyAtkByLvl = [10, 15, 30];
export const EnemyDefByLvl = [0, 5, 15];
export const EnemySpdByLvl = [2, 2.5, 3];

export const NormalEnemiesByLvl = [13, 11, 9];
export const EliteEnemiesByLvl = [2, 4, 6];