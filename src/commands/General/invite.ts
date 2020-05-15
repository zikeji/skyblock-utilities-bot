import {Command, CommandStore, KlasaMessage} from "klasa";
import {MessageEmbed} from "discord.js";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";

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
                .setAuthor(`Invite SkyBlockZ Utilities to your server.`, this.client.user.avatarURL(), 'https://discordapp.com/oauth2/authorize?client_id=707857251536470067&permissions=347200&scope=bot')
                .setDescription([
                    `Thanks for showing interest in inviting my bot! You can invite it using the link below. Thank you for showing your support!`,
                    '',
                    '[Invite SkyBlockZ Utilities to your server!](https://discordapp.com/oauth2/authorize?client_id=707857251536470067&permissions=347200&scope=bot)'
                ].join('\n')));
    }
};
