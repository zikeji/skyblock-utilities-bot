import {json} from 'web-request';
import {cache} from "../../cache";
import {UnifiedMojangResponse} from "./interfaces/response";
import {UnifiedMojangError} from "./interfaces/error";

export class UnifiedMojang {
    public static async user(query: string): Promise<UnifiedMojangResponse> {
        const result: UnifiedMojangResponse | UnifiedMojangError = await cache.wrap(`umojang:${query.toLowerCase()}`, () => {
            return json<UnifiedMojangResponse | UnifiedMojangError>(`https://api.ashcon.app/mojang/v2/user/${query}`);
        }, {ttl: 60});
        if (result.hasOwnProperty('error')) {
            const error: UnifiedMojangError = <UnifiedMojangError>result;
            throw new Error(`${error.code}: ${error.error} (${error.reason})`);
        }
        const user = <UnifiedMojangResponse>result;
        user.uuid = user.uuid.replace(/[\-]+/g, '');
        return user;
    }

    public static async uuidToUsernameCached(uuid: string): Promise<string> {
        const username = await cache.get<string>(`umojang:utuc:${uuid.toLowerCase()}`);
        if (!username) {
            const result = await UnifiedMojang.user(uuid);
            if (result.username) {
                await cache.set<string>(`umojang:utuc:${uuid.toLowerCase()}`, result.username, 60 * 60);
                return result.username;
            }
            throw new Error(`No username for ${result.uuid}!`)
        }
        return username;
    }
}
