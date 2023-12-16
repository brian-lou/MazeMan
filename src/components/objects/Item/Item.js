import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { SphereGeometry, MeshBasicMaterial, Mesh, AudioLoader, Audio } from "three";
import SPEED_BOOST_MODEL from './speed_boost.glb';
import GHOST_MODEL from './ghost.glb';
import EXP_BOOST_MODEL from './exp_boost.glb';
import TELEPORTER_MODEL from './teleporter.glb';
import HP_RESTORE_MODEL from './hp_restore.glb';
import BUFF_MODEL from './buff.glb'
import COIN_MODEL from './coin.glb'
import FREEZE_MODEL from './freeze.glb'
import * as constants from '../../../js/constants';
import {
  StatsMultipliers, Stats, ActiveItemCount
} from "../../../js/stats";
import { SOUNDS } from "../../../app";
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
          this.object = gltf.scene.children[0];
          this.object.scale.set(0.004, 0.0015, 0.004);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object)
        })
        break;
      case "ghost":
        loader.load(GHOST_MODEL, (gltf) => {
          this.object = gltf.scene;
          this.object.scale.set(0.15, 0.15, 0.15);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object)
        })
        break;
      case "exp_boost":
        loader.load(EXP_BOOST_MODEL, (gltf) => {
          this.object = gltf.scene.children[0]
          this.object.scale.set(0.04, 0.04, 0.04);
          this.object.position.set(x, 0, z - 0.2);
          this.parentScene.add(this.object)
        })
        break;
      case "teleporter":
        loader.load(TELEPORTER_MODEL, (gltf) => {
          this.object = gltf.scene
          this.object.scale.set(0.08, 0.08, 0.08);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object)
        })
        break;
      case "hp_restore":
        loader.load(HP_RESTORE_MODEL, (gltf) => {
          this.object = gltf.scene.children[0];
          this.object.scale.set(0.65, 1, 0.65);
          this.object.position.set(x, 0, z);
          this.parentScene.add(this.object);
        })
        break;
      case "buff":
        loader.load(BUFF_MODEL, (gltf) => {
          this.object = gltf.scene;
          this.object.scale.set(0.375, 0.375, 0.375);
          this.object.position.set(x, 0, z);
          this.object.rotation.set(0.6, 0, 0);
          this.parentScene.add(this.object);
        })
        break;
      case "coin":
        loader.load(COIN_MODEL, (gltf) => {
          this.scene = gltf.scene;
          // Object3D at this.scene.children[0]
          this.object = this.scene.children[0];
          this.object.scale.set(0.9, 0.3, 0.9);
          this.object.position.set(x, 0.2, z - 0.55);
          this.object.rotation.set(0.6, 0, 0);
          this.parentScene.add(this.object);
        })
        break;
      case "freeze":
        loader.load(FREEZE_MODEL, (gltf) => {
          this.scene = gltf.scene;
          // Object3D at this.scene.children[0]
          this.object = this.scene.children[0];
          this.object.scale.set(0.45, 0.45, 0.45);
          this.object.position.set(x, 0, z);
          this.object.rotation.set(0, 0.6, 0);
          this.parentScene.add(this.object);
        })
        break;
      case "exp_orb":
        const orbGeometry = new SphereGeometry(0.15);
        const orbMaterial = new MeshBasicMaterial({
            color: 0xfff800
        });
        const orbMesh = new Mesh(orbGeometry, orbMaterial);
        orbMesh.position.set(x, 0, z);
        this.object = orbMesh;
        this.parentScene.add(this.object);
        break;
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
        case "hp_restore":
          this.object.rotation.z += 0.001 * deltaT;
          break;
        case "buff":
          this.object.rotation.y += 0.001 * deltaT;
          break;
        case "coin":
          this.object.rotation.z += 0.001 * deltaT;
          break;
        case "freeze":
          this.object.rotation.x += 0.001 * deltaT;
          break;
      }
    }
  }

  // does nothing if the item has already been collected,
  // otherwise applies the item's effect.
  collectItem() {
    if (!this.collected && this.object && this.object.visible) {
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
            if (ActiveItemCount.ghost == 0 && ActiveItemCount.teleporter <= 1) {
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
          // count = 2 if immune, = 1 if cooldown, = 0 if not active
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

          ActiveItemCount.teleporter += 2;
          Stats.immune = true;
          setTimeout(() => {
            // set immune off if no ghost OR teleporter active
            ActiveItemCount.teleporter--;
            if (ActiveItemCount.ghost == 0 && ActiveItemCount.teleporter <= 1) {
              Stats.immune = false;
            }
          }, constants.TELEPORT_IMMUNE_DURATION)
          setTimeout(() => {
            ActiveItemCount.teleporter--;
          }, constants.TELEPORT_COOLDOWN)
          break;
        case "hp_restore":
          Stats.health = Math.min(
            Stats.maxHealth,
            Stats.health + Stats.maxHealth * constants.HP_RESTORE_FACTOR
          )
          break;
        case "buff":
          if (ActiveItemCount.buff == 0) {
            StatsMultipliers.attack *= constants.BUFF_MULTIPLIER
            StatsMultipliers.defense *= constants.BUFF_MULTIPLIER
            StatsMultipliers.maxHealth *= constants.BUFF_MULTIPLIER
          }
          ActiveItemCount.buff++;
          setTimeout(() => {
            ActiveItemCount.buff--;
            if (ActiveItemCount.buff == 0) {
              StatsMultipliers.attack /= constants.BUFF_MULTIPLIER
              StatsMultipliers.defense /= constants.BUFF_MULTIPLIER
              StatsMultipliers.maxHealth /= constants.BUFF_MULTIPLIER
            }
          }, constants.BUFF_DURATION);
          break;
        case "coin":
          ActiveItemCount.coin++;
          break;
        case "freeze":
          if (ActiveItemCount.freeze == 0) {
            ActiveItemCount.freezeOffset = StatsMultipliers.enemyMovementSpeed;
            StatsMultipliers.enemyMovementSpeed = 0;
          }
          ActiveItemCount.freeze++;
          setTimeout(() => {
            ActiveItemCount.freeze--;
            if (ActiveItemCount.freeze == 0) {
              StatsMultipliers.enemyMovementSpeed = ActiveItemCount.freezeOffset;
              ActiveItemCount.freezeOffset = 0;
            }
          }, constants.FREEZE_DURATION);
          break;
        case "exp_orb":
          Stats.score += StatsMultipliers.exp;
          break;
      }
      // only teleporters are permanent
      if (this.type != "teleporter") {
        this.object.visible = false;
        this.collected = true;
      }
      if (this.type != "exp_orb"){ // play sound
        SOUNDS.pickUpSound.play();
      }
    }
  }
}

export default Item;