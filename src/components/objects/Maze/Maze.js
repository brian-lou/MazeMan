import {
    PlaneGeometry,
    Mesh,
    DoubleSide,
    BufferAttribute,
    BufferGeometry,
    BoxGeometry,
    MeshBasicMaterial,
    Group,
    Euler,
    Box3,
    Box3Helper,
} from 'three';
import Generator from './Generator';
import { FLOOR_COLOR, WALL_COLOR } from '../../../js/constants';

class Maze extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'maze';
        const EPS = 1e-2;
        const WALL_LEN = 1;
        this.WALL_LEN = WALL_LEN;
        const MAZE_LEN = 15; // Have to change pacmangen as well, hardcoded
        this.maze = new Generator(MAZE_LEN, MAZE_LEN);
        // console.log(maze.maze)
        this.maze.generate();
        const mazeArray = this.maze.maze;
        const wallGeo = new BoxGeometry(WALL_LEN, WALL_LEN, WALL_LEN);
        const wallMat = new MeshBasicMaterial({ color: WALL_COLOR });
        this.mazeHeight = mazeArray.length;
        this.mazeWidth = mazeArray[0].length;
        this.allowedLocations = Array(this.mazeHeight).fill().map(() => Array(this.mazeWidth).fill(true));
        this.wallBoxes = Array(this.mazeHeight).fill().map(() => Array(this.mazeWidth).fill(null));

        // add walls (and side walls)
        for (let i = 0; i < mazeArray.length; i++) {
            for (let j = 0; j < mazeArray[i].length; j++) {
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
                    let helper = new Box3Helper(box, 0x000000);
                    this.add(helper);
                }
                if (mazeArray[i][j] === 1) {
                    const wall = new Mesh(wallGeo, wallMat);
                    wall.position.set(i * WALL_LEN, 0, j * WALL_LEN);
                    this.add(wall);
                    this.allowedLocations[i][j] = false;
                    let box = new Box3().setFromObject(wall);
                    this.wallBoxes[i][j] = box;
                    let helper = new Box3Helper(box, 0x000000);
                    this.add(helper);
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
            color: FLOOR_COLOR,
            side: DoubleSide,
        });
        const floor = new Mesh(floorGeometry, floorMaterial);
        floor.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        floor.position.set(0.5*floorHeight, -0.5 * WALL_LEN - EPS, 0.5*floorWidth);
        this.add(floor);

        // const geometry = new BufferGeometry();

        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        // const vertices = new Float32Array( [
        //     -1.0, -1.0,  1.0, // v0
        //     1.0, -1.0,  1.0, // v1
        //     1.0,  1.0,  1.0, // v2

        //     1.0,  1.0,  1.0, // v3
        //     -1.0,  1.0,  1.0, // v4
        //     -1.0, -1.0,  1.0  // v5
        // ] );

        // itemSize = 3 because there are 3 values (components) per vertex
        // geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
        // const material = new MeshBasicMaterial( { color: 0xffffff } );
        // const mesh = new Mesh( geometry, material );
        // this.add(mesh);
        // parent.addToUpdateList(this);
    }
    getAllowedPosition(x, z, box){
        let i = Math.floor(x/this.WALL_LEN);
        let j = Math.floor(z/this.WALL_LEN);
        for (let dx of [-1,0,1]){
            for (let dy of [-1,0,1]){
                if (dx == 0 && dy == 0) continue;
                let newX = i + dx;
                let newZ = j + dy;
                if (newX >= 0 && newX < this.mazeHeight && newZ >= 0 && newZ < this.mazeWidth){
                    console.log([this.wallBoxes[newX][newZ], box])
                    if (this.wallBoxes[newX][newZ] != null && 
                        this.wallBoxes[newX][newZ].intersectsBox(box)){
                        return false;
                    }
                }
            }
        }
        return true;
    
    }
    // return a random valid x,y,z spawn point
    getSpawnPoint(){
        for(let i = 0;i<10000;i++){
            // width and height are swapped cuz coordinate system
            let x = Math.floor(Math.random() * this.mazeHeight);
            let z = Math.floor(Math.random() * this.mazeWidth);
            if (this.allowedLocations[x][z]){
                return [x,z];
            }
        }
        return null;
    }
}

export default Maze;
