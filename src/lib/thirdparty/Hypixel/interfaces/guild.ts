export interface HypixelGuildResponse {
    success: boolean;
    guild: HypixelGuild;
}

export interface HypixelGuild {
    _id: string;
    name: string;
    name_lower: string;
    coins: number;
    coinsEver: number;
    created: Date;
    members: HypixelGuildMember[];
    ranks: HypixelGuildRank[];
    achievements: {
        [key: string]: number;
    };
    exp: number;
    tag: string;
    tagColor: string;
    description: string;
    preferredGames: string[];
    guildExpByGameType: {
        [key: string]: number
    };
}

export interface HypixelGuildMember {
    uuid: string;
    rank: string;
    joined: Date;
    questParticipation: number;
    expHistory: {
        [key: string]: number;
    }
}

export interface HypixelGuildRank {
    name: string;
    default: boolean;
    tag: string;
    created: Date;
    priority: number;
}
