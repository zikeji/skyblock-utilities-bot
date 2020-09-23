import {Command, CommandStore, KlasaMessage} from "klasa";
import {MessageEmbed} from "discord.js";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";
import AddShutdownNotice from '../../lib/util/AddShutdownNotice';

export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'invite',
            runIn: ['text', 'dm'],
            description: 'Displays the invite link for SkyBlockZ Utilities.'
        });
    }

    async run(message: KlasaMessage) {
        return message.send(
            new MessageEmbed()
                .setColor('#5f5ac6')
                .setAuthor(`Invite SkyBlockZ Utilities to your server.`, this.client.user.avatarURL())
                .setDescription([
                    `Thanks for showing interest in inviting my bot! Unfortunately as I am being shut down soon inviting me probably isn't a good idea.`
                ].join('\n'))
                .setFooter(AddShutdownNotice())
        );
    }
};
