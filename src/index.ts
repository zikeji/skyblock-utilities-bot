import {ShardingManager} from "kurasuta";
import {SkyblockUtilitiesClient} from "./lib/structures/SkyblockUtilitiesClient";
import {KlasaClientOptions} from "klasa";
import {join} from "path";
import {SharderOptions} from "kurasuta/typings/Sharding/ShardingManager";

interface BotSharderOptions extends SharderOptions {
    clientOptions: KlasaClientOptions
}

class BotShardingManager extends ShardingManager {
    clientOptions: KlasaClientOptions;
    constructor(path: string, options: BotSharderOptions) {
        super(path, options);
    }
}

const sharder = new BotShardingManager(join(__dirname, "main"), {
    token: process.env.BOT_TOKEN,
    client: SkyblockUtilitiesClient,
    clientOptions: {
        commandEditing: true,
        commandLogging: process.env.COMMAND_LOGGING === 'yes',
        fetchAllMembers: false,
        prefix: 'sb ',
        prefixCaseInsensitive: true,
        noPrefixDM: true,
        production: process.env.NODE_ENV === 'production',
        // ownerID: '0',
        typing: false,
        // quicker reactions
        restTimeOffset: 100,
        // longer timeout
        restWsBridgeTimeout: 10000,
        // retry limit
        retryLimit: Infinity,
        providers: {
            default: 'postgresql',
            postgresql: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD
            }
        },
        presence: {
            activity: {
                name: `"sb help" to get started!`,
                type: 'PLAYING'
            }
        },
        readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`
    }
});

sharder.spawn().catch(console.error);
