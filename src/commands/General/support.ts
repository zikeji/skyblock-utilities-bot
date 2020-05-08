import {Command, KlasaMessage, CommandStore, KlasaClient} from "klasa";
import {MessageEmbed} from "discord.js";


export default class extends Command {

    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'support',
            aliases: ['contact', 'feedback', 'suggest', 'suggestions', 'complaint', 'complaints', 'issue', 'issues'],
            guarded: false,
            permissionLevel: 0,
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
        );
    }

};
