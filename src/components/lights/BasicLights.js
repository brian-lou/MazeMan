import { Group, SpotLight, AmbientLight, HemisphereLight } from 'three';

class BasicLights extends Group {
    constructor(player, camera) {
        // Invoke parent Group() constructor with our args
        super();
        this.player = player;
        this.camera = camera;
        const dir = new SpotLight(0xffffff, 1.6, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.32);
        const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);
        this.spotlight = dir;

        dir.position.set(5, 1, 2);
        dir.target.position.set(0, 0, 0);

        this.add(dir, ambi, hemi);
    }
    updateSpotlight(){
        let p = this.camera.position;
        let player = this.player;
        this.spotlight.position.set(p.x, p.y, p.z);
        this.spotlight.target.position.set(player.x, player.y, player.z);
    }
}

export default BasicLights;
