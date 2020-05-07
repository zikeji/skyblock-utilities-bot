export class Leveling {
    public static readonly BASE: number = 10000;
    public static readonly GROWTH: number = 2500;

    public static readonly HALF_GROWTH: number = 0.5 * Leveling.GROWTH;

    public static readonly REVERSE_PQ_PREFIX = -(Leveling.BASE - 0.5 * Leveling.GROWTH) / Leveling.GROWTH;
    public static readonly REVERSE_CONST = Leveling.REVERSE_PQ_PREFIX * Leveling.REVERSE_PQ_PREFIX;
    public static readonly GROWTH_DIVIDES_2 = 2 / Leveling.GROWTH;

    public static getExactLevel(exp: number) {
        return Leveling.getLevel(exp) + Leveling.getPercentageToNextLevel(exp);
    }

    public static getLevel(exp: number): number {
        return exp < 0 ? 1 : Math.floor(1 + Leveling.REVERSE_PQ_PREFIX + Math.sqrt(Leveling.REVERSE_CONST + Leveling.GROWTH_DIVIDES_2 * exp));
    }

    public static getPercentageToNextLevel(exp: number) {
        const lv = Leveling.getLevel(exp);
        const x0 = Leveling.getTotalExpToLevel(lv);
        return (exp - x0) / (Leveling.getTotalExpToLevel(lv + 1) - x0);
    }

    public static getTotalExpToLevel(level: number) {
        const lv = Math.floor(level);
        const x0 = Leveling.getTotalExpToFullLevel(lv);
        if (level === lv) return x0;
        return (Leveling.getTotalExpToFullLevel(lv + 1) - x0) * (level % 1) + x0;
    }

    public static getTotalExpToFullLevel(level: number) {
        return (Leveling.HALF_GROWTH * (level - 2) + Leveling.BASE) * (level - 1);
    }

    public static getExpFromLevelToNext(level: number) {
        return level < 1 ? Leveling.BASE : Leveling.GROWTH * (level - 1) + Leveling.BASE;
    }
}
