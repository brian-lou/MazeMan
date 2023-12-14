import { Group, Vector3, Box3, Box3Helper, BoxGeometry, Mesh, MeshBasicMaterial, DoubleSide} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './ghost.glb';
import GLOBALVARS from '../../../js/globalVars';

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
        this.bbox = new Box3().setFromCenterAndSize(this.position, this.boxSize);
        this.helper = new Box3Helper(this.bbox, 0x000000);
        this.renderOrder = 10;
        this.add(this.helper);
        this.add(this.bbox);

        let [x, z] = mazeObj.getSpawnPoint();
        this.position.set(x, 0, z);

        
        const loader = new GLTFLoader();
        this.name = 'enemy';

        loader.load(MODEL, (gltf) => {
            this.model = gltf.scene;
            this.model.scale.set(0.5, 0.5, 0.5);
            this.add(this.model);
        });

        parent.addToUpdateList(this);

        this.currentDirection = this.getRandomDirection()[0];
        this.movementSpeed = GLOBALVARS.enemyMovementSpeed / 1000;

        // set stats
        this.maxHp = Math.round(20 * Math.random());
        this.hp = this.maxHp;
        this.def = Math.round(5 * Math.random());
        this.atk = Math.round(5 * Math.random());

        this.lastHit = 0;

        const hpBarGeometry = new BoxGeometry(0.2, 0.2,1.5); // Width and height of the HP bar
        const hpBarMaterial = new MeshBasicMaterial({ color: 0x00ff00}); // Green color for full health
        const hpBar = new Mesh(hpBarGeometry, hpBarMaterial);
        this.hpBarOffset = new Vector3(0,1,0);
        hpBar.position.add(this.hpBarOffset);
        this.hpBar = hpBar;
        this.add(hpBar);
        
    }
    updateHealth(newHp) {
        this.hp = newHp;

        // Calculate the proportion of lost health
        const lostHpRatio = (this.maxHp - this.hp) / this.maxHp;

        // Update green (current health) bar
        this.hpBar.scale.z = 1 - lostHpRatio;
    }
    update(deltaT) {
        if (!this.moveInDirection(this.currentDirection, deltaT)) {
            let dirs = this.getRandomDirection();
            for (let i = 0; i < dirs.length; i++) {
                this.currentDirection = dirs[i];
                if (!this.moveInDirection(this.currentDirection, deltaT)) {
                    continue;
                } else {
                    this.updateLookDirection();
                    break;
                }
            }
        }
    }

    updateLookDirection() {
        if (this.model) {
            let look = new Vector3();
            switch (this.currentDirection) {
                case 'up':
                    look.set(this.position.x + 1, this.position.y, this.position.z);
                    break;
                case 'down':
                    look.set(this.position.x - 1, this.position.y, this.position.z);
                    break;
                case 'left':
                    look.set(this.position.x, this.position.y, this.position.z - 1);
                    break;
                case 'right':
                    look.set(this.position.x, this.position.y, this.position.z + 1);
                    break;
            }
            this.model.lookAt(look);
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

        if (this.mazeObj.getAllowedPosition(this.position, offset, dxdz)) {
            this.position.add(offset);
            this.lookAt(this.position.x + dxdz[0], this.position.y, this.position.z + dxdz[1]);
            if (dxdz[0] != 0){
                this.hpBar.rotation.y = Math.PI/2;
            } else if (dxdz[1] != 0){
                this.hpBar.rotation.y = 0;
            }

            // this.hpBar.lookAt(this.position.x - 1 , this.position.y + this.hpBar.position.y, this.position.z);
            return true;
        }
        return false;
    }
}

export default Enemy;
