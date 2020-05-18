import {Command, CommandStore, KlasaGuild, KlasaMessage} from "klasa";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";
import {MessageEmbed, Permissions, Role} from "discord.js";

export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'linkedrole',
            runIn: ['text'],
            description: 'Configure a role to automatically be applied to users with their Minecraft Account linked.',
            permissionLevel: 6,
            quotedStringSupport: true,
            usageDelim: ' ',
            usage: '<set|unset|scan|show:default> [role:rolename]',
            extendedHelp: [
                'Running this command with no input (or "default") shows information about the current configuration (e.g. `[PREFIX_COMMAND]`).',
                '',
                'Running this command with "set" and a role mention, role ID, or the name of a role configures that role as the linked role and enables the functionality (e.g. `[PREFIX_COMMAND] set "Linked Minecraft"`.',
                '',
                'Running this command with "scan" will initiate a scan of all server members to see if any are missing the role and apply it if so, or if they have the role and are not linked (e.g. `[PREFIX_COMMAND] scan`).',
                '',
                'Running this command with "unset" unsets the role for linked users and disables the functionality (e.g. `[PREFIX_COMMAND] unset`).'
            ].join('\n')
        });
    }

    async run(message: KlasaMessage, [action, role]: ['set' | 'unset' | 'scan' | 'show', Role | undefined]) {
        if (!message.guild.me.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
            return message.send(`:no_entry: **|** ${message.author}, I am is missing "Manage Roles" permission. In order to apply the role to linked users this permission must be given to me. Please also ensure this bot's role is above the linked role so it can apply the role.`);
        }

        const linkedRole = message.guild.roles.cache.get(message.guild.settings.get<string>('linked_role'));

        switch (action) {
            case 'set': {
                if (!role) {
                    return message.send(`:no_entry: **|** ${message.author}, please provide the role you would like to set as the linked role.`);
                }
                let manageRolesPosition = -1;
                for (const role of message.guild.me.roles.cache.array()) {
                    if (role.permissions.has(Permissions.FLAGS.MANAGE_ROLES) && role.position > manageRolesPosition) manageRolesPosition = role.position;
                }
                if (role.position > manageRolesPosition) {
                    return message.send(`:no_entry: **|** ${message.author}, my role is not above the provided role. I cannot apply the role.`);
                }
                await message.guild.settings.update('linked_role', role, message.guild);
                return message.send(`:white_check_mark: **|** ${message.author} the configuration has been saved successfully!\n**Hint:** if you want to apply the role to existing members, run \`${this.client.prefixCommand('linkedrole scan')}\`.`);
            }
            case 'unset': {
                if (!message.guild.settings.get<string>('linked_role')) {
                    return message.send(`:no_entry: **|** ${message.author}, there is no linked role configured on this server. Get started with \`${this.client.prefixCommand('help linkedrole')}\`!`);
                }
                await message.guild.settings.reset('linked_role');
                return message.send(`:white_check_mark: **|** ${message.author}, I have unset the linked role configuration!\n**Note:** I did not remove the role from existing users.`)
            }
            case 'scan': {
                const results = await this.scan(message.guild);
                return message.send(
                    new MessageEmbed()
                        .setAuthor(`Linked Role Scan Results`, this.client.user.displayAvatarURL())
                        .setColor('#5f5ac6')
                        .setDescription('We scanned your server members and applied the role to users missing it as well as removed it from users who aren\'t linked and had the role.')
                        .addField('Added', results.added, true)
                        .addField('Removed', results.removed, true)
                );
            }
            case 'show': {
                return message.send(
                    new MessageEmbed()
                        .setAuthor(`Linked Role Configuration`, this.client.user.displayAvatarURL())
                        .setColor('#5f5ac6')
                        .setDescription('The following is your configuration of the linked role on this server.')
                        .addField('Role', linkedRole ? linkedRole : 'Not Set', true)
                        .addField('Linked Users', linkedRole ? message.guild.members.cache.filter(m => m.roles.cache.has(linkedRole.id)).size : 'n/a', true)
                );
            }
        }
    }

    public async scan(guild: KlasaGuild): Promise<{ added: number, removed: number }> {
        const linkedRole = guild.roles.cache.get(guild.settings.get<string>('linked_role'));
        if (!linkedRole) throw "No role.";

        const results = {
            added: 0,
            removed: 0
        };

        const promises = [];

        for (const member of guild.members.cache.array()) {
            if (member.user.settings.get('minecraft.uuid') && !member.roles.cache.has(linkedRole.id)) {
                results.added += 1;
                promises.push(member.roles.add(linkedRole, 'Member linked their account, added linked role.'));
            } else if (!member.user.settings.get('minecraft.uuid') && member.roles.cache.has(linkedRole.id)) {
                results.removed += 1;
                promises.push(member.roles.remove(linkedRole, 'Member unlinked their account, removed linked role.'));
            }
        }

        await Promise.all(promises);

        return results;
    }
};
