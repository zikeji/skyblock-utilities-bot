import {Argument, KlasaGuild, KlasaMessage, util} from "klasa";
import {Role} from "discord.js";

const {regExpEsc} = util;

const ROLE_REGEXP = Argument.regex.role;

export default class RoleNameArgument extends Argument {
    private static resolveRole(query: Role | string, guild: KlasaGuild): Role | null {
        if (query instanceof Role) return guild.roles.cache.has(query.id) ? query : null;
        if (typeof query === 'string' && ROLE_REGEXP.test(query)) return guild.roles.cache.get(ROLE_REGEXP.exec(query)[1]);
        return null;
    }

    async run(arg: string, possible: { name: any; }, msg: KlasaMessage) {
        let guild: KlasaGuild = msg.guild;
        if (!guild) {
            const guildId = this.client.settings.get<string>('guild_id');
            guild = this.client.guilds.cache.get(guildId);
            if (!guild) {
                return this.store.get('role').run(arg, possible, msg);
            }
        }
        const resRole = RoleNameArgument.resolveRole(arg, guild);
        if (resRole) return resRole;

        const results = [];
        const reg = new RegExp(regExpEsc(arg), 'i');
        for (const role of guild.roles.cache.values()) {
            if (reg.test(role.name)) results.push(role);
        }

        let querySearch;
        if (results.length > 0) {
            const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, 'i');
            const filtered = results.filter(role => regWord.test(role.name));
            querySearch = filtered.length > 0 ? filtered : results;
        } else {
            querySearch = results;
        }

        switch (querySearch.length) {
            case 0:
                throw `${possible.name} Must be a valid name, id or role mention`;
            case 1:
                return querySearch[0];
            default:
                for (const querySearchResult of querySearch) {
                    if (querySearchResult.name.toLowerCase() === arg.toLowerCase()) {
                        return querySearchResult;
                    }
                }
                throw `Found multiple matches: \`${querySearch.map(role => role.name).join('`, `')}\``;
        }
    }

};
