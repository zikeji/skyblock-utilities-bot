import {HypixelApi} from "../../thirdparty/Hypixel";
import {SkyBlockProfileCollection, SkyblockProfileResponse} from "../../thirdparty/Hypixel/interfaces/SkyBlock/profile";
import {union, assign} from "lodash";
import {SkillLevelInfo, SkillLeveling} from "./SkyBlock/SkillLeveling";
import {HypixelPlayer} from "../../thirdparty/Hypixel/classes/Player";

const CRAFTED_GENERATOR_REGEX = /(.+?)_\d{1,2}/;

export interface GetAllProfilesAndMergeImportantResponse {
    hasPlayedSkyblock: boolean;
    warnings: string[];
    player: HypixelPlayer;
    friends: number;
    isInHypixelGuild: boolean;
    isInHypixelSweatGuild: boolean;
    current_max_bank: number;
    slayer_bosses: {
        [key: string]: {
            claimed_levels: {
                [key: string]: boolean
            }
        }
    };
    unique_minions_crafted: number;
    runecrafting: SkillLevelInfo;
    combat: SkillLevelInfo;
    mining: SkillLevelInfo;
    alchemy: SkillLevelInfo;
    farming: SkillLevelInfo;
    enchanting: SkillLevelInfo;
    fishing: SkillLevelInfo;
    foraging: SkillLevelInfo;
    carpentry: SkillLevelInfo;
    unlocked_coll_tiers: string[];
    collection: SkyBlockProfileCollection;
    fairy_souls_collected: number;
}

const skillsMap = {
    runecrafting: 'experience_skill_runecrafting',
    combat: 'experience_skill_combat',
    mining: 'experience_skill_mining',
    alchemy: 'experience_skill_alchemy',
    farming: 'experience_skill_farming',
    enchanting: 'experience_skill_enchanting',
    fishing: 'experience_skill_fishing',
    foraging: 'experience_skill_foraging',
    carpentry: 'experience_skill_carpentry'
};

