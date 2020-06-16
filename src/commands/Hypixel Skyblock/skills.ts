import {Command, CommandStore, KlasaMessage} from "klasa";
import {HypixelApi} from "../../lib/thirdparty/Hypixel";
import {MessageEmbed} from "discord.js";
import {UnifiedMojang} from "../../lib/thirdparty/UnifiedMojang";
import {UnifiedMojangResponse} from "../../lib/thirdparty/UnifiedMojang/interfaces/response";
import {HypixelPlayer} from "../../lib/thirdparty/Hypixel/classes/Player";
import {NoPlayerDataError} from "../../lib/thirdparty/Hypixel/methods/player";
import {SkyblockProfile, SkyblockProfileResponse} from "../../lib/thirdparty/Hypixel/interfaces/SkyBlock/profile";
import {RandomLoadingMessage} from "../../lib/util/RandomLoadingMessage";
import {SkillData, SkyblockSkills} from "../../lib/util/Hypixel/SkyBlock/Skills";
import {AbbreviateNumber} from "../../lib/util/AbbreviateNumber";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";

export default class Skills extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "skills",
            enabled: true,
            runIn: ['text', 'dm'],
            bucket: 1,
            aliases: ['skill', 'skl', 'skillcheck', 'skillaverage'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: 'List user\'s skill levels and average skill level.',
            quotedStringSupport: false,
            usage: '<username:string> [profile:string]',
            usageDelim: ' ',
            extendedHelp: [
                'If you\'ve changed your API it might take up to a minute for it to reflect when you use the command. For most accurate data ensure your Skills API is enabled on the profile you are requesting.',
                '',
                '[PREFIX_COMMAND] RealMinecraftIGN',
                '[PREFIX_COMMAND] RealMinecraftIGN Cucumber'
            ].join('\n')
        });

        this.customizeResponse('username', message => `:no_entry: **|** You must supply the Minecraft username you are checking! Run \`${this.client.prefixCommand('help skills', message)}\` for more instructions.`);
    }


    async run(message: KlasaMessage, [username, specificProfile]: [string, string | null]): Promise<any> {
        await message.send(RandomLoadingMessage.get());

        let user: UnifiedMojangResponse;

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

        let bestProfile: SkyblockProfile;
        let bestProfileSkills: SkillData;

        for (const profile of profiles) {
            if (!profile.success || !profile.profile) continue;
            const skillData = SkyblockSkills.computeSkills(user, data, profile.profile);
            if (!bestProfileSkills) bestProfileSkills = skillData;
            if (!bestProfile) bestProfile = profile.profile;
            if (skillData.average > bestProfileSkills.average) {
                bestProfileSkills = skillData;
                bestProfile = profile.profile;
            }
        }

        if (bestProfileSkills.average === 0) {
            return message.send(`:no_entry: **|** Something went wrong or this user has never played SkyBlock or leveled up any skills. Their average is 0.`);
        }

        let cuteName = data.stats.SkyBlock.profiles[bestProfileSkills.profile_id].cute_name;

        const embed = new MessageEmbed()
            .setColor('#5f5ac6')
            .setAuthor(`${user.username} on "${cuteName}"`, `https://visage.surgeplay.com/face/128/${user.uuid}`, `https://sky.lea.moe/stats/${user.username}/${cuteName}`)
            .setThumbnail(`https://visage.surgeplay.com/full/128/${user.uuid}`);

        if (bestProfileSkills.api) {
            embed
                .setDescription(`**Average Skill Level** (w/o progress)\n${bestProfileSkills.average}  (${bestProfileSkills.averageWithoutProgress})`);
        } else {
            embed
                .setDescription(`**Average Skill Level** \n${bestProfileSkills.averageWithoutProgress}`);
        }

        for (const skill of [
            ['farming', 'Farming', '<:farming:707342724453498880>'],
            ['mining', 'Mining', '<:mining:707342724478664804>'],
            ['combat', 'Combat', '<:combat:707342724726128781>'],
            ['foraging', 'Foraging', '<:foraging:707342894033272913>'],
            ['fishing', 'Fishing', '<:fishing:707343039688867870>'],
            ['enchanting', 'Enchanting', '<:enchanting:707343114179969095>'],
            ['alchemy', 'Alchemy', '<:alchemy:707343474680135690>'],
            ['carpentry', 'Carpentry', '<:carpentry:707343214603927696>'],
            ['runecrafting', 'Runecrafting', '<:runecrafting:707343381151481857>'],
            ['taming', 'Taming', '<:taming:707429610991911002>'],
        ]) {
            if (bestProfileSkills.api) {
                embed.addField(`**${skill[2]}  ${skill[1]}**`, [
                    `**Level ${bestProfileSkills[skill[0]].level}**`,
                    bestProfileSkills[skill[0]].xpForNext !== Infinity ?
                        `${Math.round((bestProfileSkills[skill[0]].progress * 100) * 100) / 100}% progress\n${AbbreviateNumber(bestProfileSkills[skill[0]].xpCurrent)} / ${AbbreviateNumber(bestProfileSkills[skill[0]].xpForNext)} XP` : 'Max Level',

                ].join('\n'), true);
            } else if (['carpentry', 'runecrafting'].indexOf(skill[0]) === -1) {
                embed.addField(`**${skill[2]}  ${skill[1]}**`, bestProfileSkills[skill[0]].level, true);
            }
        }

        if (bestProfileSkills.api) {
            embed.setFooter('Average does not include Carpentry & Runecrafting.');
        } else {
            embed.setFooter('Please enable skills API to get an accurate skill average and more data.');
        }

        return message.send(message.author, {embed});
    }
};
