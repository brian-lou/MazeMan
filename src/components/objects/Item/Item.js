import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SPEED_ITEM_MODEL from './speed_item.glb'
class Item {
  constructor(parentScene, type="exp_orb", x, z) {
    this.parentScene = parentScene;
    this.type = type;
    this.collected = false;

    // construct item based on its type
    const loader = new GLTFLoader();
    switch(type) {
      case "speed_boost":
        loader.load(SPEED_ITEM_MODEL, (gltf) => {
          this.scene = gltf.scene;
          // Object3D at this.scene.children[0]
          this.object = this.scene.children[0];
          this.object.scale.set(0.004, 0.0015, 0.004);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object)
        })
        break;
      // case "dot":

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
      
    }
    // change this.collected and object visibility
    const x = 1;
  }
}

export default Item;