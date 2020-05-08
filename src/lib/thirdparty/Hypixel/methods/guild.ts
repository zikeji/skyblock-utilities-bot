import {HypixelApiWrapper} from "../util/wrapper";
import {cache} from "../../../../cache";
import {HypixelGuildResponse} from "../interfaces/guild";

export class Guild extends HypixelApiWrapper {
    constructor(key: string) {
        super(key);
    }

    public async getByUuid(uuid: string, cached?: boolean): Promise<HypixelGuildResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:guild:${uuid.toLowerCase()}`, () => {
                return this._getByUuid(uuid);
            }, {ttl: 60 * 5});
        } else {
            return this._getByUuid(uuid);
        }
    }

    private async _getByUuid(uuid: string): Promise<HypixelGuildResponse> {
        return await this.query<HypixelGuildResponse>('guild', {qs: {id: uuid}});
    }

    public async getByPlayerUuid(uuid: string, cached?: boolean): Promise<HypixelGuildResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:guild:player:${uuid.toLowerCase()}`, () => {
                return this._getByPlayerUuid(uuid);
            }, {ttl: 60 * 5});
        } else {
            return this._getByPlayerUuid(uuid);
        }
    }

    private async _getByPlayerUuid(uuid: string): Promise<HypixelGuildResponse> {
        return await this.query<HypixelGuildResponse>('guild', {qs: {player: uuid}});
    }

    public async getByGuildName(name: string, cached?: boolean): Promise<HypixelGuildResponse> {
        if (!cached) {
            cached = true;
        }
        if (cached) {
            return await cache.wrap(`hypixel:guild:name:${name.toLowerCase()}`, () => {
                return this._getByGuildName(name);
            }, {ttl: 60 * 5});
        } else {
            return this._getByGuildName(name);
        }
    }

    private async _getByGuildName(name: string): Promise<HypixelGuildResponse> {
        return await this.query<HypixelGuildResponse>('guild', {qs: {name: name}});
    }
}
