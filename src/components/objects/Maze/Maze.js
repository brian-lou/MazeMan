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
} from 'three';
import Generator from './Generator';

class Maze extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'maze';
        const EPS = 1e-2;
        const WALL_LEN = 1;
        const MAZE_LEN = 15; // Have to change pacmangen as well, hardcoded
        const maze = new Generator(MAZE_LEN, MAZE_LEN);
        // console.log(maze.maze)
        maze.generate(MAZE_LEN, MAZE_LEN);
        const mazeArray = maze.maze;
        const wallGeo = new BoxGeometry(WALL_LEN, WALL_LEN, WALL_LEN);
        const wallMat = new MeshBasicMaterial({ color: 0xfbe9d2 });

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
                }
                if (mazeArray[i][j] === 1) {
                    const wall = new Mesh(wallGeo, wallMat);
                    wall.position.set(i * WALL_LEN, 0, j * WALL_LEN);
                    this.add(wall);
                }
            }
        }

        // add floor
        const floorGeometry = new PlaneGeometry(
            MAZE_LEN * 2 + 1,
            MAZE_LEN * 2 + 1
        );
        const floorMaterial = new MeshBasicMaterial({
            color: 0xc8baa8,
            side: DoubleSide,
        });
        const floor = new Mesh(floorGeometry, floorMaterial);
        floor.rotation.set(Math.PI / 2, 0, Math.PI / 2);
        floor.position.set(MAZE_LEN, -0.5 * WALL_LEN - EPS, MAZE_LEN);
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
}

export default Maze;
