import {version as botVersion} from "../../../package.json";
import {Command, version as klasaVersion, Duration, KlasaMessage, CommandStore, KlasaClient} from "klasa";
import {MessageEmbed, version as discordVersion} from "discord.js";

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            guarded: false,
            runIn: ['text', 'dm'],
            requiredPermissions: ['EMBED_LINKS'],
            description: language => language.get('COMMAND_STATS_DESCRIPTION')
        });
    }

    async run(message: KlasaMessage) {
        let [users, guilds, channels, memory, cpm] = [0, 0, 0, 0, 0];

        if (this.client.shard) {
            const results = await this.client.shard.broadcastEval(`[this.guilds.cache.reduce((prev, val) => val.memberCount + prev, 0), this.guilds.cache.size, this.channels.cache.size, (process.memoryUsage().heapUsed / 1024 / 1024), this.health.commands.cmdCount[59].count]`);
            for (const result of results) {
                users += result[0];
                guilds += result[1];
                channels += result[2];
                memory += result[3];
                cpm += result[4];
            }
        }

        return message.send(
            new MessageEmbed()
                .setAuthor(`SkyBlock Utilities v${botVersion} - Statistics`, this.client.user.displayAvatarURL())
                .setColor('#5f5ac6')
                .setTimestamp()
                .addField('Users', `${users.toLocaleString()}`, true)
                .addField('Guilds', `${guilds.toLocaleString()}`, true)
                .addField('Channels', `${channels.toLocaleString()}`, true)

                .addField('Uptime', `${Duration.toNow(Date.now() - (process.uptime() * 1000))}`, true)
                .addField('Memory Usage', `${memory.toFixed(2)} MB`, true)
                .addField("TCR", this.client.settings.get('counter.total').toLocaleString(), true)

                .addField('Cluster', `${this.client.shard.id + 1}/${this.client.shard.clusterCount}`, true)
                .addField('Shard', `${message.guild ? message.guild.shardID + 1 : 1}/${this.client.shard.shardCount}`, true)
                .addField('CPM', `${cpm.toLocaleString()}`, true)

                .setFooter(`Klasa v${klasaVersion} | Discord.js v${discordVersion} | Node.js ${process.version}`)
        );
    }

};
