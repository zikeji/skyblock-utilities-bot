import {Command, KlasaMessage, CommandStore, KlasaClient} from "klasa";


export default class extends Command {

    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'contact',
            aliases: ['feedback', 'suggest', 'suggestions', 'complaint', 'complaints', 'issue', 'issues'],
            guarded: false,
            permissionLevel: 0,
            runIn: ['text', 'dm'],
            description: 'Information on how to get support.'
        });
    }

    async run(message: KlasaMessage) {
        return message.send(
            [
                '**Suggestions? Issues? Complaints?**',
                "If you're running into trouble, have a complaint, want to make a suggestion, or simply want to leave a compliment, please visit our support server.",
                'https://discord.gg/QkcGHwG'
            ].join('\n')
        );
    }

};
