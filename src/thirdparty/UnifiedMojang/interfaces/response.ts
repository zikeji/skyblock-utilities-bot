export interface UnifiedMojangResponse {
    uuid: string;
    username: string;
    username_history: {
        username: string,
        changed_at?: Date
    }[];
    textures: {
        slim: boolean;
        custom: boolean;
        skin: {
            url: string;
            data: string;
        };
        cape: {
            url?: string;
            data: string;
        };
        raw: {
            value: string;
            signature: string;
        };
    };
    created_at?: Date;
}