export async function GetAllProfilesAndMergeImportant(uuid: string, hypixel_guild_id?: string, hypixel_guild_sweat_id?: string): Promise<GetAllProfilesAndMergeImportantResponse> {
    const playerCall = HypixelApi.Player.getByUuid(uuid);
    const friendsCall = HypixelApi.Friends.getByUuid(uuid);
    let [player, friends] = [await playerCall, await friendsCall];

    const response: GetAllProfilesAndMergeImportantResponse = {
        hasPlayedSkyblock: true,
        warnings: [],
        player: player,
        friends: friends.records ? friends.records.length : 0,
        isInHypixelGuild: false,
        isInHypixelSweatGuild: false,
        current_max_bank: 0,
        slayer_bosses: {},
        unique_minions_crafted: 0,
        runecrafting: SkillLeveling.getLevelByXp(0, true),
        combat: SkillLeveling.getLevelByXp(0, true),
        mining: SkillLeveling.getLevelByXp(0, true),
        alchemy: SkillLeveling.getLevelByXp(0, true),
        farming: SkillLeveling.getLevelByXp(0, true),
        enchanting: SkillLeveling.getLevelByXp(0, true),
        fishing: SkillLeveling.getLevelByXp(0, true),
        foraging: SkillLeveling.getLevelByXp(0, true),
        carpentry: SkillLeveling.getLevelByXp(0, true),
        unlocked_coll_tiers: [],
        collection: {},
        fairy_souls_collected: 0
    };

    if (hypixel_guild_id) {
        const guildResponse = await HypixelApi.Guild.getByUuid(hypixel_guild_id);

        if (guildResponse.success && guildResponse.guild && guildResponse.guild.members.length > 0) {
            response.isInHypixelGuild = guildResponse.guild.members.some(guildMember => guildMember.uuid === response.player.uuid);
        }
    }

    if (hypixel_guild_sweat_id) {
        const guildResponse = await HypixelApi.Guild.getByUuid(hypixel_guild_sweat_id);

        if (guildResponse.success && guildResponse.guild && guildResponse.guild.members.length > 0) {
            response.isInHypixelSweatGuild = guildResponse.guild.members.some(guildMember => guildMember.uuid === response.player.uuid);
        }
    }

    const promises = [];
    if (player.stats && player.stats.SkyBlock && player.stats.SkyBlock.profiles) {
        for (const profileId of Object.keys(player.stats.SkyBlock.profiles)) {
            promises.push(HypixelApi.SkyBlock.Profile.getByProfileId(profileId).catch(() => {
                response.warnings.push(`Profile \`${player.stats.SkyBlock.profiles[profileId].cute_name}\` could not be fetched.`);
            }));
        }
    } else {
        // no profiles alert staff
        response.hasPlayedSkyblock = false;
    }

    const results: SkyblockProfileResponse[] = await Promise.all(promises);

    for (const result of results) {
        if (!result || !result.profile || !result.profile.members[uuid]) {
            continue;
        }
        const profile = result.profile.members[uuid];
        const profileName = response.player.stats.SkyBlock.profiles[result.profile.profile_id].cute_name;

        if (!profile.collection) {
            profile.collection = {};
        }

        if (!profile.slayer_bosses) {
            profile.slayer_bosses = {};
        }

        if (result.profile.banking && result.profile.banking.balance > response.current_max_bank) {
            response.current_max_bank = result.profile.banking.balance;
        }

        // get max slayer boss levels
        for (const bossType of Object.keys(profile.slayer_bosses)) {
            if (!response.slayer_bosses[bossType]) {
                response.slayer_bosses[bossType] = {
                    claimed_levels: {}
                };
            }
            if (profile.slayer_bosses[bossType] && profile.slayer_bosses[bossType].claimed_levels) {
                response.slayer_bosses[bossType].claimed_levels = assign(response.slayer_bosses[bossType].claimed_levels, profile.slayer_bosses[bossType].claimed_levels);
            }
        }

        // get max runecrafting and carpentry levels
        let skillsApiEnabled = false;
        for (const skillName of Object.keys(skillsMap)) {
            if (profile[skillsMap[skillName]]) {
                skillsApiEnabled = true;
                const skillLevel = SkillLeveling.getLevelByXp(profile[skillsMap[skillName]], skillName === 'runecrafting');
                if (skillLevel.xp > response[skillName].xp) {
                    response[skillName] = skillLevel;
                }
            }
        }

        // get all collection tiers unlocked
        let collectionsApiEnabled = false;
        if (profile.unlocked_coll_tiers) {
            collectionsApiEnabled = true;
            response.unlocked_coll_tiers = union(response.unlocked_coll_tiers, profile.unlocked_coll_tiers);
        }

        // merge all member profile collection values into totals (if exists)
        for (const memberUuid of Object.keys(result.profile.members)) {
            if (memberUuid === uuid) {
                continue;
            }
            const member = result.profile.members[memberUuid];
            if (member.collection) {
                for (const name of Object.keys(member.collection)) {
                    if (!profile.collection[name]) {
                        profile.collection[name] = 0;
                    }
                    profile.collection[name] += member.collection[name];
                }
            }
        }

        // get max minion levels
        const unique_minions_crafted = [];
        for (const profileMemberUuid in result.profile.members) {
            const profile = result.profile.members[profileMemberUuid];
            if (profile.crafted_generators) {
                for (const generator of profile.crafted_generators) {
                    const result = CRAFTED_GENERATOR_REGEX.exec(generator);
                    if (result.length > 0) {
                        const minion = result[1];
                        if (!unique_minions_crafted.includes(minion)) {
                            unique_minions_crafted.push(minion);
                        }
                    }
                }
            }
        }
        if (unique_minions_crafted.length > response.unique_minions_crafted) {
            response.unique_minions_crafted = unique_minions_crafted.length;
        }

        // add only the greater value to the response collection
        if (profile.collection) {
            for (const name of Object.keys(profile.collection)) {
                if (!response.collection[name]) {
                    response.collection[name] = 0;
                }
                if (profile.collection[name] > response.collection[name]) {
                    response.collection[name] = profile.collection[name];
                }
            }
        }

        // get max fairy souls
        if (profile.fairy_souls_collected && profile.fairy_souls_collected > response.fairy_souls_collected) {
            response.fairy_souls_collected = profile.fairy_souls_collected;
        }

        if (!skillsApiEnabled || !collectionsApiEnabled) {
            response.warnings.push(`Profile \`${profileName}\` doesn't have the ${!skillsApiEnabled ? 'skills API' : ''}${!collectionsApiEnabled ? !skillsApiEnabled ? ' and collections API' : 'collections API' : ''} enabled.`);
        }
    }

    return response;
}
