import { Group, Vector3, Box3, Box3Helper } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './ghost.glb';
import GLOBALVARS from '../../../js/globalVars';
import { MOVEMENT_EPS } from '../../../js/constants';

class Enemy extends Group {
    constructor(parent, mazeObj) {
        super();

        this.mazeObj = mazeObj;
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: (() => this.spin()),
            twirl: 0,
        };
        this.boxSize = new Vector3(0.7, 0.7, 0.7);
        this.playerBox = new Box3().setFromCenterAndSize(this.position, this.boxSize);
        this.helper = new Box3Helper(this.playerBox, 0x000000);
        this.renderOrder = 10;
        this.add(this.helper);
        this.add(this.playerBox);

        let [x, z] = mazeObj.getSpawnPoint();
        this.position.set(x, 0, z);

        const loader = new GLTFLoader();
        this.name = 'enemy';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5);
            this.add(model);
        });

        parent.addToUpdateList(this);

        this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'spin');

        this.currentDirection = this.getRandomDirection()[0];
        this.movementSpeed = GLOBALVARS.movementSpeed / 1000;
    }

    update(deltaT) {
        if (!this.moveInDirection(this.currentDirection, deltaT)) {
            let dirs = this.getRandomDirection();
            for (let i = 0; i < dirs.length; i++){
                this.currentDirection = dirs[i];
                if (!this.moveInDirection(this.currentDirection, deltaT)) {
                    continue
                } else {
                    break;
                }
            }
        }
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getRandomDirection() {
        const directions = ['up', 'down', 'left', 'right'];
        this.shuffleArray(directions);
        return directions;
    }

    moveInDirection(direction, deltaT) {
        let offset = new Vector3(0, 0, 0);
        let dxdz = null;
        const movementSpeed = this.movementSpeed * deltaT;

        switch (direction) {
            case 'up':
                offset = new Vector3(movementSpeed, 0, 0);
                dxdz = [1, 0];
                break;
            case 'down':
                offset = new Vector3(-movementSpeed, 0, 0);
                dxdz = [-1, 0];
                break;
            case 'left':
                offset = new Vector3(0, 0, -movementSpeed);
                dxdz = [0, -1];
                break;
            case 'right':
                offset = new Vector3(0, 0, movementSpeed);
                dxdz = [0, 1];
                break;
        }

        if (this.mazeObj.getAllowedPosition(this.position, offset, dxdz, this.playerBox)) {
            this.position.add(offset);
            return true;
        }
        return false;
    }
    spin() {
    }
}

export default Enemy;
