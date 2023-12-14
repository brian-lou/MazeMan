import { Group, Vector3, Box3, Box3Helper, BoxGeometry, Mesh, MeshBasicMaterial, DoubleSide} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './ghost.glb';
import { EnemyAtkByLvl, EnemyDefByLvl, EnemyHpByLvl, EnemySpdByLvl, Stats } from '../../../js/stats';
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
        this.bbox = new Box3().setFromCenterAndSize(this.position, this.boxSize);
        this.helper = new Box3Helper(this.bbox, 0x000000);
        this.renderOrder = 10;
        this.add(this.helper);

        let [x, z] = mazeObj.getRandomAllowedPoint();
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

        // set stats
        // Hp between upperBoundHp/2 and upperBoundHp
        const upperBoundHp = EnemyHpByLvl[Stats.level];
        this.maxHp = Math.floor(upperBoundHp/2) + Math.round(upperBoundHp * Math.random() / 2);
        this.hp = this.maxHp;
        // def between upperBoundDef/2 and upperBoundDef
        const upperBoundDef = EnemyDefByLvl[Stats.level];
        this.def = Math.floor(upperBoundDef/2) + Math.round(upperBoundDef * Math.random() / 2);
        // atk between upperBoundAtk/2 and upperBoundAtk
        const upperBoundAtk = EnemyAtkByLvl[Stats.level];
        this.atk = Math.floor(upperBoundAtk/2) + Math.round(upperBoundAtk * Math.random() / 2);
        // speed is randomized between 0.75x and 1.25x
        this.speedMult = (Math.random() / 2) + 0.75;
        this.movementSpeed = 0;

        this.lastHit = 0;
        this.timeSinceLastTurn = 0;

        let hpRatio = this.maxHp / upperBoundHp;
        const hpBarGeometry = new BoxGeometry(0.1, 0.2, 2 * hpRatio); // Width and height of the HP bar
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
        // t and T intersections
        if (this.futureTurn == null && Date.now() - this.timeSinceLastTurn >= 1000){
            // not yet randomized for this intersection
            let exits = this.mazeObj.getExits(this.position.x, this.position.z, this.currentDirection);
            if (exits.length > 1){
                this.futureTurn = exits[Math.floor(Math.random() * exits.length)];
                this.timeSinceLastTurn = Date.now();
            }
        }

        // Randomly selected to go in the same dir
        if (this.futureTurn == null || 
            (this.futureTurn[0] == this.currentDirection[0] && this.futureTurn[1] == this.currentDirection[1]) ||
            (this.futureTurn[0] == -this.currentDirection[0] && this.futureTurn[1] == -this.currentDirection[1])){
            // First try to go straigh, if hit wall, randomly turn
            if (!this.moveInDirection(this.currentDirection, deltaT)) {
                let dirs = this.getRandomDirection();
                for (let i = 0; i < dirs.length; i++) {
                    this.currentDirection = dirs[i];
                    if (!this.moveInDirection(this.currentDirection, deltaT)) {
                        continue;
                    } else {
                        break;
                    }
                }
            }
            this.futureTurn = null;
        } else {
            // smooth turn
            let prevDir = this.currentDirection;
            let dirToTurn = this.futureTurn;
            let newX = this.position.x;
            let newZ = this.position.z;
            if (prevDir[1] == -1 && dirToTurn[0] == 1){
                newZ = Math.round(newZ);
            } else if (prevDir[1] == 1 && dirToTurn[0] == 1){
                newZ = Math.round(newZ);
            } else if (prevDir[1] == -1 && dirToTurn[0] == -1){
                newZ = Math.round(newZ);
            } else if (prevDir[1] == 1 && dirToTurn[0] == -1){
                newZ = Math.round(newZ);
            } else if (prevDir[0] == 1 && dirToTurn[1] == -1){
                newX = Math.round(newX);
            } else if (prevDir[0] == 1 && dirToTurn[1] == 1){
                newX = Math.round(newX);
            } else if (prevDir[0] == -1 && dirToTurn[1] == -1){
                newX = Math.round(newX);
            } else if (prevDir[0] == -1 && dirToTurn[1] == 1){
                newX = Math.round(newX);
            }
            let dist = Math.sqrt(Math.pow(newX - this.position.x, 2) + Math.pow(newZ - this.position.z, 2));
            if (dist > MOVEMENT_EPS * this.speedMult * Stats.enemyMovementSpeed){
                // keep going straight
                this.moveInDirection(this.currentDirection, deltaT)
            } else {
                // console.log('TURNING', this.currentDirection, this.futureTurn);
                this.position.set(newX, this.position.y, newZ);
                this.currentDirection = this.futureTurn;
                this.futureTurn = null;
                this.lookAt(this.position.x + this.currentDirection[0], this.position.y, this.position.z + this.currentDirection[1]);
                if (this.currentDirection[0] != 0){
                    this.hpBar.rotation.y = Math.PI/2;
                } else if (this.currentDirection[1] != 0){
                    this.hpBar.rotation.y = 0;
                }
                return;
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
        const directions = [[-1,0],[1,0],[0,1],[0,-1]];
        this.shuffleArray(directions);
        return directions;
    }

    moveInDirection(direction, deltaT) {
        let dxdz = direction;
        const movementSpeed = this.speedMult * Stats.enemyMovementSpeed * deltaT / 1000;
        this.movementSpeed = movementSpeed;
        let offset = new Vector3(movementSpeed * dxdz[0], 0, movementSpeed * dxdz[1]);

        if (this.mazeObj.getAllowedPosition(this.position, offset, dxdz)) {
            this.dir = dxdz;
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
