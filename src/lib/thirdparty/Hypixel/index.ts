import {SkyBlock} from "./methods/SkyBlock";
import {Player} from "./methods/player";
import {Guild} from "./methods/guild";
import {Friends} from "./methods/friends";
import {Key} from "./methods/key";

export interface BaseApiResponse {
    success: boolean,
    cause?: string
}

export class HypixelApiObject {
    public readonly SkyBlock: SkyBlock;
    public readonly Player: Player;
    public readonly Friends: Friends;
    public readonly Guild: Guild;
    public readonly Key: Key;

    public constructor(key: string) {
        this.SkyBlock = new SkyBlock(key);
        this.Player = new Player(key);
        this.Friends = new Friends(key);
        this.Guild = new Guild(key);
        this.Key = new Key(key);
    }
}

export const HypixelApi = new HypixelApiObject(process.env.HYPIXEL_KEY);

