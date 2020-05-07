import {version as botVersion} from "../../../package.json";
import {Command, version as klasaVersion, Duration, KlasaMessage, CommandStore, KlasaClient} from "klasa";
import {version as discordVersion} from "discord.js";

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            guarded: false,
            runIn: ['text', 'dm'],
            description: language => language.get('COMMAND_STATS_DESCRIPTION')
        });
    }

    async run(message: KlasaMessage) {
        let [users, guilds, channels, memory] = [0, 0, 0, 0];

        if (this.client.shard) {
            const results = await this.client.shard.broadcastEval(`[this.users.size, this.guilds.size, this.channels.size, (process.memoryUsage().heapUsed / 1024 / 1024)]`);
            for (const result of results) {
                users += result[0];
                guilds += result[1];
                channels += result[2];
                memory += result[3];
            }
        }

        let code = ['= STATISTICS ='];
        code.push('');
        code.push(`• Mem Usage  :: ${(memory || process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
        code.push(`• Uptime     :: ${Duration.toNow(Date.now() - (process.uptime() * 1000))}`);
        code.push(`• Users      :: ${(users || this.client.users.cache.size).toLocaleString()}`);
        code.push(`• Guilds     :: ${(guilds || this.client.guilds.cache.size).toLocaleString()}`);
        code.push(`• Channels   :: ${(channels || this.client.channels.cache.size).toLocaleString()}`);
        code.push(`• Version    :: ${botVersion}`);
        code.push(`• Klasa      :: ${klasaVersion}`);
        code.push(`• Discord.js :: ${discordVersion}`);
        code.push(`• Node.js    :: ${process.version}`);
        code.push(`• Shard      :: ${(message.guild ? message.guild.shardID : 0) + 1} / ${this.client.options.shardCount}`);
        code.push('');

        return message.send(code.join('\n'), {code: 'asciidoc'});
    }

};
