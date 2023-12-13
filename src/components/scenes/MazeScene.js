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
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x92bdd9);

        // Add meshes to scene
        const maze = new Maze();
        const player = new Player(this, maze, keypress);
        this.player = player;
        const lights = new BasicLights();
        this.add(player, maze, lights);
        const axesHelper = new AxesHelper( 5 );
        this.add(axesHelper)

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', 0, 0 );
    }
    getPlayer(){
        return this.player;
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(deltaT) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * deltaT) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(deltaT);
        }
    }
}

export default MazeScene;
