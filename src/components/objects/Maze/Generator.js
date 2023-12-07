class Generator{
    constructor(rows, cols){
        this.maze = Array(rows).fill().map(() => Array(cols).fill(0));
    }
    generate(){
        for (let i = 0; i< this.maze.length; i++){
            for (let j = 0 ;j<this.maze[0].length; j++){
                this.maze[i][j] = 1;
            }
        }
    }
}
export default Generator;