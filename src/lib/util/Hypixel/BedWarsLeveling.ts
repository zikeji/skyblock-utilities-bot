
export abstract class BedWarsLeveling {
    private static EASY_LEVELS: number = 4;
    private static EASY_LEVELS_XP: number = 7000;
    private static XP_PER_PRESTIGE: number = 96 * 5000 + BedWarsLeveling.EASY_LEVELS_XP;
    private static LEVELS_PER_PRESTIGE: number = 100;
    private static HIGHEST_PRESTIGE: number = 10;

    public static getExpForLevel(level) {
        if (level == 0) return 0;

        const respectedLevel = BedWarsLeveling.getLevelRespectingPrestige(level);
        if (respectedLevel > BedWarsLeveling.EASY_LEVELS) {
            return 5000;
        }

        switch (respectedLevel) {
            case 1:
                return 500;
            case 2:
                return 1000;
            case 3:
                return 2000;
            case 4:
                return 3500;
        }
        return 5000;
    }

    public static getLevelRespectingPrestige(level) {
        if (level > BedWarsLeveling.HIGHEST_PRESTIGE * BedWarsLeveling.LEVELS_PER_PRESTIGE) {
            return level - BedWarsLeveling.HIGHEST_PRESTIGE * BedWarsLeveling.LEVELS_PER_PRESTIGE;
        } else {
            return level % BedWarsLeveling.LEVELS_PER_PRESTIGE;
        }
    }

    public static getLevelForExp(exp) {
        const prestiges = Math.floor(exp / BedWarsLeveling.XP_PER_PRESTIGE);
        let level = prestiges * BedWarsLeveling.LEVELS_PER_PRESTIGE;
        let expWithoutPrestiges = exp - (prestiges * BedWarsLeveling.XP_PER_PRESTIGE);

        for (let i = 1; i <= BedWarsLeveling.EASY_LEVELS; ++i) {
            const expForEasyLevel = BedWarsLeveling.getExpForLevel(i);
            if (expWithoutPrestiges < expForEasyLevel) {
                break;
            }
            level++;
            expWithoutPrestiges -= expForEasyLevel;
        }
        return level + Math.floor(expWithoutPrestiges / 5000);
    }
}
