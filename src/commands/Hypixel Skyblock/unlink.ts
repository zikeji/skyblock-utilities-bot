import {Command, CommandStore, KlasaMessage} from "klasa";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";

export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "unlink",
            enabled: true,
            runIn: ['text', 'dm'],
            aliases: ['unlinkminecraft', 'unlinkaccount'],
            description: "Unlink your Minecraft account."
        });
    }

    async run(message: KlasaMessage, []: []): Promise<any> {
        const uuid = message.author.settings.get<string>('minecraft.uuid');
        if (!uuid) {
            return message.send(`:no_entry: **|** ${message.author}, you do not have a Minecraft account linked.`);
        }

        await message.author.settings.update('minecraft.link_history', {
            uuid,
            method: message.author.settings.get('minecraft.link_method'),
            linked: parseInt(message.author.settings.get('minecraft.link_datetime')),
            unlinked: new Date().getTime()
        }, {action: 'add', force: true});

        await message.author.settings.update('minecraft.uuid', null);
        await message.author.settings.update('minecraft.link_method', null);
        await message.author.settings.update('minecraft.link_datetime', null);

        // run client utility to scan guilds for applicable roles
        this.client.shard.broadcastEval(`this.scanUserGuildsForRoles('${message.author.id}')`).catch(this.client.console.error);

        return message.send(`:white_check_mark: **|** ${message.author}, we've successfully unlinked your Minecraft account.`);
    }
};
