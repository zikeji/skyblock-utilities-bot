import {HypixelApiWrapper} from "../util/wrapper";
import {cache} from "../../../cache";
import {HypixelKeyResponse} from "../interfaces/key";

export class Key extends HypixelApiWrapper {
    constructor(key: string) {
        super(key);
    }

    public async get(key: string, cached?: boolean): Promise<HypixelKeyResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:keys:${key.toLowerCase()}`, () => {
                return this._get(key);
            }, {ttl: 30});
        } else {
            return this._get(key);
        }
    }

    private async _get(key: string): Promise<HypixelKeyResponse> {
        return await this.query<HypixelKeyResponse>('key', {qs: {key: key}});
    }
}
