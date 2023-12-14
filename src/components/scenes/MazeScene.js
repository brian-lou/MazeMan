import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, Box3 } from 'three';
import { Player, Maze, Enemy } from 'objects';
import { BasicLights } from 'lights';
import globalVars from '../../js/globalVars';
// import { Enemy } from 'enemies';

class MazeScene extends Scene {
    constructor(keypress, camera) {
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
        this.background = new Color(0x92bdd9);

        // Add meshes to scene
        const maze = new Maze(this);
        const player = new Player(this, maze, keypress);
        // const enemy = new Enemy(this, maze, keypress);
        // this.enemy = enemy;
        this.player = player;
        const lights = new BasicLights(player, camera);
        this.lights = lights;
        // const axesHelper = new AxesHelper(5);
        this.enemies = [];
        for (let i = 0; i < 20; i++) { 
            const enemy = new Enemy(this, maze);
            this.enemies.push(enemy);
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
        // Call update for each object in the updateList
        for (const obj of this.state.updateList) {
            if (obj instanceof Maze) {
                obj.update(playerX, playerZ);
            } else if (obj instanceof Player) {
                obj.update(deltaT);
            } else if(obj instanceof Enemy){
                obj.update(deltaT);
            }
        }
        const currTime = Date.now();
        for (let enemy of this.enemies){
            if (currTime - enemy.lastHit < 1000){
                continue;
            }
            console.log(enemy.hpBar.position)
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
                    // 
                    enemy.lastHit = Date.now();
                    enemy.updateHealth(enemy.hp / 2);
                    let playerHpLeft = globalVars.health;
                    // this.remove(enemy);
                }
        }
        this.lights.updateSpotlight();
    }
}

export default MazeScene;
