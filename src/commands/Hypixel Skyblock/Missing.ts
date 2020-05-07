import {Command, CommandStore, KlasaClient, KlasaMessage} from "klasa";
import {HypixelApi} from "../../thirdparty/Hypixel";
import {UnifiedMojang} from "../../thirdparty/UnifiedMojang";
import {UnifiedMojangResponse} from "../../thirdparty/UnifiedMojang/interfaces/response";
import {HypixelPlayer} from "../../thirdparty/Hypixel/classes/Player";
import {NoPlayerDataError} from "../../thirdparty/Hypixel/methods/player";
import {SkyblockProfileResponse} from "../../thirdparty/Hypixel/interfaces/SkyBlock/profile";
import {RandomLoadingMessage} from "../../util/RandomLoadingMessage";
import {NBT} from "@xmcl/nbt";
import * as TurndownService from "turndown";
import MinecraftTextJS from "minecraft-text-js";
import {MessageEmbed} from "discord.js";

const turndownService = new TurndownService();

interface ParseProfileTalismansResponse {
    api: {
        inventory: boolean;
    }
    id: string;
    cuteName: string;
    missing: string[];
    unnecessary: string[];
    duplicates: string[];
}

const talismans = [
    {
        id: 'FARMING_TALISMAN',
        name: 'Farming Talisman'
    },
    {
        id: 'VACCINE_TALISMAN',
        name: 'Vaccine Talisman'
    },
    {
        id: 'SPEED_TALISMAN',
        name: 'Speed Talisman'
    },
    {
        id: 'WOOD_TALISMAN',
        name: 'Wood Affinity Talisman'
    },
    {
        id: 'SKELETON_TALISMAN',
        name: 'Skeleton Talisman'
    },
    {
        id: 'COIN_TALISMAN',
        name: 'Talisman of Coins'
    },
    {
        id: 'MAGNETIC_TALISMAN',
        name: 'Magnetic Talisman'
    },
    {
        id: 'GRAVITY_TALISMAN',
        name: 'Gravity Talisman'
    },
    {
        id: 'VILLAGE_TALISMAN',
        name: 'Village Affinity Talisman'
    },
    {
        id: 'MINE_TALISMAN',
        name: 'Mine Affinity Talisman'
    },
    {
        id: 'NIGHT_VISION_CHARM',
        name: 'Night Vision Charm'
    },
    {
        id: 'LAVA_TALISMAN',
        name: 'Lava Talisman'
    },
    {
        id: 'SCAVENGER_TALISMAN',
        name: 'Scavenger Talisman'
    },
    {
        id: 'WOLF_PAW',
        name: 'Wolf Paw'
    },
    {
        id: 'FIRE_TALISMAN',
        name: 'Fire Talisman'
    },
    {
        id: 'BROKEN_PIGGY_BANK',
        name: 'Broken Piggy Bank'
    },
    {
        id: 'CRACKED_PIGGY_BANK',
        name: 'Cracked Piggy Bank'
    },
    {
        id: 'PIGGY_BANK',
        name: 'Piggy Bank'
    },
    {
        id: 'PIGS_FOOT',
        name: 'Pig\'s Foot'
    },
    {
        id: 'FROZEN_CHICKEN',
        name: 'Frozen Chicken'
    },
    {
        id: 'SPEED_RING',
        name: 'Speed Ring'
    },
    {
        id: 'FISH_AFFINITY_TALISMAN',
        name: 'Fish Affinity Talisman'
    },
    {
        id: 'FARMER_ORB',
        name: 'Farmer Orb'
    },
    {
        id: 'HASTE_RING',
        name: 'Haste Ring'
    },
    {
        id: 'NEW_YEAR_CAKE_BAG',
        name: 'New Year Cake Bag'
    },
    {
        id: 'NIGHT_CRYSTAL',
        name: 'Night Crystal'
    },
    {
        id: 'DAY_CRYSTAL',
        name: 'Day Crystal'
    },
    {
        id: 'FEATHER_ARTIFACT',
        name: 'Feather Artifact'
    },
    {
        id: 'ARTIFACT_POTION_AFFINITY',
        name: 'Potion Affinity Artifact'
    },
    {
        id: 'HEALING_RING',
        name: 'Healing Ring'
    },
    {
        id: 'CANDY_ARTIFACT',
        name: 'Candy Artifact'
    },
    {
        id: 'EXPERIENCE_ARTIFACT',
        name: 'Experience Artifact'
    },
    {
        id: 'MELODY_HAIR',
        name: '♪ Melody\'s Hair ♫'
    },
    {
        id: 'SEA_CREATURE_ARTIFACT',
        name: 'Sea Creature Artifact'
    },
    {
        id: 'INTIMIDATION_ARTIFACT',
        name: 'Intimidation Artifact'
    },
    {
        id: 'WOLF_RING',
        name: 'Wolf Ring'
    },
    {
        id: 'BAT_ARTIFACT',
        name: 'Bat Artifact'
    },
    {
        id: 'DEVOUR_RING',
        name: 'Devour Ring'
    },
    {
        id: 'ZOMBIE_ARTIFACT',
        name: 'Zombie Artifact'
    },
    {
        id: 'SPIDER_ARTIFACT',
        name: 'Spider Artifact'
    },
    {
        id: 'ENDER_ARTIFACT',
        name: 'Ender Artifact'
    },
    {
        id: 'TARANTULA_TALISMAN',
        name: 'Tarantula Talisman'
    },
    {
        id: 'SURVIVOR_CUBE',
        name: 'Survivor Cube'
    },
    {
        id: 'WITHER_ARTIFACT',
        name: 'Wither Artifact'
    },
    {
        id: 'WEDDING_RING_9',
        name: 'Legendary Ring of Love'
    },
    {
        id: 'RED_CLAW_ARTIFACT',
        name: 'Red Claw Artifact'
    },
    {
        id: 'BAIT_RING',
        name: 'Bait Ring'
    },
    {
        id: 'SEAL_OF_THE_FAMILY',
        name: 'Seal of the Family'
    },
    {
        id: 'HUNTER_RING',
        name: 'Hunter Ring'
    },
    {
        id: /CAMPFIRE_TALISMAN_2[1-9]/,
        name: 'Campfire God Badge'
    },
    {
        id: 'SPEED_ARTIFACT',
        name: 'Speed Artifact'
    }
];

