import {Command, CommandStore, KlasaClient, KlasaMessage} from "klasa";

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            aliases: ['setPrefix'],
            cooldown: 5,
            description: 'Change the command prefix the bot uses in your server.',
            permissionLevel: 0,
            runIn: ['text'],
            usage: '[reset|prefix:str{1,10}]'
        });
    }

    async run(message: KlasaMessage, [prefix]: [string | null]) {
        if (!prefix) return message.send(`The prefix for this guild is \`${message.guild.settings.get('prefix')}\``);
        if (!await message.hasAtLeastPermissionLevel(6)) throw message.language.get('INHIBITOR_PERMISSIONS');
        if (prefix === 'reset') return this.reset(message);
        if (message.guild.settings.get('prefix') === prefix) throw message.language.get('CONFIGURATION_EQUALS');
        await message.guild.settings.update('prefix', prefix);
        return message.send(`The prefix for this guild has been set to \`${prefix}\``);
    }

    async reset(message: KlasaMessage) {
        await message.guild.settings.reset('prefix');
        return message.send(`Switched back the guild's prefix back to \`${this.client.options.prefix}\`!`);
    }
};
