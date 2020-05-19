import {Colors, EventStore, KlasaClient} from "klasa";
import {GuildMember, PartialGuildMember, Permissions} from "discord.js";
import {SkyBlockZUtilitiesEvent} from "../lib/structures/SkyBlockZUtilitiesEvent";

export default class extends SkyBlockZUtilitiesEvent {
    private readonly header: string;

    constructor(client: KlasaClient, store: EventStore, file: string[], directory: string) {
        super(client, store, file, directory);
        this.header = new Colors({text: 'lightblue'}).format('[GUILD MEMBER ADD]');
    }

    async run(member: GuildMember | PartialGuildMember) {
        // add linked role to applicable users if exists in guild configuration
        if (member.guild.member(this.client.user.id).hasPermission(Permissions.FLAGS.MANAGE_ROLES) && member.guild.settings.get<string>('linked_role') && member.user.settings.get<string>('minecraft.uuid')) {
            const linkedRole = member.guild.roles.cache.get(member.guild.settings.get<string>('linked_role'));
            try {
                await member.roles.add(linkedRole, 'Member is linked, added linked role.');
            } catch (e) {
                this.client.console.error(`${this.shardHeader} ${this.header} Caught error applying role. ${e}`);
            }
        }
    }
};
