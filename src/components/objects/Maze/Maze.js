import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


class Maze extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        const loader = new GLTFLoader();

        this.name = 'maze';

        // loader.load(MODEL, (gltf) => {
        //     this.add(gltf.scene);
        // });
    }
}

export default Maze;
