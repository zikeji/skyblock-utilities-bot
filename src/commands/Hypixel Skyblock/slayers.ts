import {Command, CommandStore, KlasaMessage} from "klasa";
import {HypixelApi} from "../../lib/thirdparty/Hypixel";
import {MessageEmbed} from "discord.js";
import {UnifiedMojang} from "../../lib/thirdparty/UnifiedMojang";
import {UnifiedMojangResponse} from "../../lib/thirdparty/UnifiedMojang/interfaces/response";
import {HypixelPlayer} from "../../lib/thirdparty/Hypixel/classes/Player";
import {NoPlayerDataError} from "../../lib/thirdparty/Hypixel/methods/player";
import {SkyblockProfile, SkyblockProfileResponse} from "../../lib/thirdparty/Hypixel/interfaces/SkyBlock/profile";
import {RandomLoadingMessage} from "../../lib/util/RandomLoadingMessage";
import {SlayerLeveling} from "../../lib/util/Hypixel/SkyBlock/SlayerLeveling";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";

export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "slayers",
            enabled: true,
            runIn: ['text', 'dm'],
            aliases: ['slayer', 'slyr', 'slyrs'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: 'List user\'s slayer levels.',
            quotedStringSupport: false,
            usage: '<username:string> [profile:string]',
            usageDelim: ' ',
            extendedHelp: [
                '[PREFIX_COMMAND] RealMinecraftIGN',
                '[PREFIX_COMMAND] RealMinecraftIGN Cucumber'
            ].join('\n')
        });

        this.customizeResponse('username', message => `:no_entry: **|** You must supply the Minecraft username you are checking! Run \`${this.client.prefixCommand('help slayers', message)}\` for more instructions.`);
    }


    async run(message: KlasaMessage, [username, specificProfile]: [string, string | null]): Promise<any> {
        let user: UnifiedMojangResponse;

        await message.send(RandomLoadingMessage.get());

        try {
            user = await UnifiedMojang.user(username);
        } catch (e) {
            return await message.send(`:no_entry: **|** \`${username}\` is invalid or does not exist!`);
        }

        let data: HypixelPlayer;

        try {
            data = await HypixelApi.Player.getByUuid(user.uuid);
        } catch (e) {
            if (e instanceof NoPlayerDataError) {
                return message.send(`:no_entry: **|** \`${user.username}\` has never played on Hypixel.`);
            }
            return message.send(`:no_entry: **|** An unknown error occurred while querying data for \`${user.username}\`!`);
        }

        if (!data || !data.stats || !data.stats.SkyBlock || !data.stats.SkyBlock.profiles || Object.keys(data.stats.SkyBlock.profiles).length === 0) {
            return message.send(`:no_entry: **|** \`${user.username}\` has never played SkyBlock or has their API fully disabled.`);
        }

        let promises = [];
        for (const key of Object.keys(data.stats.SkyBlock.profiles)) {
            if (!specificProfile || data.stats.SkyBlock.profiles[key].cute_name.toLowerCase() === specificProfile.toLowerCase()) {
                promises.push(HypixelApi.SkyBlock.Profile.getByProfileId(data.stats.SkyBlock.profiles[key].profile_id));
            }
        }

        if (promises.length === 0) {
            return message.send(`:no_entry: **|** \`${user.username}\` does not have a profile named \`${specificProfile}\`.`);
        }

        let profiles: SkyblockProfileResponse[];

        try {
            profiles = await Promise.all(promises);
        } catch (e) {
            return message.send(`:no_entry: **|** An unknown error occurred while querying data for \`${user.username}\`!`);
        }

        let bestSlayerXp = 0;
        let bestProfile: SkyblockProfile;

        for (const profile of profiles) {
            if (!profile.success || !profile.profile) continue;

            const currentMember = profile.profile.members[user.uuid];

            let slayerXp = 0;
            for (const key of ['zombie', 'spider', 'wolf']) {
                if (currentMember.slayer_bosses && currentMember.slayer_bosses[key] && currentMember.slayer_bosses[key].xp) {
                    slayerXp += profile.profile.members[user.uuid].slayer_bosses[key].xp
                }
            }

            if (!bestProfile) bestProfile = profile.profile;

            if (slayerXp > bestSlayerXp) {
                bestSlayerXp = slayerXp;
                bestProfile = profile.profile;
            }
        }

        const cuteName = data.stats.SkyBlock.profiles[bestProfile.profile_id].cute_name;

        const embed = new MessageEmbed()
            .setColor('#5f5ac6')
            .setAuthor(`${user.username} on "${cuteName}"`, `https://visage.surgeplay.com/face/128/${user.uuid}`, `https://sky.lea.moe/stats/${user.username}/${cuteName}`)
            .setThumbnail(`https://visage.surgeplay.com/full/128/${user.uuid}`);

        let description = [];
        let totalXp = 0;

        for (const field of [
            {name: 'Zombie', key: 'zombie', 'emoji': '<:revenant:707357810526257253>'},
            {name: 'Spider', key: 'spider', 'emoji': '<:tarantula:707357718658154546>'},
            {name: 'Wolf', key: 'wolf', 'emoji': '<:sven:707357309634084969>'}
        ]) {
            const level = SlayerLeveling.getLevelByXp(bestProfile.members[user.uuid].slayer_bosses[field.key].xp);
            description.push(`**${field.emoji}  ${field.name} Slayer**`);
            description.push('```asciidoc');
            description.push(`= Level ${level.level} =`);
            description.push(`${level.xp.toLocaleString()} / ${level.xpForNext.toLocaleString()} XP`);
            totalXp += level.xp;
            let totalKills = 0;
            for (const key of ['boss_kills_tier_0', 'boss_kills_tier_1', 'boss_kills_tier_2', 'boss_kills_tier_3']) {
                if (bestProfile.members[user.uuid].slayer_bosses[field.key][key]) {
                    totalKills += bestProfile.members[user.uuid].slayer_bosses[field.key][key];
                }
            }
            if (totalKills > 0) {
                description.push('');
                description.push('Kills ::');
                for (const tier of [['I', 'boss_kills_tier_0'], ['II', 'boss_kills_tier_1'], ['III', 'boss_kills_tier_2'], ['IV', 'boss_kills_tier_3']]) {
                    if (bestProfile.members[user.uuid].slayer_bosses[field.key][tier[1]]) {
                        description.push(`Tier ${tier[0].padEnd(3)} - ${bestProfile.members[user.uuid].slayer_bosses[field.key][tier[1]]}`)
                    }
                }
                description.push(`Total    - ${totalKills}`);
            }
            description.push('```');
        }

        description.push('**<:experience_bottle:707420813682409482>  Total Slayer XP**');
        description.push('```');
        description.push(`${totalXp.toLocaleString()} XP`);
        description.push('```');

        embed.setDescription(description);

        return message.send(message.author, {embed});
    }


};
