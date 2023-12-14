// Invariant: StatsMultipliers, BaseStats, BonusStats, BonusStatsFromLevels, and BonusStatsMisc must have the same items
export const BaseStats = {
    maxHealth: 100, // maxHealth
    attack: 10, // attack
    defense: 10, // defense
    playerMovementSpeed: 2, // movement speed, default to 2
    enemyMovementSpeed: 2,
};

// Do not touch these values
export const BonusStatsFromLevels = {
    maxHealth: 10,
    attack: 1,
    defense: 1,
    playerMovementSpeed: 0.1,
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
};

// Stats are calculated from bonus and base stats
export const Stats = {
    score: 0, // score
    level: 0, // level
    health: 0, // health
    maxHealth: 0, // maxHealth
    attack: 0, // attack
    defense: 0, // defense
    items: null, // itemsnotez
    playerMovementSpeed: 0,
    enemyMovementSpeed: 0,
};
