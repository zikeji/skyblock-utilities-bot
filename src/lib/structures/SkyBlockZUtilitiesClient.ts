import {Client, Command, KlasaClientOptions, KlasaMessage} from 'klasa';
import {Permissions} from "discord.js";

require('./schemas/defaultClientSchema');
require('./schemas/defaultGuildSchema');
require('./schemas/defaultUserSchema');

export class SkyBlockZUtilitiesClient extends Client {
    public health: {
        commands: {
            temp: {
                count: number;
                ran: any;
            },
            cmdCount: {
                count: number;
                ran: any;
            }[]
        }
    };
    public static emotes = {
        loading: '<a:loading:707345706578477086>'
    };

    constructor(options?: KlasaClientOptions) {
        super(options);

        this.health = Object.seal({
            commands: {
                temp: {
                    count: 0,
                    ran: {}
                },
                cmdCount: new Array(60).fill({
                    count: 0,
                    ran: {}
                })
            }
        });
    }

    private static PREFIX_REGEX = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]$/;

    public prefixCommand(command: Command | string, message?: KlasaMessage): string {
        const prefix: string = message && message.guild ? message.guild.settings.get<string>('prefix') : <string>this.options.prefix;
        return `${SkyBlockZUtilitiesClient.PREFIX_REGEX.test(prefix) ? prefix : `${prefix} `}${command instanceof Command ? command.name : command}`;
    }

    // noinspection JSUnusedGlobalSymbols
    public async scanUserGuildsForRoles(userId: string) {
        for (const guild of this.guilds.cache.array()) {
            const member = guild.member(userId);
            if (member) {
                await member.user.settings.sync();
                if (guild.member(this.user.id).hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
                    // run role related checks
                    const linkedRole = guild.roles.cache.get(guild.settings.get('linked_role'));
                    if (linkedRole) {
                        if (member.user.settings.get('minecraft.uuid') && !member.roles.cache.has(linkedRole.id)) {
                            member.roles.add(linkedRole, 'Member linked their account, added linked role.').catch(this.console.error);
                        } else if (!member.user.settings.get('minecraft.uuid') && member.roles.cache.has(linkedRole.id)) {
                            member.roles.remove(linkedRole, 'Member unlinked their account, removed linked role.').catch(this.console.error);
                        }
                    }
                }
            }
        }
    }
}
