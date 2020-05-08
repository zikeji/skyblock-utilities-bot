import {HypixelApiWrapper} from "../../util/wrapper";
import {cache} from "../../../../../cache";
import {AuctionResponse} from "../../interfaces/SkyBlock/auction";

export class Auction extends HypixelApiWrapper {
    constructor(key: string) {
        super(key);
    }

    public async getByUuid(uuid: string, cached?: boolean): Promise<AuctionResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:skyblock:auction:${uuid.toLowerCase()}`, () => {
                return this._getByUuid(uuid);
            }, {ttl: 60});
        } else {
            return this._getByUuid(uuid);
        }
    }

    private async _getByUuid(uuid: string): Promise<AuctionResponse> {
        const data = await this.query<AuctionResponse>('skyblock/auction', {qs: {player: uuid}});
        data.fetched = new Date();
        return data;
    }
}