const tiered_talismans = {
    BAT_RING: ['BAT_ARTIFACT'],
    BAT_TALISMAN: ['BAT_RING', 'BAT_ARTIFACT'],
    CANDY_RING: ['CANDY_ARTIFACT'],
    CANDY_TALISMAN: ['CANDY_RING', 'CANDY_ARTIFACT'],
    CROOKED_ARTIFACT: ['SEAL_OF_THE_FAMILY'],
    FEATHER_RING: ['FEATHER_ARTIFACT'],
    FEATHER_TALISMAN: ['FEATHER_RING', 'FEATHER_ARTIFACT'],
    HEALING_TALISMAN: ['HEALING_RING'],
    HUNTER_TALISMAN: ['HUNTER_RING'],
    INTIMIDATION_RING: ['INTIMIDATION_ARTIFACT'],
    INTIMIDATION_TALISMAN: ['INTIMIDATION_RING', 'INTIMIDATION_ARTIFACT'],
    POTION_AFFINITY_TALISMAN: ['RING_POTION_AFFINITY', 'ARTIFACT_POTION_AFFINITY'],
    RED_CLAW_RING: ['RED_CLAW_ARTIFACT'],
    RED_CLAW_TALISMAN: ['RED_CLAW_RING', 'RED_CLAW_ARTIFACT'],
    RING_POTION_AFFINITY: ['ARTIFACT_POTION_AFFINITY'],
    SEA_CREATURE_RING: ['SEA_CREATURE_ARTIFACT'],
    SEA_CREATURE_TALISMAN: ['SEA_CREATURE_RING', 'SEA_CREATURE_ARTIFACT'],
    SHADY_RING: ['CROOKED_ARTIFACT', 'SEAL_OF_THE_FAMILY'],
    // SPEED_TALISMAN: ['SPEED_RING', 'SPEED_ARTIFACT'],
    // SPEED_RING: ['SPEED_ARTIFACT'],
    SPIDER_RING: ['SPIDER_ARTIFACT'],
    SPIDER_TALISMAN: ['SPIDER_RING', 'SPIDER_ARTIFACT'],
    WOLF_TALISMAN: ['WOLF_RING'],
    ZOMBIE_RING: ['ZOMBIE_ARTIFACT'],
    ZOMBIE_TALISMAN: ['ZOMBIE_RING', 'ZOMBIE_ARTIFACT']
};

