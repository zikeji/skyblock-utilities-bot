import {HypixelApiWrapper} from "../util/wrapper";
import {cache} from "../../../../cache";
import {HypixelPlayer} from "../classes/Player";

export class Player extends HypixelApiWrapper {
    constructor(key: string) {
        super(key);
    }

    public async getByUuid(uuid: string, cached?: boolean): Promise<HypixelPlayer> {
        if (!cached) {
            cached = true;
        }
        let data;
        if (cached) {
            data = await cache.wrap(`hypixel:player:${uuid.toLowerCase()}`, () => {
                return this._getByUuid(uuid);
            }, {ttl: 60});
        } else {
            data = this._getByUuid(uuid);
        }
        if (data.player) {
            return new HypixelPlayer(data.player);
        } else {
            throw new NoPlayerDataError("No player data.");
        }
    }

    private async _getByUuid(uuid: string): Promise<any> {
        const data = await this.query<any>('player', {qs: {uuid}});
        if (!data.success) {
            throw new Error("Not successful.");
        }
        if (!data.player) {
            throw new NoPlayerDataError("No player data.");
        }
        return data;
    }
}

export class NoPlayerDataError extends Error {
}
