import {extend} from "lodash";
import {HypixelRankTypes} from "./RankTypes";
import {HypixelRank} from "./Rank";
import {Leveling} from "../../../util/Hypixel/Leveling";
import {BedWarsLeveling} from "../../../util/Hypixel/BedWarsLeveling";

/**
 * Class is not filled out completely. Irrelevant stuff is ignored.
 */
export class HypixelPlayer {
    public _id: string;
    public uuid: string;
    public firstLogin: Date;
    public lastLogin: Date;
    public lastLogout: Date;
    public playername: string;
    public displayname: string;
    public knownAliases: string[];
    public knownAliasesLower: string[];
    public mostRecentGameType: string;
    public achievementsOneTime: string[];
    public achievements: {
        [key: string]: number
    };
    public stats: {
        Bedwars?: {
            Experience?: number;
        };
        SkyBlock?: {
            profiles: {
                [key: string]: {
                    profile_id: string;
                    cute_name: string;
                }
            }
        };
        Pit?: {
            profile?: {
                prestiges?: {
                    index: number;
                    xp_on_prestige: number;
                    timestamp: Date;
                }[];
            };
        };
    };
    public networkExp: number;
    public vanityTokens: number;
    public karma: number;
    public friendRequestsUuid: any;
    public channel: string;

    public rank?: string;
    public packageRank?: string;
    public newPackageRank?: string;
    public rankPlusColor?: string;
    public monthlyPackageRank?: string;

    public socialMedia?: {
        links: {
            DISCORD?: string;
        }
        prompt: boolean;
    };

    constructor(data: Object) {
        extend<HypixelPlayer, Object>(this, data);
    }

    getRank(includePackage: boolean = true): HypixelRank {
        let returnRank: HypixelRank = null;
        if (includePackage) {
            for (const key of ['monthlyPackageRank', 'newPackageRank', 'packageRank']) {
                let rank = HypixelRankTypes.fromName(this[key]);
                if (rank) {
                    if (!returnRank || rank.getId() > returnRank.getId()) {
                        returnRank = rank;
                    }
                }
            }
        } else {
            if (!this.isStaff()) return this.getRank(true);
            returnRank = HypixelRankTypes.fromName(this.rank);
        }
        if (returnRank === null) {
            returnRank = HypixelRankTypes.fromId(HypixelRankTypes.NON_DONOR);
        }
        return  returnRank;
    }

    public isStaff() {
        let rank: string = this.rank ? this.rank : 'NORMAL';
        return rank !== 'NORMAL';
    }

    public getSocialMedia(key: string): string | null {
        return this.socialMedia && this.socialMedia.links && this.socialMedia.links[key] ? this.socialMedia.links[key] : null;
    }

    public getLevel(): number {
        return Leveling.getLevel(this.networkExp);
    }

    public getExactLevel(): number {
        return Leveling.getExactLevel(this.networkExp);
    }

    public getBedwarsLevel(): number {
        if (this.stats && this.stats.Bedwars && this.stats.Bedwars.Experience) {
            return BedWarsLeveling.getLevelForExp(this.stats.Bedwars.Experience)
        }
        return 1;
    }
}
