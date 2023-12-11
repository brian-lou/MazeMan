import { Group, Vector3} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './player.glb';

class Player extends Group {
    constructor(parent, maze, keypress) {
        // Call parent Group() constructor
        super();
        this.keypress = keypress;
        this.maze = maze;
        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: (() => this.spin()), // or this.spin.bind(this)
            twirl: 0,
        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'player';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);
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
        let dir = new Vector3();
        if (this.keypress["up"]){
            dir = new Vector3(1/deltaT,0,0);
        } else if (this.keypress["left"]){
            dir = new Vector3(0,0,-1/deltaT);
        } else if (this.keypress["right"]){
            dir = new Vector3(0,0,1/deltaT);
        } else if (this.keypress["down"]){
            dir = new Vector3(-1/deltaT,0,0);
        }
        this.position.add(dir);

        // Advance tween animations, if any exist
        TWEEN.update();
    }
    move(delta){

    }
}

export default Player;
