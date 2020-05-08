import {json, RequestOptions} from 'web-request';

export interface BaseApiResponse {
    success: boolean,
    cause?: string
}

export class HypixelApiWrapper {
    private readonly key: string;
    private readonly endpoint: string;

    public constructor(key: string) {
        this.key = key;
        this.endpoint = 'https://api.hypixel.net';
    }

    protected async query<BaseApiResponse>(method: string, options?: RequestOptions): Promise<BaseApiResponse> {
        if (!options) {
            options = {};
        }
        if (!options.qs) {
            options.qs = {};
        }
        if (!options.qs.key) {
            options.qs.key = this.key;
        }
        const result = await json<any>(`${this.endpoint}/${method}`, options);
        if (!result.success) {
            throw new Error(result.cause);
        }
        return result;
    }
}

export const HypixelApi = new HypixelApiWrapper(process.env.HYPIXEL_KEY);

