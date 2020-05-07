import {Command, CommandStore, KlasaClient, KlasaMessage} from 'klasa';

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'invite',
            runIn: ['text', 'dm'],
            description: 'Displays the invite link for SkyBlock Utilities.'
        });
    }

    async run(message: KlasaMessage) {
        return message.send([
            `My invite link: <${this.client.invite}>`,
            '',
            `The above invite link is generated requesting the minimum permissions required to run all of my current commands. :smile:`
        ].join('\n'));
    }
};
