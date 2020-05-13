import {Colors, Task} from 'klasa';
import {json} from "web-request";

export default class extends Task {
    private readonly header = new Colors({text: "lightblue"}).format("[DBL UPDATER]");

    async run() {
        if (process.env.NODE_ENV !== 'production' || this.client.shard.id !== 0) return;
        if (!this.client.ready) return;

        let [users, guilds] = [0, 0];
        const shardCount: number = this.client.shard.shardCount;
        const shardCounts: number[] = [];
        const results = await this.client.shard.broadcastEval(`[this.guilds.cache.reduce((prev, val) => val.memberCount + prev, 0), this.guilds.cache.size]`);
        for (const result of results) {
            users += result[0];
            guilds += result[1];
            shardCounts.push(result[1]);
        }

        if (process.env.BOATS_API_KEY) {
            const boatsResponse = await json<{error: boolean, message: string}>(`https://discord.boats/api/bot/${this.client.user.id}`, {
                method: 'POST',
                headers: {
                    Authorization: process.env.BOATS_API_KEY
                },
                form: {
                    server_count: guilds
                }
            });
            if (boatsResponse.error) {
                this.client.console.error(`${this.header} Error submitting to discord.boats: ${boatsResponse.message}`)
            }
        }

        if (process.env.TOPGG_API_TOKEN) {
            const topGgResponse = await json<{error?: string;}>(`https://top.gg/api/bots/707857251536470067/stats`, { // ${this.client.user.id}
                method: 'POST',
                headers: {
                    Authorization: process.env.TOPGG_API_TOKEN
                },
                json: true,
                body: {
                    shards: shardCounts,
                    shard_count: shardCount
                }
            });
            if (topGgResponse.error) {
                this.client.console.error(`${this.header} Error submitting to top.gg: ${topGgResponse.error}`)
            }
        }

        this.client.console.verbose(`${this.header} Bot is in ${guilds} guilds, has ${users} users, and is running on ${shardCount} shard${shardCount > 1 ? 's' : ''}.`);
    }
};
