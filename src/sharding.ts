import { ShardingManager } from 'discord.js';

const manager = new ShardingManager('./dist/src/index.js', {
    totalShards: 'auto',
    token: process.env.BOT_TOKEN
});

manager.spawn().then((r) => console.log(`Spawned ${r.size} shards.`));

manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched.`));
