import MazeScene from "./MazeScene";
import { EnemyAtkByLvl, EnemyDefByLvl, EnemyHpByLvl, EnemySpdByLvl, Stats } from '../../js/stats';


class Level extends MazeScene {
    constructor(keypress, camera) {
        let enemies = [];
        for (let i = 0; i<20; i++){
            
            // Hp between upperBoundHp/2 and upperBoundHp
            const upperBoundHp = EnemyHpByLvl[Stats.level];
            let hp = Math.floor(upperBoundHp/2) + Math.round(upperBoundHp * Math.random() / 2);
            // def between upperBoundDef/2 and upperBoundDef
            const upperBoundDef = EnemyDefByLvl[Stats.level];
            let def = Math.floor(upperBoundDef/2) + Math.round(upperBoundDef * Math.random() / 2);
            // atk between 0.75*upperBoundAtk and upperBoundAtk
            const upperBoundAtk = EnemyAtkByLvl[Stats.level];
            let atk = Math.floor(3*upperBoundAtk/4) + Math.round(upperBoundAtk * Math.random() / 4);
            // speed is randomized between 0.75x and 1.25x
            let speedMult = (Math.random() / 2) + 0.75;

            enemies.push({
                model: "ghost",
                hp: hp,
                upperBoundHp: upperBoundHp,
                def: def,
                atk: atk,
                speedMult: speedMult
            });
        }
        // Call parent MazeScene() constructor
        super(keypress, camera, enemies);
    }
}

export default Level;