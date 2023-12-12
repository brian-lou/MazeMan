import { genRandom, getTiles } from "./pacmangen";
class Generator{
    constructor(rows, cols){
        this.rows = rows;
        this.cols = cols;
        this.maze = Array(rows).fill().map(() => Array(cols).fill(0));
    }

    generate(){
        genRandom(this.rows, this.cols);
        this.maze = getTiles();
        // console.table(this.maze)
    }
    
}


export default Generator;