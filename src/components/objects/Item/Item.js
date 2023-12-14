import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import SPEED_BOOST_MODEL from './speed_boost.glb'
import GHOST_MODEL from './ghost.glb'
import EXP_BOOST_MODEL from './exp_boost.glb'
import TELEPORTER_MODEL from './teleporter.glb'
// import EXP_BOOST_MODEL from './exp_boost.glb'
import * as constants from '../../../js/constants';
import {
  BonusStatsMisc, StatsMultipliers, Stats, ActiveItemCount
} from "../../../js/stats";
class Item {
  constructor(parentScene, type="exp_orb", x, z, teleportDir=null) {
    this.parentScene = parentScene;
    this.type = type;
    this.x = x;
    this.z = z;
    this.teleportDir = teleportDir;
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
      case "ghost":
        loader.load(GHOST_MODEL, (gltf) => {
          this.scene = gltf.scene;
          // Object3D at this.scene
          this.object = this.scene;
          this.object.scale.set(0.15, 0.15, 0.15);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object)
        })
        break;
      case "exp_boost":
        loader.load(EXP_BOOST_MODEL, (gltf) => {
          this.scene = gltf.scene;
          // Object3D at this.scene.children[0]
          this.object = this.scene.children[0]
          this.object.scale.set(0.04, 0.04, 0.04);
          this.object.position.set(x, 0, z - 0.2);
          this.parentScene.add(this.object)
        })
        break;
      case "teleporter":
        loader.load(TELEPORTER_MODEL, (gltf) => {
          this.scene = gltf.scene;
          // Object3D at this.scene
          this.object = this.scene
          this.object.scale.set(0.08, 0.08, 0.08);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object)
        })
        break;
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
        case "ghost":
          this.object.rotation.y += 0.001 * deltaT;
          break;
        case "exp_boost":
          this.object.rotation.y += 0.001 * deltaT;
          break;
        case "teleporter":
          this.object.rotation.y += 0.001 * deltaT;
          break;
      }
    }
  }

  // does nothing if the item has already been collected,
  // otherwise applies the item's effect.
  collectItem() {
    console.log(this.x, this.z);
    if (!this.collected) {
      switch(this.type) {
        case "speed_boost":
          if (ActiveItemCount.speedBoost == 0) {
            StatsMultipliers.playerMovementSpeed *= constants.SPEED_BOOST_MULTIPLIER;
          }
          ActiveItemCount.speedBoost++;
          setTimeout(() => {
            ActiveItemCount.speedBoost--;
            if (ActiveItemCount.speedBoost == 0) {
              StatsMultipliers.playerMovementSpeed /= constants.SPEED_BOOST_MULTIPLIER;
            }
          }, constants.SPEED_BOOST_DURATION);
          break;
        case "ghost":
          Stats.immune = true;
          ActiveItemCount.ghost++;
          setTimeout(() => {
            ActiveItemCount.ghost--;
            // set immune off if no ghost OR teleporters active
            if (ActiveItemCount.ghost == 0 && ActiveItemCount.teleporter == 0) {
              Stats.immune = false;
            }
          }, constants.GHOST_DURATION)
          break;
        case "exp_boost":
          if (ActiveItemCount.expBoost == 0) {
            StatsMultipliers.exp *= constants.EXP_BOOST_MULTIPLIER;
          }
          ActiveItemCount.expBoost++;
          setTimeout(() => {
            ActiveItemCount.expBoost--;
            if (ActiveItemCount.expBoost == 0) {
              StatsMultipliers.exp /= constants.EXP_BOOST_MULTIPLIER;
            }
          }, constants.EXP_BOOST_DURATION);
          break;
        case "teleporter":
          // delay for teleporters
          if (ActiveItemCount.teleporter) {
            break;
          }
          // teleport to a random teleporter on other side
          let teleporters;
          if (this.teleportDir == "left") {
            teleporters = this.parentScene.rightTeleporters;
          } else {
            teleporters = this.parentScene.leftTeleporters;
          }
          // move player location
          const [x, z] = teleporters[Math.floor(Math.random() * teleporters.length)];
          const player = this.parentScene.parent.getPlayer()
          player.position.set(x, 0, z);

          ActiveItemCount.teleporter++;
          Stats.immune = true;
          setTimeout(() => {
            ActiveItemCount.teleporter--;
            // set immune off if no ghost OR teleporters active
            if (ActiveItemCount.ghost == 0 && ActiveItemCount.teleporter == 0) {
              Stats.immune = false;
            }
          }, constants.TELEPORT_IMMUNE_DURATION)
          break;
      }
    }
    // teleporters are permanent
    if (this.type != "teleporter") {
      this.object.visible = false;
      this.collected = true;
    }
  }
}

export default Item;