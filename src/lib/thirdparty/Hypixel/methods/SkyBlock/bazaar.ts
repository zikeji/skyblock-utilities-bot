import {HypixelApiWrapper} from "../../util/wrapper";
import {cache} from "../../../../../cache";
import {ProductResponse} from "../../interfaces/SkyBlock/bazaar";

export class Bazaar extends HypixelApiWrapper {
    constructor(key: string) {
        super(key);
    }

    public async getByProductId(productId: string, cached?: boolean): Promise<ProductResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:skyblock:bazarr:${productId}`, () => {
                return this._getByProductId(productId);
            }, {ttl: 15});
        } else {
            return this._getByProductId(productId);
        }
    }

    private async _getByProductId(productId: string): Promise<ProductResponse> {
        return await this.query<ProductResponse>('skyblock/bazaar/product', {qs: {productId: productId}});
    }
}
