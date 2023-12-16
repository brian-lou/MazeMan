import {
    PlaneGeometry,
    Mesh,
    DoubleSide,
    BufferAttribute,
    BufferGeometry,
    BoxGeometry,
    SphereGeometry,
    MeshBasicMaterial,
    Group,
    Euler,
    Box3,
    Box3Helper,
    Vector3,
    TextureLoader,
    MeshLambertMaterial,
} from 'three';
import Generator from './Generator';
import { FLOOR_COLOR, WALL_COLOR } from '../../../js/constants';
import { Item } from '../Item';
import * as constants from '../../../js/constants';

class Maze extends Group {
    constructor(parent, generalInfo) {
        // Call parent Group() constructor
        super();
        // Add self to parent's update list
        parent.addToUpdateList(this);
        this.name = 'maze';
        const EPS = 1e-2;
        const WALL_LEN = 1;
        this.WALL_LEN = WALL_LEN;
        const MAZE_LEN = 15; // Have to change pacmangen as well, hardcoded
        this.MAZE_LEN = MAZE_LEN;
        this.maze = new Generator(MAZE_LEN, MAZE_LEN);
        this.maze.generate();
        const mazeArray = this.maze.maze;
        const wallGeo = new BoxGeometry(WALL_LEN, WALL_LEN, WALL_LEN);
        const texture = new TextureLoader().load( generalInfo.wallTexture );
        const wallMat = new MeshBasicMaterial( { map: texture } );
        this.mazeHeight = mazeArray.length;
        this.mazeWidth = mazeArray[0].length;
        this.allowedLocations = Array(this.mazeHeight).fill().map(() => Array(this.mazeWidth).fill(true));
        this.wallBoxes = Array(this.mazeHeight).fill().map(() => Array(this.mazeWidth).fill(null));
        this.items = Array(this.mazeHeight).fill().map(() => Array(this.mazeWidth).fill(null));
        this.leftTeleporters = Array(); // array of [i, j] indexes where a teleporter is
        this.rightTeleporters = Array(); // separate array for left and right side of map
    
        // add walls
        for (let i = 0; i < mazeArray.length; i++) {
            for (let j = 0; j < mazeArray[i].length; j++) {
                // side walls
                if (
                    i == 0 ||
                    i == mazeArray.length - 1 ||
                    j == 0 ||
                    j == mazeArray[i].length - 1
                ) {
                    const wall = new Mesh(wallGeo, wallMat);
                    wall.position.set(i * WALL_LEN, 0, j * WALL_LEN);
                    this.add(wall);
                    this.allowedLocations[i][j] = false;
                    let box = new Box3().setFromObject(wall);
                    this.wallBoxes[i][j] = box;
                    // let helper = new Box3Helper(box, 0x000000);
                    // this.add(helper);
                }
                // intra-maze walls
                else if (mazeArray[i][j] === 1) {
                    const wall = new Mesh(wallGeo, wallMat);
                    wall.position.set(i * WALL_LEN, 0, j * WALL_LEN);
                    this.add(wall);
                    this.allowedLocations[i][j] = false;
                    let box = new Box3().setFromObject(wall);
                    this.wallBoxes[i][j] = box;
                    // let helper = new Box3Helper(box, 0x000000);
                    // this.add(helper);
                }
            }
        }

        // add floor
        const floorWidth = MAZE_LEN * 3 - 2;
        const floorHeight = MAZE_LEN * 3 + 3;
        const floorGeometry = new PlaneGeometry(
            floorWidth,
            floorHeight
        );
        const floorMaterial = new MeshBasicMaterial({
            color: generalInfo.floorColor,
            side: DoubleSide,
        });
        const floor = new Mesh(floorGeometry, floorMaterial);
        floor.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        floor.position.set(0.5*floorHeight, -0.5 * WALL_LEN - EPS, 0.5*floorWidth);
        this.add(floor);



        // Add items to the maze
        // teleport (placed at all dead-ends in the maze)
        for (let i = 0; i < mazeArray.length; i++) {
            for (let j = 0; j < mazeArray[i].length; j++) {
                if (this.allowedLocations[i][j]) {
                    let wallCount = 0;
                    wallCount += (this.allowedLocations[i - 1][j]) ? 0 : 1
                    wallCount += (this.allowedLocations[i + 1][j]) ? 0 : 1
                    wallCount += (this.allowedLocations[i][j - 1]) ? 0 : 1
                    wallCount += (this.allowedLocations[i][j + 1]) ? 0 : 1
                    if (wallCount == 3) {
                        if (j <= 3) {
                            this.leftTeleporters.push([i, j]);
                            this.items[i][j] = new Item(this, "teleporter", i, j, "left");
                        } else {
                            this.rightTeleporters.push([i, j])
                            this.items[i][j] = new Item(this, "teleporter", i, j, "right");
                        }
                        parent.addToUpdateList(this.items[i][j]);
                    }
                }
            }
        }
        // speed boost
        for (let i = 0; i < constants.SPEED_BOOST_COUNT; i++) {
            const randomPos = this.getRandomEmptyPoint();
            if (randomPos) {
                const [x, z] = randomPos;
                this.items[x][z] = new Item(this, "speed_boost", x, z)
                parent.addToUpdateList(this.items[x][z])
            }
        }
        // ghost
        for (let i = 0; i < constants.GHOST_COUNT; i++) {
            const randomPos = this.getRandomEmptyPoint();
            if (randomPos) {
                const [x, z] = randomPos;
                this.items[x][z] = new Item(this, "ghost", x, z)
                parent.addToUpdateList(this.items[x][z])
            }
        }
        // exp boost
        for (let i = 0; i < constants.EXP_BOOST_COUNT; i++) {
            const randomPos = this.getRandomEmptyPoint();
            if (randomPos) {
                const [x, z] = randomPos;
                this.items[x][z] = new Item(this, "exp_boost", x, z)
                parent.addToUpdateList(this.items[x][z])
            }
        }
        // hp restore
        for (let i = 0; i < constants.HP_RESTORE_COUNT; i++) {
            const randomPos = this.getRandomEmptyPoint();
            if (randomPos) {
                const [x, z] = randomPos;
                this.items[x][z] = new Item(this, "hp_restore", x, z)
                parent.addToUpdateList(this.items[x][z])
            }
        }
        // buff
        for (let i = 0; i < constants.BUFF_COUNT; i++) {
            const randomPos = this.getRandomEmptyPoint();
            if (randomPos) {
                const [x, z] = randomPos;
                this.items[x][z] = new Item(this, "buff", x, z)
                parent.addToUpdateList(this.items[x][z])
            } 
        }
        // coins
        for (let i = 0; i < constants.BUFF_COUNT; i++) {
            const randomPos = this.getRandomEmptyPoint();
            if (randomPos) {
                const [x, z] = randomPos;
                this.items[x][z] = new Item(this, "coin", x, z)
                parent.addToUpdateList(this.items[x][z])
            } 
        }
        // freeze
        for (let i = 0; i < constants.BUFF_COUNT; i++) {
            const randomPos = this.getRandomEmptyPoint();
            if (randomPos) {
                const [x, z] = randomPos;
                this.items[x][z] = new Item(this, "freeze", x, z)
                parent.addToUpdateList(this.items[x][z])
            } 
        }
        // fill in the rest with exp orbs
        for (let i = 0; i < mazeArray.length; i++) {
            for (let j = 0; j < mazeArray[i].length; j++) {
                if (this.checkEmptyPosition(i, j)) {
                    this.items[i][j] = new Item(this, "exp_orb", i, j);
                }
            }
        }
    }

