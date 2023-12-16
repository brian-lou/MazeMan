import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, Box3, Vector2, AudioListener, AudioLoader, Audio } from 'three';
import { Player, Maze, Enemy, Item } from 'objects';
import { BasicLights } from 'lights';
import { Stats } from '../../js/stats';
import { EXP_PER_LEVEL } from '../../js/constants';
import { SOUNDS } from '../../app';
// import { Enemy } from 'enemies';

class MazeScene extends Scene {
    constructor(keypress, camera, enemiesList, generalInfo) {
        // Call parent Scene() constructor
        super();
        this.keypress = keypress;
        this.camera = camera;
        // Init state
        this.state = {
            gui: null, // Create GUI for scene
            rotationSpeed: 0,
            updateList: Array(),
        };

        // Set background to a nice color
        this.background = new Color(0x000000);
       
        // Add meshes to scene
        const maze = new Maze(this, generalInfo);
        this.maze = maze;
        const player = new Player(this, maze, keypress);
        this.player = player;
        const lights = new BasicLights(player, camera);
        this.lights = lights;
        // const axesHelper = new AxesHelper(5);

        this.enemies = new Set();
        for (let info of enemiesList){
            const enemy = new Enemy(this, maze, info, generalInfo);
            this.enemies.add(enemy);
            this.add(enemy);
        }
        this.add(player, maze, lights);
       // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', 0, 0 );
    }
    getPlayer(){
        return this.player;
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }
    checkCollision(box1, pos1, box2, pos2){
        let newBox1 = new Box3();
        newBox1.copy(box1);
        newBox1.translate(pos1);
        let newBox2 = new Box3();
        newBox2.copy(box2);
        newBox2.translate(pos2);
        return newBox1.intersectsBox(newBox2);
    }

    update(playerX, playerZ, deltaT) {
        // if player is out of bounds, reset their position
        if (
            playerX < 0 || playerX > this.maze.MAZE_LEN * 3 + 3 ||
            playerZ < 0 || playerZ > this.maze.MAZE_LEN * 3 - 2
        ) {
            const [x, z] = this.maze.getRandomAllowedPoint();
            this.player.position.set(x, 0, z);
            return;
        }

        // Call update for each object in the updateList
        for (const obj of this.state.updateList) {
            if (obj instanceof Maze) {
                obj.update(playerX, playerZ);
            } else if (obj instanceof Player) {
                obj.update(deltaT);
            } else if(obj instanceof Enemy){
                obj.update(deltaT);
            } else if (obj instanceof Item) {
                obj.update(deltaT);
            }
        }
        this.lights.updateSpotlight();

        // Combat
        const currTime = Date.now();
        const playerDir = new Vector2(this.player.dir[0], this.player.dir[1]);
        for (let enemy of this.enemies){
            if (this.checkCollision(
                this.player.bbox, this.player.position,
                enemy.bbox, enemy.position)){
                    // Do battle calcs here
                    // Battle protocol: 
                    // Attacking when they are moving away
                    // Being attacked if you are moving away
                    // Both attack if facing each other
                    // If being attacked: 
                    // If enemy atk > def, decrease hp by the excess
                    // once hp hits 0, game over
                    // Similarly for the enemy, decrease their hp by our atk - their def
                    const enemyDir = new Vector2(enemy.currentDirection[0], enemy.currentDirection[1]);
                    let angle = playerDir.dot(enemyDir);
                    let playerAtking = true;
                    let alsoAttackPlayer = false;
                    // angle is 0 if perp, 1 if attacking or being attacked, -1 if both are attacking
                    // 3 possibilities: 1. Attacking, 2. Being attacked, 3. Both attacking
                    if (!this.player.isMoving){
                        // player can never attack
                        playerAtking = false;
                    } else if (angle == 0){
                        // 8 cases (Player - Enemy):
                        // R->U, L->U, R->D, L->D, U->R, U->L, D->R, D->L
                        // If the player is "above" the enemy, they are being attacked
                        // If below, they are attacking (in the R->U and L->U cases)
                        const pl = this.player.position;
                        const e = enemy.position;
                        if (playerDir.y = 1 && enemyDir.x == 1){
                            if (pl.x >= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } else if (playerDir.y = -1 && enemyDir.x == 1){
                            if (pl.x >= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } else if (playerDir.y = 1 && enemyDir.x == -1){
                            if (pl.x <= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } else if (playerDir.y = -1 && enemyDir.x == -1){
                            if (pl.x <= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } else if (playerDir.x = 1 && enemyDir.y == 1){
                            if (pl.x >= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } else if (playerDir.x = 1 && enemyDir.y == -1){
                            if (pl.x >= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } else if (playerDir.x = -1 && enemyDir.y == 1){
                            if (pl.x <= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } else if (playerDir.x = -1 && enemyDir.y == -1){
                            if (pl.x <= e.x){ // enemy attacking
                                playerAtking = false;
                            }
                        } 
                    } else if (angle == 1){
                        // same direction, so higher speed is attacker
                        if (Stats.playerMovementSpeed >= enemy.movementSpeed){
                            playerAtking = true;
                        } else {
                            playerAtking = false;
                        }
                    } else if (angle == -1){
                        // both attacking
                        playerAtking = true;
                        alsoAttackPlayer = true;
                    }

                    if (playerAtking){// player is attacking
                        if (currTime - enemy.lastHit < 1000){
                            continue;
                        }
                        enemy.hp -= Math.max(0, (Stats.attack - enemy.def));
                        enemy.lastHit = Date.now();
                        if (enemy.hp <= 0){
                            this.remove(enemy);
                            this.enemies.delete(enemy);
                            if (this.enemies.size > 0){
                                SOUNDS.enemyDeathSound.play();
                            }
                            // add their hp to the score for now
                            Stats.score += enemy.maxHp;
                        } else {
                            enemy.updateHealth(enemy.hp);
                        }
                    }
                    if (!playerAtking || alsoAttackPlayer) { // enemy is attacking
                        if (Stats.immune || (currTime - this.player.lastHit) < 1000){
                            continue;
                        }
                        this.player.lastHit = Date.now();
                        Stats.health -= Math.max(0, (enemy.atk - Stats.defense));
                    }
                }
        }
    }
    getNumEnemies(){
        return this.enemies.size;
    }
}

export default MazeScene;
