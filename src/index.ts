import {ShardingManager} from "discord.js";
import {join} from 'path';

const manager = new ShardingManager(join(__dirname, 'main.js'), {
    token: process.env.BOT_TOKEN,
    totalShards: 2
});

manager.spawn().catch(console.error);