    // update scene when player moves to (x, 0, z)
    update(x, z) {
        // update items
        if (this.items[x][z]) {
            this.items[x][z].collectItem();
        }
    }

    // returns true if the position is in-bounds and has no wall
    checkValidPosition(x,z){
        let i = Math.floor(x/this.WALL_LEN);
        let j = Math.floor(z/this.WALL_LEN);
        if (i >= 0 && i < this.mazeHeight && j >= 0 && j < this.mazeWidth){
            if (this.allowedLocations[i][j]){
                return true;
            }
        }
        return false;
    }
    getExits(x, z, direction){
        let i = Math.round(x/this.WALL_LEN);
        let j = Math.round(z/this.WALL_LEN);
        let exits = [];
        const dirs = [[-1,0],[1,0],[0,1],[0,-1]];
        for (let item of dirs){
            let dx = item[0];
            let dz = item[1];
            let newX = dx + i;
            let newZ = dz + j;
            if (dx == direction[0] * -1 && dz == direction[1] * -1){
                // don't include the entering direction
                continue;
            }
            if (newX >= 0 && newX < this.mazeHeight && newZ >= 0 && newZ < this.mazeWidth){
                if (this.allowedLocations[newX][newZ]){
                    exits.push(item);
                }
            }
        }
        return exits;
    }

