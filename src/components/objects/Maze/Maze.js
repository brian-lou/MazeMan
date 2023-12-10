import { PlaneGeometry, Mesh, DoubleSide, BufferAttribute, BufferGeometry, BoxGeometry, MeshBasicMaterial, Group } from 'three';
import Generator from './Generator';

class Maze extends Group {
    constructor() {
        // Call parent Group() constructor
        super();
        this.name = 'maze';
        const maze = new Generator(100,100);
        // console.log(maze.maze)
        maze.generate();
        const mazeArray = maze.maze;
        const wallLength = 1;
        const wallGeo= new BoxGeometry(wallLength, wallLength, wallLength);
        const wallMat = new MeshBasicMaterial({ color: 0x0000FF});
        
        for (let i = 0; i < mazeArray.length; i++) {
            for (let j = 0; j < mazeArray[i].length; j++) {
                if (mazeArray[i][j] === 1) {
                    const wall = new Mesh(wallGeo, wallMat);
                    wall.position.set(i * wallLength, 0, j * wallLength);
                    this.add(wall);
                }
            }
        }
        // console.log(maze.maze)
        // const geometry = new PlaneGeometry( 1, 1 );
        // const material = new MeshBasicMaterial( {color: 0xffff00, side: DoubleSide} );
        // const plane = new Mesh( geometry, material );
        // this.add( plane );

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







