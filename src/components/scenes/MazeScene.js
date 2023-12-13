import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { Player, Maze } from 'objects';
import { BasicLights } from 'lights';
// import { Enemy } from 'enemies';

class MazeScene extends Scene {
    constructor(keypress) {
        // Call parent Scene() constructor
        super();
        this.keypress = keypress;
        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: Array(),
        };

        // Set background to a nice color
        this.background = new Color(0x92bdd9);

        // Add meshes to scene
        const maze = new Maze(this);
        const player = new Player(this, maze, keypress);
        this.player = player;
        const lights = new BasicLights();
        const axesHelper = new AxesHelper(5);
        this.add(player, maze, lights, axesHelper);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', 0, 0 );
    }
    getPlayer(){
        return this.player;
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(playerX, playerZ, deltaT) {
        // Call update for each object in the updateList
        for (const obj of this.state.updateList) {
            if (obj instanceof Maze) {
                obj.update(playerX, playerZ);
            } else if (obj instanceof Player) {
                obj.update(deltaT);
            }
        }
    }
}

export default MazeScene;
