import {Colors, KlasaClient} from "klasa";

const client = new KlasaClient({
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
    readyMessage: (client) => `Successfully initialized. Ready to serve ${client.guilds.cache.size} guilds.`
});

client.once('ready', () => {
    setTimeout(() => {
        client.user.setActivity({
            name: `"sb help" to get started!`,
            type: 'PLAYING'
        }).catch(client.console.error);
    }, 100);
});

const red = new Colors({text: 'red'});
client.on('error', e => {
    client.console.error(`${red.format('[DISCORD ERROR]')} ${e.name} ${e.message}`);
});

client.login(process.env.BOT_TOKEN).catch(console.error);
