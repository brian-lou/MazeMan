import MazeScene from "./MazeScene";
import { EliteEnemiesByLvl, EnemyAtkByLvl, EnemyDefByLvl, EnemyHpByLvl, EnemySpdByLvl, NormalEnemiesByLvl, Stats } from '../../js/stats';
import { WALL_TEXTURES } from "../../js/constants";


class Level extends MazeScene {
    constructor(keypress, camera) {
        let enemies = [];
        let maxAtk = 0;
        let minAtk = 100000;

        let selection = WALL_TEXTURES[Math.floor(Math.random() * WALL_TEXTURES.length)];
        const generalInfo = {
            maxAtk: maxAtk,
            minAtk: minAtk,
            wallTexture: selection[1],
            floorColor: selection[0],
        };
        if (false){ // DEVELOPER TEST MODE
            enemies.push({
                model: "ghost",
                hp: 5,
                upperBoundHp: 10,
                def: 0,
                atk: 0,
                speedMult: 1,
                scale: 2
            });
            // Call parent MazeScene() constructor
            super(keypress, camera, enemies, generalInfo);
            return
        }
        // Normal enemies
        for (let i = 0; i<NormalEnemiesByLvl[Stats.level]; i++){
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
            maxAtk = Math.max(maxAtk, atk);
            minAtk = Math.min(minAtk, atk);
            enemies.push({
                model: "ghost",
                hp: hp,
                upperBoundHp: upperBoundHp,
                def: def,
                atk: atk,
                speedMult: speedMult,
                scale: 1
            });
        }
        // elite / boss enemies
        for (let i = 0; i<EliteEnemiesByLvl[Stats.level]; i++){
            // Hp between 2*upperBoundHp and 3*upperBoundHp
            const upperBoundHp = EnemyHpByLvl[Stats.level];
            let hp = upperBoundHp * 2 + (Math.round(upperBoundHp * Math.random()));
            // def between upperBoundDef/2 and upperBoundDef
            const upperBoundDef = EnemyDefByLvl[Stats.level];
            let def = Math.floor(upperBoundDef/2) + Math.round(upperBoundDef * Math.random() / 2);
            // atk between upperBoundAtk and 2*upperBoundAtk
            const upperBoundAtk = EnemyAtkByLvl[Stats.level];
            let atk = upperBoundAtk + Math.round(upperBoundAtk * Math.random());
            // speed is randomized between 1.25x and 1.75x
            let speedMult = (Math.random() / 2) + 1.25;
            maxAtk = Math.max(maxAtk, atk);
            minAtk = Math.min(minAtk, atk);
            enemies.push({
                model: "ghost",
                hp: hp,
                upperBoundHp: upperBoundHp,
                def: def,
                atk: atk,
                speedMult: speedMult,
                scale: 1.5
            });
        }
        generalInfo.maxAtk = maxAtk;
        generalInfo.minAtk = minAtk;
        // console.log(generalInfo)

        // Call parent MazeScene() constructor
        super(keypress, camera, enemies, generalInfo);
    }
    
    update(playerX, playerZ, deltaT) {
        super.update(playerX, playerZ, deltaT);
    }

}

export default Level;