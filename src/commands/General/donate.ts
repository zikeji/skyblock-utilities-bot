import {Command, KlasaMessage, CommandStore, KlasaClient} from "klasa";
import {MessageEmbed} from "discord.js";


export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'donate',
            aliases: ['coffee'],
            runIn: ['text', 'dm'],
            description: 'Information on feeding a tired developer coffee.'
        });
    }

    async run(message: KlasaMessage) {
        return message.send(
            new MessageEmbed()
                .setColor('#FF5E5B')
                .setThumbnail('https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/5ca5bf1dff3c03fbf7cc9b3c_Kofi_logo_RGB_rounded-p-500.png')
                .setTitle(`Support SkyBlock Utilities`)
                .setURL('https://ko-fi.com/zikeji')
                .setDescription([
                    `While I'm more than capable of supporting myself, if you'd like to support my work you can [buy me a coffee](https://ko-fi.com/zikeji)!`,
                    ``,
                    `Thanks!`,
                    `-Zikeji#9453`
                ].join('\n'))
        );
    }

};
