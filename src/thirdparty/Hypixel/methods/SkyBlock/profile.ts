import {HypixelApiWrapper} from "../../util/wrapper";
import {cache} from "../../../../cache";
import {SkyblockProfileResponse} from "../../interfaces/SkyBlock/profile";

export class Profile extends HypixelApiWrapper {
    constructor(key: string) {
        super(key);
    }

    public async getByProfileId(profileId: string, cached?: boolean): Promise<SkyblockProfileResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:skyblock:profile:${profileId.toLowerCase()}`, () => {
                return this._getByProfileId(profileId);
            }, {ttl: 60});
        } else {
            return this._getByProfileId(profileId);
        }
    }

    private async _getByProfileId(profileId: string): Promise<SkyblockProfileResponse> {
        return await this.query<SkyblockProfileResponse>('skyblock/profile', {qs: {profile: profileId}});
    }
}
