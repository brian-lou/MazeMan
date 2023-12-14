import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SPEED_BOOST_MODEL from './speed_boost.glb'
// import EXP_BOOST_MODEL from './exp_boost.glb'
import { BonusStatsMisc, StatsMultipliers } from "../../../js/stats";
class Item {
  constructor(parentScene, type="exp_orb", x, z) {
    this.parentScene = parentScene;
    this.type = type;
    this.collected = false;

    // construct item based on its type
    const loader = new GLTFLoader();
    switch(type) {
      case "speed_boost":
        loader.load(SPEED_BOOST_MODEL, (gltf) => {
          this.scene = gltf.scene;
          // Object3D at this.scene.children[0]
          this.object = this.scene.children[0];
          this.object.scale.set(0.004, 0.0015, 0.004);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object)
        })
        break;
      // case "exp_boost":
      //   loader.load(EXP_BOOST_MODEL, (gltf) => {
      //     this.scene = gltf.scene;
      //     console.log(this.scene)
      //     // Object3D at this.scene.children[0]
      //     this.object = this.scene
      //     this.object.scale.set(1, 1, 1);
      //     this.object.position.set(x, 0, z);
      //     this.parentScene.add(this.object)
      //   })
      //   break;
      // // case "dot":

      //   break;
      default:
        throw new Error("invalid item")
    }
  }

  // updates the item
  update(deltaT) {
    // obj must be loaded
    if (this.object) {
      // rotate item
      switch(this.type) {
        case "speed_boost":
          this.object.rotation.z += 0.001 * deltaT;
          break;
      }
    }
  }

  // does nothing if the item has already been collected,
  // otherwise applies the item's effect.
  collectItem() {
    if (!this.collected) {
      switch(this.type) {
        // Increase speed by 1.5x for 5 seconds
        case "speed_boost":
          StatsMultipliers.playerMovementSpeed *= 1.5;
          setTimeout(() => {
            StatsMultipliers.playerMovementSpeed /= 1.5;
          }, 5000);
        // Increase exp multiplier by 2x for 5 seconds

      }
    }
    this.object.visible = false;
    this.collected = true;
    // change this.collected and object visibility
    const x = 1;
  }
}

export default Item;