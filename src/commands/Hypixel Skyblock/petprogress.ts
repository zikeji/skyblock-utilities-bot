import {Command, CommandStore, KlasaClient, KlasaMessage} from "klasa";
import {HypixelApi} from "../../lib/thirdparty/Hypixel";
import {MessageEmbed} from "discord.js";
import {UnifiedMojang} from "../../lib/thirdparty/UnifiedMojang";
import {UnifiedMojangResponse} from "../../lib/thirdparty/UnifiedMojang/interfaces/response";
import {HypixelPlayer} from "../../lib/thirdparty/Hypixel/classes/Player";
import {NoPlayerDataError} from "../../lib/thirdparty/Hypixel/methods/player";
import {SkyblockProfileResponse} from "../../lib/thirdparty/Hypixel/interfaces/SkyBlock/profile";
import {RandomLoadingMessage} from "../../lib/util/RandomLoadingMessage";
import {ProfilePicker} from "../../lib/util/Hypixel/SkyBlock/ProfilePicker";
import {PetMilestones} from "../../lib/util/Hypixel/SkyBlock/PetMilestones";


export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "petprogress",
            enabled: true,
            runIn: ['text', 'dm'],
            aliases: ['petmilestone', 'petmilestones', 'petpgrs'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: 'List a user\'s pet milestone progress.',
            quotedStringSupport: false,
            usage: '<username:string> [profile:string]',
            usageDelim: ' ',
            extendedHelp: [
                'List a user\'s pet milestone progress.',
                '',
                'Examples ::',
                'petprogress RealMinecraftIGN',
                'petprogress RealMinecraftIGN Cucumber'
            ].join('\n')
        });

        this.customizeResponse('username', message => `:no_entry: **|** You must supply the Minecraft username you are checking! Run \`${message.guild ? message.guild.settings.get('prefix') : this.client.options.prefix}help petprogress\` for more instructions.`);
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

        const profile = ProfilePicker.ByLastSave(profiles, user.uuid);

        if (!profile) {
            return message.send(`:no_entry: **|** An unknown error occurred while querying data for \`${user.username}\`!`);
        }

        const cuteName = data.stats.SkyBlock.profiles[profile.profile_id].cute_name;

        const embed = new MessageEmbed()
            .setColor('#5f5ac6')
            .setAuthor(`${user.username} on "${cuteName}"`, `https://visage.surgeplay.com/face/128/${user.uuid}`, `https://sky.lea.moe/stats/${user.username}/${cuteName}`)
            .setThumbnail(`https://visage.surgeplay.com/full/128/${user.uuid}`);

        let description = [];

        for (const PetWithMilestone of PetMilestones.PETS_WITH_MILESTONES) {
            if (description.length > 0) description.push('');
            const progress = profile.members[user.uuid].stats[PetWithMilestone.pet.key] ? profile.members[user.uuid].stats[PetWithMilestone.pet.key] : 0;
            const pet = PetMilestones.GetPetMilestoneProgress(PetWithMilestone, progress);
            description.push(`${pet.emoji} **${pet.name} Pet**`);
            if (!pet.rarity && pet.nextRarity && pet.nextGoal) {
                // hasn't earned the first pet yet
                description.push(`You have ${progress} ${pet.goalType}, you need ${pet.nextGoal - progress} more until you earn the **${pet.emoji} ${pet.nextRarity} ${pet.name}**!`);
            } else if (pet.nextRarity && pet.nextGoal) {
                // earned a pet, has a new pet level
                description.push(`You've earned the **${pet.emoji} ${pet.rarity} ${pet.name}**.\nYou have ${progress} ${pet.goalType}, you need ${pet.nextGoal - progress} more until you unlock the **${pet.emoji} ${pet.nextRarity} ${pet.name}**!`);
            } else {
                description.push(`You've earned the **${pet.emoji} ${pet.rarity} ${pet.name}**!\nYou have ${progress} ${pet.goalType}, you've unlocked the maximum tier pet in this milestone!`);
            }

        }

        embed.setDescription(description.join('\n'));

        return message.send(message.author, {embed});
    }


};
