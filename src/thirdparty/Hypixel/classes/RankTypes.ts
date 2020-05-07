import {HypixelRank} from "./Rank";

export abstract class HypixelRankTypes {
    static readonly NON_DONOR: number = 1;
    static readonly VIP: number = 2;
    static readonly VIP_PLUS: number = 3;
    static readonly MVP: number = 4;
    static readonly MVP_PLUS: number = 5;
    static readonly SUPERSTAR: number = 6;
    static readonly ADMIN: number = 100;
    static readonly MODERATOR: number = 90;
    static readonly HELPER: number = 80;
    static readonly JR_HELPER: number = 70;
    static readonly YOUTUBER: number = 60;

    public static getDonorRanks() {
        return [
            this.NON_DONOR,
            this.VIP,
            this.VIP_PLUS,
            this.MVP,
            this.MVP_PLUS,
            this.SUPERSTAR
        ];
    }

    public static getStaffRanks() {
        return [
            this.ADMIN,
            this.MODERATOR,
            this.HELPER,
            this.JR_HELPER,
            this.YOUTUBER
        ];
    }

    public static fromName(db): HypixelRank | null {
        for (const id of this.values()) {
            let rank = this.fromId(id);
            if (rank != null) {
                if (rank.getName() == db) {
                    return rank;
                }
            }
        }
    }

    public static values() {
        return [
            this.NON_DONOR,
            this.VIP,
            this.VIP_PLUS,
            this.MVP,
            this.MVP_PLUS,
            this.SUPERSTAR,
            this.ADMIN,
            this.MODERATOR,
            this.HELPER,
            this.JR_HELPER,
            this.YOUTUBER
        ];
    }

    public static fromId(id: number): HypixelRank | null {
        let rank: HypixelRank = null;
        switch (id) {
            case this.NON_DONOR:
                rank = new HypixelRank(this.NON_DONOR, 'NON_DONOR', {
                    prefix: '§7',
                    color: '§7'
                });
                break;
            case this.VIP:
                rank = new HypixelRank(this.VIP, 'VIP', {
                    prefix: '§a[VIP]',
                    color: '§a',
                    eulaMultiplier: 2
                });
                break;
            case this.VIP_PLUS:
                rank = new HypixelRank(this.VIP_PLUS, 'VIP_PLUS', {
                    prefix: '§a[VIP§6+§a]',
                    color: '§a',
                    eulaMultiplier: 3
                });
                break;
            case this.MVP:
                rank = new HypixelRank(this.MVP, 'MVP', {
                    prefix: '§b[MVP]',
                    color: '§b',
                    eulaMultiplier: 4
                });
                break;
            case this.MVP_PLUS:
                rank = new HypixelRank(this.MVP_PLUS, 'MVP_PLUS', {
                    prefix: '§b[MVP§c+§b]',
                    color: '§b',
                    eulaMultiplier: 5
                });
                break;
            case this.SUPERSTAR:
                rank = new HypixelRank(this.SUPERSTAR, 'SUPERSTAR', {
                    prefix: '§6[MVP§c++§6]',
                    color: '§6'
                });
                break;
            case this.YOUTUBER:
                rank = new HypixelRank(this.YOUTUBER, 'YOUTUBER', {
                    prefix: '§c[§fYOUTUBE§c]',
                    color: '§c',
                    eulaMultiplier: 7
                });
                break;
            case this.JR_HELPER:
                rank = new HypixelRank(this.JR_HELPER, 'JR_HELPER', {
                    prefix: '§9[JR HELPER]',
                    color: '§9'
                });
                break;
            case this.HELPER:
                rank = new HypixelRank(this.HELPER, 'HELPER', {
                    prefix: '§9[HELPER]',
                    color: '§9[HELPER]'
                });
                break;
            case this.MODERATOR:
                rank = new HypixelRank(this.MODERATOR, 'MODERATOR', {
                    prefix: '§2[MOD]',
                    color: '§2'
                });
                break;
            case this.ADMIN:
                rank = new HypixelRank(this.ADMIN, 'ADMIN', {
                    prefix: '§c[ADMIN]',
                    color: '§c'
                });
                break;
        }
        return rank;
    }
}
