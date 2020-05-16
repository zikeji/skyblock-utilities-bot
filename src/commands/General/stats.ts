import {version as botVersion} from "../../../package.json";
import {Command, version as klasaVersion, Duration, KlasaMessage, CommandStore} from "klasa";
import {MessageEmbed, version as discordVersion} from "discord.js";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";

export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            runIn: ['text', 'dm'],
            requiredPermissions: ['EMBED_LINKS'],
            description: language => language.get('COMMAND_STATS_DESCRIPTION')
        });
    }

    async run(message: KlasaMessage) {
        let [users, linkedUsers, guilds, channels, memory, cpm] = [0, 0, 0, 0, 0, 0];

        const results = await this.client.shard.broadcastEval(`[this.guilds.cache.reduce((prev, val) => val.memberCount + prev, 0), this.users.cache.filter(u => u.settings.get('minecraft.uuid')).size, this.guilds.cache.size, this.channels.cache.size, (process.memoryUsage().heapUsed / 1024 / 1024), this.health.commands.cmdCount[59].count]`);
        for (const result of results) {
            users += result[0];
            linkedUsers += result[1];
            guilds += result[2];
            channels += result[3];
            memory += result[4];
            cpm += result[5];
        }

        return message.send(
            new MessageEmbed()
                .setAuthor(`SkyBlockZ Utilities v${botVersion} - Statistics`, this.client.user.displayAvatarURL())
                .setColor('#5f5ac6')
                .setTimestamp()
                .addField('Users', `${users.toLocaleString()} (${linkedUsers.toLocaleString()})`, true)
                .addField('Guilds', `${guilds.toLocaleString()}`, true)
                .addField('Channels', `${channels.toLocaleString()}`, true)

                .addField('Uptime', `${Duration.toNow(Date.now() - (process.uptime() * 1000))}`, true)
                .addField('Memory Usage', `${memory.toFixed(2)} MB`, true)
                .addField("TCR", this.client.settings.get('counter.total') ? this.client.settings.get('counter.total').toLocaleString() : 0, true)

                .addField('Cluster', `${this.client.shard.id + 1}/${this.client.shard.clusterCount}`, true)
                .addField('Shard', `${message.guild ? message.guild.shardID + 1 : 1}/${this.client.shard.shardCount}`, true)
                .addField('CPM', `${cpm.toLocaleString()}`, true)

                .setFooter(`Klasa v${klasaVersion} | Discord.js v${discordVersion} | Node.js ${process.version}`)
        );
    }

};
