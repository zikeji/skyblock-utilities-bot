declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: string;
        DB_HOST: string;
        DB_PORT: string;
        DB_NAME: string;
        DB_USER: string;
        DB_PASSWORD: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_PASSWORD: string;
        REDIS_DB: string;
        HYPIXEL_KEY: string;
        BOT_TOKEN: string;
        BOATS_API_KEY: string;
        TOPGG_API_TOKEN: string;
        COMMAND_LOGGING: "yes" | "no";
        QUERY_LOGGING: "yes" | "no";
    }
}
