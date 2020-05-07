import {Command, CommandStore, KlasaClient, KlasaMessage} from "klasa";
import {HypixelApi} from "../../thirdparty/Hypixel";
import {MessageEmbed} from "discord.js";
import {UnifiedMojang} from "../../thirdparty/UnifiedMojang";
import {UnifiedMojangResponse} from "../../thirdparty/UnifiedMojang/interfaces/response";
import {HypixelPlayer} from "../../thirdparty/Hypixel/classes/Player";
import {NoPlayerDataError} from "../../thirdparty/Hypixel/methods/player";
import {SkyblockProfile, SkyblockProfileResponse} from "../../thirdparty/Hypixel/interfaces/SkyBlock/profile";
import {RandomLoadingMessage} from "../../util/RandomLoadingMessage";
import {SkillData, SkyblockSkills} from "../../util/Hypixel/SkyBlock/Skills";


export default class Skills extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "skills",
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            bucket: 1,
            aliases: ['skill', 'skl', 'skillcheck', 'skillaverage'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: 'List user\'s skill levels and average skill level.',
            quotedStringSupport: false,
            usage: '<username:string> [profile:string]',
            usageDelim: ' ',
            extendedHelp: [
                'List a user\'s skill levels and average skill level.',
                '',
                'If you\'ve changed your API it might take up to a minute for it to reflect when you use the command. For most accurate data ensure your Skills API is enabled on the profile you are requesting.',
                '',
                'Examples ::',
                'skills RealMinecraftIGN',
                'skills RealMinecraftIGN Cucumber'
            ].join('\n')
        });

        this.customizeResponse('username', message => `:no_entry: **|** You must supply the Minecraft username you are checking! Run \`${message.guild ? message.guild.settings.get('prefix') : this.client.options.prefix} help skills\` for more instructions.`);
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

        embed
            .setDescription(`**Average Skill Level** (w/o progress)\n${bestProfileSkills.average}  (${bestProfileSkills.averageWithoutProgress})`)
            .addField('**<:farming:707342724453498880>  Farming**', bestProfileSkills.farming.level, true)
            .addField('**<:mining:707342724478664804>  Mining**', bestProfileSkills.mining.level, true)
            .addField('**<:combat:707342724726128781>  Combat**', bestProfileSkills.combat.level, true)
            .addField('**<:foraging:707342894033272913>  Foraging**', bestProfileSkills.foraging.level, true)
            .addField('**<:fishing:707343039688867870>  Fishing**', bestProfileSkills.fishing.level, true)
            .addField('**<:enchanting:707343114179969095>  Enchanting**', bestProfileSkills.enchanting.level, true)
            .addField('**<:alchemy:707343474680135690>  Alchemy**', bestProfileSkills.alchemy.level, true);

        if (bestProfileSkills.api) {
            embed
                .addField('**<:carpentry:707343214603927696>  Carpentry**', bestProfileSkills.carpentry.level, true)
                .addField('**<:runecrafting:707343381151481857>  Runecrafting**', bestProfileSkills.runecrafting.level, true);
            if (bestProfileSkills.taming.level > 0) {
                embed
                    .addField('**<:taming:707429610991911002>  Taming**', bestProfileSkills.taming.level, true);
            } else {
                embed.setFooter('Taming skill data is not available in the API yet.');
            }
        } else {
            embed
                .addField('Note', 'Skills API was not enabled on this profile so we used the achievements data. This data reflects the best levels across all profiles and may not be accurate for this profile.');
        }


        return message.send(message.author, {embed});
    }


};
