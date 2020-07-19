import {SkyBlockZUtilitiesClient} from "./lib/structures/SkyBlockZUtilitiesClient";

const client = new SkyBlockZUtilitiesClient({
    commandEditing: true,
    commandLogging: process.env.COMMAND_LOGGING === 'yes',
    console: {
        useColor: process.env.CONSOLE_USE_COLOR === 'yes'
    },
    fetchAllMembers: false,
    prefix: 'sb',
    prefixCaseInsensitive: true,
    noPrefixDM: true,
    production: process.env.NODE_ENV === 'production',
    ownerID: '185787844843798528',
    pieceDefaults: {
        commands: {
            deletable: true,
            guarded: true,
            cooldown: 3
        }
    },
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
    readyMessage: null
});

client.login(process.env.BOT_TOKEN).catch(console.error);
