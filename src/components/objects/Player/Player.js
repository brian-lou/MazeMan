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
        this.boxSize = new Vector3(0.35, 0.35, 0.35);
        this.playerBox = new Box3().setFromCenterAndSize(
            new Vector3(),
            this.boxSize
        );
        this.helper = new Box3Helper(this.playerBox, 0x000000);
        this.add(this.helper)
        // Set random spawn point (for now)
        let [x,z] = mazeObj.getSpawnPoint();
        this.position.set(x, 0, z);

        // Load object
        const loader = new GLTFLoader();

        this.name = 'player';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);

            // Compute bounding box for the player
            model.traverse((child) => {
                if (child.isMesh) {
                    // this.playerBox.setFromObject(child);
                    // this.playerBox.expandByScalar(-3.5)
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
        let dir = new Vector3();
        let time = 0;
        let direction = "";
        for (let [k,v] of Object.entries(this.keypress)){
            if (v > time){
                direction = k;
                time = v;
            }
        }
        if (direction == "up"){
            dir = new Vector3(MOVEMENT_SPEED / deltaT,0,0);
        } else if (direction == "left"){
            dir = new Vector3(0,0,-MOVEMENT_SPEED / deltaT);
        } else if (direction == "right"){
            dir = new Vector3(0,0,MOVEMENT_SPEED / deltaT);
        } else if (direction == "down"){
            dir = new Vector3(-MOVEMENT_SPEED / deltaT,0,0);
        }
        // console.log(this.position)

        // check that player location is not within a wall
        if (this.playerBox != null && this.mazeObj.getAllowedPosition(
            this.position.x + dir.x, 
            this.position.z + dir.z,
            this.playerBox
        )){
            this.position.add(dir);
            if (this.playerBox){
                this.playerBox.setFromCenterAndSize(
                    new Vector3(
                        this.position.x + this.boxSize.x,
                        this.position.y + this.boxSize.y,
                        this.position.z + this.boxSize.z,
                    ),
                    this.boxSize
                );
                this.helper.updateMatrixWorld();
            }
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Player;
