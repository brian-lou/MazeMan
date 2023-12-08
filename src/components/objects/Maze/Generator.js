import { genRandom, getTiles } from "./pacmangen";
class Generator{
    constructor(rows, cols){
        this.maze = Array(rows).fill().map(() => Array(cols).fill(0));
    }

    generate(){
        genRandom();
        this.maze = getTiles();
    }
    
}


export default Generator;