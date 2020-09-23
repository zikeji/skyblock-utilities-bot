import {Command, KlasaMessage, CommandStore} from "klasa";
import {MessageEmbed} from "discord.js";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";
import AddShutdownNotice from '../../lib/util/AddShutdownNotice';


export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'support',
            aliases: ['contact', 'feedback', 'suggest', 'suggestions', 'complaint', 'complaints', 'issue', 'issues'],
            runIn: ['text', 'dm'],
            description: 'Information on how to get support.'
        });
    }

    async run(message: KlasaMessage) {
        return message.send(
            new MessageEmbed()
                .setColor('#5f5ac6')
                .setAuthor('Suggestions? Issues? Complaints?', this.client.user.avatarURL())
                .setDescription([
                    "If you're running into trouble, have a complaint, want to make a suggestion, or simply want to leave a compliment, please visit our [support server](https://discord.gg/QkcGHwG)."
                ].join('\n'))
                .setFooter(AddShutdownNotice())
        );
    }

};