export default class Missing extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "missing",
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            aliases: ['missingaccessories', 'missingtalismans'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: 'List a user\'s missing, unnecessary, or duplicate accessories.',
            quotedStringSupport: false,
            usage: '<username:string> [profile:string]',
            usageDelim: ' ',
            extendedHelp: [
                'List a user\'s missing, unnecessary, or duplicate accessories on Hypixel\'s Skyblock.',
                '',
                'If you\'ve changed your API or accessories it might take up to a minute for it to reflect when you use the command.',
                '',
                'Examples ::',
                'missing RealMinecraftIGN',
                'missing RealMinecraftIGN Cucumber'
            ].join('\n')
        });

        this.customizeResponse('username', message => `:no_entry: **|** You must supply the Minecraft username you are checking! Run \`${message.guild ? message.guild.settings.get('prefix') : this.client.options.prefix} help missing\` for more instructions.`);
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
                promises.push(HypixelApi.SkyBlock.Profile.getByProfileId(data.stats.SkyBlock.profiles[key].profile_id))
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

        const profileTalismans: ParseProfileTalismansResponse[] = [];

        for (const profile of profiles) {
            if (!profile.success) continue;
            profileTalismans.push(await Missing.parseProfileTalismans(data.stats.SkyBlock.profiles[profile.profile.profile_id].cute_name, user.uuid, profile));
        }

        if (profileTalismans.length === 0) {
            return message.send(`:no_entry: **|** An unknown error occurred while querying data for \`${user.username}\`!`);
        }

        let allDisabled = true;
        let bestProfileTalisman: ParseProfileTalismansResponse = null;
        for (const profileTalisman of profileTalismans) {
            if (profileTalisman.api.inventory) {
                allDisabled = false;
                if (!bestProfileTalisman) bestProfileTalisman = profileTalisman;
                if (profileTalisman.missing.length < bestProfileTalisman.missing.length) bestProfileTalisman = profileTalisman;
            }
        }

        if (allDisabled) {
            if (specificProfile) {
                return message.send(`:no_entry: **|** \`${user.username}\` does not have their inventory API enabled on \`${data.stats.SkyBlock.profiles[profiles[0].profile.profile_id].cute_name}\`.`);
            } else {
                return message.send(`:no_entry: **|** \`${user.username}\` does not have their inventory API enabled on any profile.`);
            }
        }

        const embed = new MessageEmbed()
            .setAuthor(`${user.username}'s missing accessories on "${bestProfileTalisman.cuteName}"`, `https://visage.surgeplay.com/face/128/${user.uuid}`, `https://sky.lea.moe/stats/${user.username}/${bestProfileTalisman.cuteName}`)
            .setColor('#5f5ac6')
            .setThumbnail(`https://visage.surgeplay.com/full/128/${user.uuid}`);

        embed.setTitle(`Missing ${bestProfileTalisman.missing.length} out of ${talismans.length} accessories.`);

        const description = [];

        if (bestProfileTalisman.missing.length > 0) {
            description.push('**Missing Accessories**');
            for(const talismanName of bestProfileTalisman.missing) {
                description.push(`- ${talismanName}`);
            }
        }

        if (bestProfileTalisman.unnecessary.length > 0) {
            if (description.length > 0) description.push('');
            description.push('**Unnecessary Accessories**');
            for(const talismanName of bestProfileTalisman.unnecessary) {
                description.push(`- ${talismanName}`);
            }
            description.push('');
            description.push('Unnecessary accessories are accessories where you have a higher tier. As reforges no longer stack, lower tier accessories are unnecessary.');
        }

        if (bestProfileTalisman.duplicates.length > 0) {
            if (description.length > 0) description.push('');
            description.push('**Duplicate Accessories**');
            for(const talismanName of bestProfileTalisman.duplicates) {
                description.push(`- ${talismanName}`);
            }
        }

        if (description.length > 0) {
            embed.setDescription(description.join('\n'));
        } else {
            embed.setDescription(`Congrats! You have all the optimal accessories this bot is aware of with no duplicates or unnecessary accessories.`)
        }

        if (specificProfile) {
            embed.setFooter(`Data is for profile "${bestProfileTalisman.cuteName}".`);
        } else {
            embed.setFooter(`Selected profile "${bestProfileTalisman.cuteName}" as it had the least missing accessories.`);
        }

        return message.send(message.author, {embed});
    }

    private static async parseProfileTalismans(cuteName: string, memberUuid: string, profile: SkyblockProfileResponse): Promise<ParseProfileTalismansResponse> {
        const out: ParseProfileTalismansResponse = {
            api: {
                inventory: false
            },
            id: profile.profile.profile_id,
            cuteName,
            missing: [],
            unnecessary: [],
            duplicates: []
        };
        if (!profile.profile.members[memberUuid].inv_contents) {
            return out;
        }
        out.api.inventory = true;

        const profileMember = profile.profile.members[memberUuid];

        let inventoryTalismans: any[] = [];

        if (profileMember.inv_contents) {
            inventoryTalismans = inventoryTalismans.concat(await this.parseInventoryDataForTalismans(await NBT.Persistence.deserialize(Buffer.from(profileMember.inv_contents.data, 'base64'), {compressed: true})));
        }

        if (profileMember.ender_chest_contents) {
            inventoryTalismans = inventoryTalismans.concat(await this.parseInventoryDataForTalismans(await NBT.Persistence.deserialize(Buffer.from(profileMember.ender_chest_contents.data, 'base64'), {compressed: true})));
        }

        if (profileMember.talisman_bag) {
            inventoryTalismans = inventoryTalismans.concat(await this.parseInventoryDataForTalismans(await NBT.Persistence.deserialize(Buffer.from(profileMember.talisman_bag.data, 'base64'), {compressed: true})));
        }

        for (const talisman of talismans) {
            const talismanData = inventoryTalismans.find(i => i.tag.ExtraAttributes.id.match(talisman.id));
            if (!talismanData) {
                out.missing.push(talisman.name);
            }
        }

        for (const talismanId of Object.keys(tiered_talismans)) {
            const talisman = inventoryTalismans.find(i => i.tag.ExtraAttributes.id.match(talismanId));
            if (talisman) {
                let matchedHigher = false;
                for (const innerTalismandId of tiered_talismans[talismanId]) {
                    if (inventoryTalismans.find(i => i.tag.ExtraAttributes.id.match(innerTalismandId))) {
                        matchedHigher = true;
                    }
                }
                if (matchedHigher) {
                    out.unnecessary.push(this.parseItemName(talisman.tag.display.Name));
                }
            }
        }

        for (const i of inventoryTalismans) {
            if (inventoryTalismans.filter(ii => i.tag.ExtraAttributes.id === ii.tag.ExtraAttributes.id).length > 1) {
                const name = this.parseItemName(i.tag.display.Name);
                if (!out.duplicates.includes(name)) {
                    out.duplicates.push(name);
                }
            }
        }

        return out;
    }

    private static async parseInventoryDataForTalismans(data): Promise<any[]> {
        let talismans = [];
        for (const i of data.i) {
            if (!i || !i.tag || !i.tag.ExtraAttributes || !i.tag.ExtraAttributes.id || !i.tag.display || !i.tag.display.Lore) continue;
            switch (i.tag.ExtraAttributes.id) {
                case 'GREATER_BACKPACK':
                    if (i.tag.ExtraAttributes.greater_backpack_data) {
                        talismans = talismans.concat(await this.parseInventoryDataForTalismans(await NBT.Persistence.deserialize(Buffer.from(i.tag.ExtraAttributes.greater_backpack_data), {compressed: true})));
                    }
                    break;
                case 'LARGE_BACKPACK':
                    if (i.tag.ExtraAttributes.large_backpack_data) {
                        talismans = talismans.concat(await this.parseInventoryDataForTalismans(await NBT.Persistence.deserialize(Buffer.from(i.tag.ExtraAttributes.large_backpack_data), {compressed: true})));
                    }
                    break;
                case 'MEDIUM_BACKPACK':
                    if (i.tag.ExtraAttributes.medium_backpack_data) {
                        talismans = talismans.concat(await this.parseInventoryDataForTalismans(await NBT.Persistence.deserialize(Buffer.from(i.tag.ExtraAttributes.medium_backpack_data), {compressed: true})));
                    }
                    break;
                case 'SMALL_BACKPACK':
                    if (i.tag.ExtraAttributes.small_backpack_data) {
                        talismans = talismans.concat(await this.parseInventoryDataForTalismans(await NBT.Persistence.deserialize(Buffer.from(i.tag.ExtraAttributes.small_backpack_data), {compressed: true})));
                    }
                    break;
                default:
                    if (i.tag.display.Lore[i.tag.display.Lore.length - 1].includes('ACCESSORY')) {
                        talismans.push(i);
                    }
                    break;
            }
        }
        return talismans;
    }

    private static parseItemName(name: string) {
        name = turndownService.turndown(MinecraftTextJS.toHTML(name)).replace('���', '♪').replace('���', '♫');
        return name;
    }
};
