import { caching } from "cache-manager";
import * as redisStore from "cache-manager-redis";

export const cache = caching({
    store: redisStore,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    auth_pass: process.env.REDIS_PASSWORD,
    db: process.env.REDIS_DB,
    ttl: (60 * 10)
});

// @ts-ignore
cache.store.events.on('redisError', function(error) {
    // handle error here
    console.log(error);
});
