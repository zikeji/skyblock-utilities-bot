import {Command, KlasaMessage, CommandStore} from "klasa";
import {MessageEmbed} from "discord.js";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";
import AddShutdownNotice from '../../lib/util/AddShutdownNotice';

export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
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
                .setTitle(`Support SkyBlockZ Utilities`)
                .setDescription([
                    `I appreciate the thought.`,
                    ``,
                    `Thanks!`,
                    `-Zikeji#9453`
                ].join('\n'))
                .setFooter(AddShutdownNotice())
        );
    }

};
