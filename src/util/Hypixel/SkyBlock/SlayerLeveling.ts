export interface SlayerLevelInfo {
    xp: number;
    level: number;
    maxLevel?: number;
    xpCurrent: number;
    xpForNext: number;
    progress: number;
    levelProgress: number;
}

export class SlayerLeveling {
    public static getLevelByXp(xp: number): SlayerLevelInfo {
        let xp_table = this.leveling_xp;

        if(isNaN(xp)){
            return {
                xp: 0,
                level: 0,
                xpCurrent: 0,
                xpForNext: xp_table[1],
                progress: 0,
                levelProgress: 0
            };
        }

        let xpTotal = 0;
        let level = 0;

        let xpForNext = Infinity;

        let maxLevel = Object.keys(xp_table).sort((a, b) => Number(a) - Number(b)).map(a => Number(a)).pop();

        for(let x = 1; x <= maxLevel; x++){
            xpTotal = xp_table[x];

            if(xpTotal > xp){
                // xpTotal -= xp_table[x];
                break;
            }else{
                level = x;
            }
        }

        let xpCurrent = Math.floor(xp - xpTotal);

        if(level < maxLevel)
            xpForNext = Math.ceil(xp_table[level + 1]);

        let progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));

        return {
            xp,
            level,
            maxLevel,
            xpCurrent,
            xpForNext,
            progress,
            levelProgress: level + progress
        };
    }

    public static readonly leveling_xp = {
        1: 5,
        2: 15,
        3: 200,
        4: 1000,
        5: 5000,
        6: 20000,
        7: 100000,
        8: 400000,
        9: 1000000
    };
}
