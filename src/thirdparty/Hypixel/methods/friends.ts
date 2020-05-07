import {HypixelApiWrapper} from "../util/wrapper";
import {cache} from "../../../cache";
import {HypixelFriendsResponse} from "../interfaces/friends";

export class Friends extends HypixelApiWrapper {
    constructor(key: string) {
        super(key);
    }

    public async getByUuid(uuid: string, cached?: boolean): Promise<HypixelFriendsResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:friends:${uuid.toLowerCase()}`, () => {
                return this._getByUuid(uuid);
            }, {ttl: 60 * 5});
        } else {
            return this._getByUuid(uuid);
        }
    }

    private async _getByUuid(uuid: string): Promise<HypixelFriendsResponse> {
        return await this.query<HypixelFriendsResponse>('friends', {qs: {uuid: uuid}});
    }
}
