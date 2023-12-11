import { genRandom, getTiles } from "./pacmangen";
class Generator{
    constructor(rows, cols){
        this.maze = Array(rows).fill().map(() => Array(cols).fill(0));
    }

    generate(maze_rows, maze_cols){
        genRandom(maze_rows, maze_cols);
        this.maze = getTiles();
        // console.table(this.maze)
    }
    
}


export default Generator;