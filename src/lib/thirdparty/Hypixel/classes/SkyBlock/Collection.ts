import {SkyBlockProfileCollection} from "../../interfaces/SkyBlock/profile";

export class Collection {
    public static COBBLESTONE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('COBBLESTONE', unlockedCollectionTiers, collectionCounts);
    public static COAL = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('COAL', unlockedCollectionTiers, collectionCounts);
    public static IRON = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('IRON_INGOT', unlockedCollectionTiers, collectionCounts);
    public static GOLD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('GOLD_INGOT', unlockedCollectionTiers, collectionCounts);
    public static DIAMOND = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('DIAMOND', unlockedCollectionTiers, collectionCounts);
    public static LAPIS_LAZULI = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('INK_SACK:4', unlockedCollectionTiers, collectionCounts);
    public static EMERALD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('EMERALD', unlockedCollectionTiers, collectionCounts);
    public static REDSTONE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('REDSTONE', unlockedCollectionTiers, collectionCounts);
    public static NETHER_QUARTZ = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('QUARTZ', unlockedCollectionTiers, collectionCounts);
    public static OBSIDIAN = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('OBSIDIAN', unlockedCollectionTiers, collectionCounts);
    public static GLOWSTONE_DUST = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('GLOWSTONE_DUST', unlockedCollectionTiers, collectionCounts);
    public static GRAVEL = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('GRAVEL', unlockedCollectionTiers, collectionCounts);
    public static ICE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('ICE', unlockedCollectionTiers, collectionCounts);
    public static NETHERRACK = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('NETHERRACK', unlockedCollectionTiers, collectionCounts);
    public static SAND = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('SAND', unlockedCollectionTiers, collectionCounts);
    public static END_STONE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('ENDER_STONE', unlockedCollectionTiers, collectionCounts);
    public static ROTTEN_FLESH = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('ROTTEN_FLESH', unlockedCollectionTiers, collectionCounts);
    public static BONE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('BONE', unlockedCollectionTiers, collectionCounts);
    public static STRING = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('STRING', unlockedCollectionTiers, collectionCounts);
    public static SPIDER_EYE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('SPIDER_EYE', unlockedCollectionTiers, collectionCounts);
    public static GUNPOWDER = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('SULPHUR', unlockedCollectionTiers, collectionCounts);
    public static ENDER_PEARL = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('ENDER_PEARL', unlockedCollectionTiers, collectionCounts);
    public static GHAST_TEAR = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('GHAST_TEAR', unlockedCollectionTiers, collectionCounts);
    public static SLIMEBALL = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('SLIME_BALL', unlockedCollectionTiers, collectionCounts);
    public static BLAZE_ROD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('BLAZE_ROD', unlockedCollectionTiers, collectionCounts);
    public static MAGMA_CREAM = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('MAGMA_CREAM', unlockedCollectionTiers, collectionCounts);
    public static OAK_WOOD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('LOG', unlockedCollectionTiers, collectionCounts);
    public static DARK_OAK_WOOD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('LOG_2:1', unlockedCollectionTiers, collectionCounts);
    public static ACACIA_WOOD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('LOG_2', unlockedCollectionTiers, collectionCounts);
    public static SPRUCE_WOOD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('LOG:1', unlockedCollectionTiers, collectionCounts);
    public static BIRCH_WOOD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('LOG:2', unlockedCollectionTiers, collectionCounts);
    public static JUNGLE_WOOD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('LOG:3', unlockedCollectionTiers, collectionCounts);
    public static RAW_FISH = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('RAW_FISH', unlockedCollectionTiers, collectionCounts);
    public static RAW_SALMON = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('RAW_FISH:1', unlockedCollectionTiers, collectionCounts);
    public static CLOWNFISH = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('RAW_FISH:2', unlockedCollectionTiers, collectionCounts);
    public static PUFFERFISH = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('RAW_FISH:3', unlockedCollectionTiers, collectionCounts);
    public static PRISMARINE_SHARD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('PRISMARINE_SHARD', unlockedCollectionTiers, collectionCounts);
    public static PRISMARINE_CRYSTALS = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('PRISMARINE_CRYSTALS', unlockedCollectionTiers, collectionCounts);
    public static CLAY = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('CLAY_BALL', unlockedCollectionTiers, collectionCounts);
    public static LILY_PAD = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('WATER_LILY', unlockedCollectionTiers, collectionCounts);
    public static INK_SACK = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('INK_SACK', unlockedCollectionTiers, collectionCounts);
    public static SPONGE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('SPONGE', unlockedCollectionTiers, collectionCounts);
    public static WHEAT = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('WHEAT', unlockedCollectionTiers, collectionCounts);
    public static CARROT = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('CARROT_ITEM', unlockedCollectionTiers, collectionCounts);
    public static POTATO = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('POTATO_ITEM', unlockedCollectionTiers, collectionCounts);
    public static PUMPKIN = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('PUMPKIN', unlockedCollectionTiers, collectionCounts);
    public static MELON = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('MELON', unlockedCollectionTiers, collectionCounts);
    public static SEEDS = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('SEEDS', unlockedCollectionTiers, collectionCounts);
    public static MUSHROOM = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('MUSHROOM_COLLECTION', unlockedCollectionTiers, collectionCounts);
    public static COCOA_BEANS = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('INK_SACK:3', unlockedCollectionTiers, collectionCounts);
    public static CACTUS = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('CACTUS', unlockedCollectionTiers, collectionCounts);
    public static SUGAR_CANE = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('SUGAR_CANE', unlockedCollectionTiers, collectionCounts);
    public static FEATHER = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('FEATHER', unlockedCollectionTiers, collectionCounts);
    public static LEATHER = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('LEATHER', unlockedCollectionTiers, collectionCounts);
    public static RAW_PORKCHOP = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('PORK', unlockedCollectionTiers, collectionCounts);
    public static RAW_CHICKEN = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('RAW_CHICKEN', unlockedCollectionTiers, collectionCounts);
    public static MUTTON = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('MUTTON', unlockedCollectionTiers, collectionCounts);
    public static RAW_RABBIT = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('RABBIT', unlockedCollectionTiers, collectionCounts);
    public static NETHER_WART = (unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) => new Collection('NETHER_STALK', unlockedCollectionTiers, collectionCounts);

    private readonly _name;
    private readonly unlockedCollectionTiers: string[];
    private readonly collectionCounts: SkyBlockProfileCollection;

    constructor(name: string, unlockedCollectionTiers: string[], collectionCounts: SkyBlockProfileCollection) {
        this._name = name;
        this.unlockedCollectionTiers = unlockedCollectionTiers;
        this.collectionCounts = collectionCounts;
    }

    get name(): string {
        return this._name;
    }

    public tier(tier: number): string {
        return `${this.name}_${tier}`
    }

    public checkTier(collectionTier: number, collectionAmt?: number): boolean {
        for (let tier = collectionTier; tier < 14; ++tier) {
            if (this.unlockedCollectionTiers.includes(this.tier(tier))) {
                return true;
            }
        }
        if (collectionAmt && this.collectionCounts && this.collectionCounts[this.name]) {
            return this.collectionCounts[this.name] >= collectionAmt;
        }
        return false;
    }
}
