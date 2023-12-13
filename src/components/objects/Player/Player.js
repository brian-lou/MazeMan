import { Group, Vector3, Box3, Box3Helper} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './player.glb';
import { MOVEMENT_SPEED } from '../../../js/constants';

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
        this.playerBox = new Box3().setFromCenterAndSize(
            this.position,
            this.boxSize
        );
        this.helper = new Box3Helper(this.playerBox, 0x000000);
        this.renderOrder = 10;
        this.add(this.helper);
        this.add(this.playerBox)
        // Set random spawn point (for now)
        let [x,z] = mazeObj.getSpawnPoint();
        this.position.set(x, 0, z);

        this.primaryDirection = true;

        // Load object
        const loader = new GLTFLoader();

        this.name = 'player';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);

            // Compute bounding box for the player
            model.traverse((child) => {
                if (child.isMesh) {
                    // child.geometry.computeBoundingBox();
                }
            });
            this.add(model);
        });
        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        this.state.gui.add(this.state, 'bob');
        this.state.gui.add(this.state, 'spin');
    }

    spin() {
        // Add a simple twirl
        this.state.twirl += 6 * Math.PI;

        // Use timing library for more precice "bounce" animation
        // TweenJS guide: http://learningthreejs.com/blog/2011/08/17/tweenjs-for-smooth-animation/
        // Possible easings: http://sole.github.io/tween.js/examples/03_graphs.html
        const jumpUp = new TWEEN.Tween(this.position)
            .to({ y: this.position.y + 1 }, 300)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.position)
            .to({ y: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    update(deltaT) {
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Get most recent direction of movement
        let offsets = [new Vector3(0,0,0), new Vector3(0,0,0)];
        let time = 0;
        let times = [];
        for (let [k,v] of Object.entries(this.keypress)){
            times.push([v, k]);
        }
        times.sort(function(a,b){return b[0] - a[0];}); 

        let dxdzs = [[0,0],[0,0]];
        for (let i = 0 ;i <2; i++){
            if (times[i][1] == "up"){
                offsets[i] = new Vector3((MOVEMENT_SPEED / 10) / deltaT,0,0);
                dxdzs[i] = [1, 0];
            } else if (times[i][1] == "left"){
                offsets[i] = new Vector3(0,0,-(MOVEMENT_SPEED / 10) / deltaT);
                dxdzs[i] = [0, -1];
            } else if (times[i][1] == "right"){
                offsets[i] = new Vector3(0,0,(MOVEMENT_SPEED / 10) / deltaT);
                dxdzs[i] = [0, 1];
            } else if (times[i][1] == "down"){
                offsets[i] = new Vector3(-(MOVEMENT_SPEED / 10) / deltaT,0,0);
                dxdzs[i] = [-1, 0];
            }
        }
        // conditions for turning:
        // 1. Secondary direciton was previously executed
        // 2. Player is actively moving and goes in a perp direction

        // check that player location is not within a wall
        if (this.playerBox != null && 
            this.mazeObj.getAllowedPosition(
            this.position,
            offsets[0],
            dxdzs[0],
            this.playerBox
        )){
            if (!this.primaryDirection){
                // previously unable to go in this dir, but now able to
                // add code handling each of the 8 cases here 
                // (L-U, R-U, L-D, R-D, U-L, U-R, D-L, D-R)
                // additionally, distance check (?)
            }
            this.position.add(offsets[0]);
            this.directionOfMovement = times[0][1];
        } else {
            this.primaryDirection = false;
            // try the secondary direction (within 0.5 sec)
            if (this.mazeObj.getAllowedPosition(
                this.position,
                offsets[1],
                dxdzs[1],
                this.playerBox
            )){
                this.position.add(offsets[1]);
                this.directionOfMovement = times[1][1];
            } 
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Player;
