import { Group, Vector3, Box3, Box3Helper} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './pacman.glb';
import {MOVEMENT_EPS, MOVEMENT_FACTOR} from '../../../js/constants'
import { Stats } from '../../../js/stats';

class Player extends Group {
    constructor(parent, mazeObj, keypress) {
        // Call parent Group() constructor
        super();
        this.keypress = keypress;
        this.mazeObj = mazeObj;
        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: (() => this.spin()), // or this.spin.bind(this)
            twirl: 0,
        };
        this.boxSize = new Vector3(0.7, 0.7, 0.7);
        this.bbox = new Box3().setFromCenterAndSize(
            this.position,
            this.boxSize
        );
        // this.helper = new Box3Helper(this.bbox, 0x000000);
        this.renderOrder = 10;
        // this.add(this.helper);

        // Set random spawn point (for now)
        let [x,z] = mazeObj.getRandomAllowedPoint();
        this.position.set(x, 0, z);

        this.primaryDirection = true;
        this.dir = [-1, 0];
        this.isMoving = false;
        this.lastHit = 0;

        // Load object
        const loader = new GLTFLoader();
        this.name = 'player';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.4, 0.4, 0.4);
            model.rotation.y = - Math.PI / 2; // Rotates 180 degrees around the Y axis
            // Compute bounding box for the player
            model.traverse((child) => {
                if (child.isMesh) {
                    // child.geometry.computeBoundingBox();
                }
            });
            this.add(model);
        });
        // initial direction
        this.lookAt(this.position.x - 1, this.position.y, this.position.z);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(deltaT) {
        // Get most recent direction of movement
        let offset = new Vector3(0,0,0);
        let dir = "";
        let updateTime = 0;
        for (let [k,v] of Object.entries(this.keypress)){
            if (v > updateTime){
                updateTime = v;
                dir = k;
            }
        }
        this.isMoving = false;
        if (dir == " ") return;
        let dxdz = null;
        if (dir == "up"){
            offset = new Vector3((Stats.playerMovementSpeed / MOVEMENT_FACTOR) * deltaT,0,0);
            dxdz = [1, 0];
        } else if (dir == "left"){
            offset = new Vector3(0,0,-(Stats.playerMovementSpeed / MOVEMENT_FACTOR) * deltaT);
            dxdz = [0, -1];
        } else if (dir == "right"){
            offset = new Vector3(0,0,(Stats.playerMovementSpeed / MOVEMENT_FACTOR) * deltaT);
            dxdz = [0, 1];
        } else if (dir == "down"){
            offset = new Vector3(-(Stats.playerMovementSpeed / MOVEMENT_FACTOR) * deltaT,0,0);
            dxdz = [-1, 0];
        }
        let checkSecondary = true;
        if (dxdz != null &&
            this.mazeObj.getAllowedPosition(
            this.position,
            offset,
            dxdz
        )){
            let startingPos = this.position.clone();
            checkSecondary = false;
            this.lookAt(this.position.x + dxdz[0], this.position.y, this.position.z + dxdz[1]);
            this.position.add(offset);
            this.isMoving = true;
            this.dir = dxdz;
            
            // smooth turning: add code handling each of the 8 cases here 
            // (L->U, R->U, L->D, R->D, U->L, U->R, D->L, D->R)
            // that gracefully moves the player to an integer coordinate
            if (this.previousOffset != null && this.previousDxDz != null){
                let prevDxDz = this.previousDxDz;
                let p = this.position;
                let prevPos = this.position.clone();
                if (prevDxDz[1] == -1 && dxdz[0] == 1){
                    this.position.set(p.x, p.y, Math.round(p.z));
                } else if (prevDxDz[1] == 1 && dxdz[0] == 1){
                    this.position.set(p.x, p.y, Math.round(p.z));
                } else if (prevDxDz[1] == -1 && dxdz[0] == -1){
                    this.position.set(p.x, p.y, Math.round(p.z));
                } else if (prevDxDz[1] == 1 && dxdz[0] == -1){
                    this.position.set(p.x, p.y, Math.round(p.z));
                } else if (prevDxDz[0] == 1 && dxdz[1] == -1){
                    this.position.set(Math.round(p.x), p.y, p.z);
                } else if (prevDxDz[0] == 1 && dxdz[1] == 1){
                    this.position.set(Math.round(p.x), p.y, p.z);
                } else if (prevDxDz[0] == -1 && dxdz[1] == -1){
                    this.position.set(Math.round(p.x), p.y, p.z);
                } else if (prevDxDz[0] == -1 && dxdz[1] == 1){
                    this.position.set(Math.round(p.x), p.y, p.z);
                }
                let dist = Math.abs(prevPos.distanceTo(this.position));
                if (dist > MOVEMENT_EPS * Stats.playerMovementSpeed){
                    this.position.set(startingPos.x, startingPos.y, startingPos.z);
                    checkSecondary = true;
                } else {
                    this.previousDxDz = dxdz;
                    this.previousOffset = offset;
                }
            } else {
                this.previousDxDz = dxdz;
                this.previousOffset = offset;
            }
        } 
        if (checkSecondary && this.previousOffset != null && this.previousDxDz != null){
            let prevOffset = this.previousOffset.clone();
            let prevDxDz = this.previousDxDz;
            if (this.mazeObj.getAllowedPosition(
                this.position,
                prevOffset,
                prevDxDz
            )){
                this.position.add(prevOffset);
                this.lookAt(this.position.x + prevDxDz[0], this.position.y, this.position.z + prevDxDz[1]);
                this.dir = prevDxDz;
                this.isMoving = true;
            }
        }
        
    }
}

export default Player;
