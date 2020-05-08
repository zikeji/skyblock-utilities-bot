export interface SkyblockProfileResponse {
    success: boolean;
    profile?: SkyblockProfile
}

export interface SkyblockProfile {
    profile_id: string;
    members: {
        [key: string]: SkyblockProfileMember;
    }
    banking?: SkyBlockProfileBanking;
}

export interface SkyblockProfileMember {
    last_save: Date;
    first_join: Date;
    first_join_hub: number;
    stats: {
        [key: string]: number
    }
    objectives: {
        [key: string]: {
            status: "COMPLETE" | "ACTIVE";
            progress: number;
            completed_at?: Date;
            (key: string): boolean;
        }
    }
    tutorial: string[];
    quests: {
        [key: string]: {
            status: "COMPLETE" | "ACTIVE";
            activated_at: Date;
            activated_at_sb: number;
            completed_at: Date;
            completed_at_sb: number;
        }
    }
    coin_purse: number;
    last_death: number;
    crafted_generators: string[];
    visited_zones: string[];
    fairy_souls_collected: number;
    fairy_souls: number;
    fairy_exchanged: number;
    fishing_treasure_caught: number;
    death_count: number;
    slayer_quest?: any; // track active slayer quest
    slayer_bosses: {
        [key: string]: {
            claimed_levels: {
                [key: string]: boolean
            }
            (key: string): number;
            xp: number;
        }
    };
    // Skills API
    experience_skill_runecrafting?: number;
    experience_skill_combat?: number;
    experience_skill_mining?: number;
    experience_skill_alchemy?: number;
    experience_skill_farming?: number;
    experience_skill_enchanting?: number;
    experience_skill_fishing?: number;
    experience_skill_foraging?: number;
    experience_skill_carpentry?: number;
    experience_skill_taming?: number;
    // Collections API
    unlocked_coll_tiers?: string[];
    collection?: SkyBlockProfileCollection;
    // Inventory API
    inv_armor: SkyBlockInventory;
    inv_contents: SkyBlockInventory;
    ender_chest_contents: SkyBlockInventory;
    candy_inventory_contents: SkyBlockInventory;
    talisman_bag: SkyBlockInventory;
    potion_bag: SkyBlockInventory;
    fishing_bag: SkyBlockInventory;
    quiver: SkyBlockInventory;
}

export interface SkyBlockProfileCollection {
    LOG?: number;
    COBBLESTONE?: number;
    ROTTEN_FLESH?: number;
    COAL?: number;
    CARROT_ITEM?: number;
    WHEAT?: number;
    SEEDS?: number;
    FEATHER?: number;
    RAW_CHICKEN?: number;
    LEATHER?: number;
    PORK?: number;
    POTATO_ITEM?: number;
    MELON?: number;
    PUMPKIN?: number;
    MUTTON?: number;
    RABBIT?: number;
    CACTUS?: number;
    MUSHROOM_COLLECTION?: number;
    REDSTONE?: number;
    STRING?: number;
    BONE?: number;
    'LOG:2'?: number;
    'LOG:1'?: number;
    'LOG:3'?: number;
    LOG_2?: number;
    ENDER_STONE?: number;
    'LOG_2:1'?: number;
    IRON_INGOT?: number;
    GOLD_INGOT?: number;
    'INK_SACK:4'?: number;
    EMERALD?: number;
    SLIME_BALL?: number;
    DIAMOND?: number;
    OBSIDIAN?: number;
    'INK_SACK:3'?: number;
    SUGAR_CANE?: number;
    SPIDER_EYE?: number;
    GLOWSTONE_DUST?: number;
    QUARTZ?: number;
    NETHER_STALK?: number;
    BLAZE_ROD?: number;
    MAGMA_CREAM?: number;
    SAND?: number;
    ICE?: number;
    GRAVEL?: number;
    ENDER_PEARL?: number;
    SULPHUR?: number;
    GHAST_TEAR?: number;
    CLAY_BALL?: number;
    INK_SACK?: number;
    WATER_LILY?: number;
    RAW_FISH?: number;
    'RAW_FISH:1'?: number;
    'RAW_FISH:3'?: number;
    'RAW_FISH:2'?: number;
    PRISMARINE_SHARD?: number;
    PRISMARINE_CRYSTALS?: number;
    NETHERRACK?: number;
    [any: string]: number;
}

export interface SkyBlockProfileBanking {
    balance: number;
    transactions: {
        amount: number;
        timestamp: number;
        action: "DEPOSIT" | "WITHDRAW";
        initiator_name: string;
    }[]
}

export interface SkyBlockInventory {
    type: number;
    data: string;
}
