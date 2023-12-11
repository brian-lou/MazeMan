import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Player, Maze } from 'objects';
import { BasicLights } from 'lights';

class MazeScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x92bdd9);

        // Add meshes to scene
        const player = new Player(this);
        const maze = new Maze();
        const lights = new BasicLights();
        this.add(player, maze, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', 0, 0 );
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default MazeScene;
