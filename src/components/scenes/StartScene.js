import * as Dat from 'dat.gui';
import { Scene } from 'three';
import * as THREE from 'three';
import { BasicLights } from 'lights';

class StartScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        /*   // Add fog
        this.fog = new THREE.FogExp2(0xd19264, 0.015);

        this.sky = new Sky();
        this.sky.scale.setScalar(1000); */

        // LIGHTING
        const lights = new BasicLights();

        const hemiLight = new THREE.HemisphereLight(0xff8f00, 0xffffff, 0.9);
        hemiLight.castShadow = true;

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
        dirLight.position.set(0, 10, 0);

        // this.add(lights, this.sky, airplane, chunkManager);
        this.add(hemiLight, dirLight);
    }
}
export default StartScene;