    // returns true if the position is in-bounds and has no wall or item
    checkEmptyPosition(x,z){
        let i = Math.floor(x/this.WALL_LEN);
        let j = Math.floor(z/this.WALL_LEN);
        if (i >= 0 && i < this.mazeHeight && j >= 0 && j < this.mazeWidth){
            if (this.allowedLocations[i][j] && this.items[i][j] == null){
                return true;
            }
        }
        return false;
    }

    // Coordinate system:
    // +
    // |998
    // |
    // X
    // |
    // |----Z----- +
    getAllowedPosition(pos, offset, dxdz){
        // world coordinate system
        let x = pos.x + offset.x; 
        let z = pos.z + offset.z;
        // integer coordinate system
        let i = Math.round(x/this.WALL_LEN);
        let j = Math.round(z/this.WALL_LEN);
        // console.log([box, newBox, offset])
        // integer coordinate system with offset
        let newX = dxdz[0] + i;
        let newZ = dxdz[1] + j;
        if (newX >= 0 && newX < this.mazeHeight && newZ >= 0 && newZ < this.mazeWidth){
            if (this.allowedLocations[newX][newZ]){
                return true;
            }
            // console.log(i, j)
            // console.log([this.allowedLocations[i+1][j-1], this.allowedLocations[i+1][j], this.allowedLocations[i+1][j+1]])
            // console.log([this.allowedLocations[i][j-1], this.allowedLocations[i][j], this.allowedLocations[i][j+1]])
            // console.log([this.allowedLocations[i-1][j-1], this.allowedLocations[i-1][j], this.allowedLocations[i-1][j+1]])
            
        }
        // Restrict coordinates
        let goToX = x/this.WALL_LEN;
        let goToZ = z/this.WALL_LEN;
        // check if the new position is still valid
        if (dxdz[0] == 1 && dxdz[1] == 0){ // up
            if (Math.ceil(goToX) == Math.ceil(pos.x/this.WALL_LEN)){
                return true;
            } else {
                pos.set(Math.ceil(pos.x), pos.y, pos.z);
            }
        } else if (dxdz[0] == -1 && dxdz[1] == 0){// down
            if (Math.floor(goToX) == Math.floor(pos.x/this.WALL_LEN)){
                return true;
            } else {
                pos.set(Math.floor(pos.x), pos.y, pos.z);
            }
        } else if (dxdz[0] == 0 && dxdz[1] == -1){// left
            if (Math.floor(goToZ) == Math.floor(pos.z/this.WALL_LEN)){
                return true;// ok
            } else {
                pos.set(pos.x, pos.y, Math.ceil(z));
            }
        } else if (dxdz[0] == 0 && dxdz[1] == 1){// right
            if (Math.ceil(goToZ) == Math.ceil(pos.z/this.WALL_LEN)){
                return true;
            } else {
                pos.set(pos.x, pos.y, Math.floor(z));
            }
        }
        // for (let dx of [-1,0,1]){
        //     for (let dy of [-1,0,1]){
        //         if (dx == 0 && dy == 0) continue;
        //         let newX = i + dx;
        //         let newZ = j + dy;
        //         if (newX >= 0 && newX < this.mazeHeight && newZ >= 0 && newZ < this.mazeWidth){
                    
        //             if (this.wallBoxes[newX][newZ] != null && 
        //                 this.wallBoxes[newX][newZ].intersectsBox(newBox)){
        //                     // console.log([this.wallBoxes[newX][newZ], newBox])
        //                 return false;
        //             }
        //         }
        //     }
        // }
        return false;
    }

    // returns a random allowed point in the maze
    getRandomAllowedPoint() {
        for(let i = 0; i < 10000; i++){
            // width and height are swapped cuz coordinate system
            let x = Math.floor(Math.random() * (this.mazeHeight - 2)) + 1;
            let z = Math.floor(Math.random() * (this.mazeWidth - 2)) + 1;
            if (this.allowedLocations[x][z]){
                return [x,z];
            }
        }
        return null;
    }
    // getBounds(){
    //     return [[0,this.allowedLocations.length],[0,this.allowedLocations[0].length]]
    // }

    // returns a random point in the maze that has no items
    getRandomEmptyPoint() {
        for(let i = 0; i < 10000; i++){
            // width and height are swapped cuz coordinate system
            let x = Math.floor(Math.random() * (this.mazeHeight - 2)) + 1;
            let z = Math.floor(Math.random() * (this.mazeWidth - 2)) + 1;
            if (this.allowedLocations[x][z] && this.items[x][z] == null) {
                return [x, z]
            }
        }
        return null;
    }
}

export default Maze;
