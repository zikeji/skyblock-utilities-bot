import {SkyblockProfile} from "../../../thirdparty/Hypixel/interfaces/SkyBlock/profile";
import {UnifiedMojangResponse} from "../../../thirdparty/UnifiedMojang/interfaces/response";
import {SkillLevelInfo, SkillLeveling} from "./SkillLeveling";
import {HypixelPlayer} from "../../../thirdparty/Hypixel/classes/Player";

export interface SkillData {
    profile_id: string;
    api: boolean;
    average: number;
    averageWithoutProgress: number;
    farming: SkillLevelInfo;
    mining: SkillLevelInfo;
    combat: SkillLevelInfo;
    foraging: SkillLevelInfo;
    fishing: SkillLevelInfo;
    enchanting: SkillLevelInfo;
    alchemy: SkillLevelInfo;
    carpentry: SkillLevelInfo;
    runecrafting: SkillLevelInfo;
    taming: SkillLevelInfo;
}

export class SkyblockSkills {
    public static computeSkills(user: UnifiedMojangResponse, player: HypixelPlayer, profile: SkyblockProfile): SkillData | null {
        let out: SkillData;
        if (profile.members[user.uuid].experience_skill_farming >= 0) {
            out = {
                profile_id: profile.profile_id,
                api: true,
                average: null,
                averageWithoutProgress: null,
                farming: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_farming, false),
                mining: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_mining, false),
                combat: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_combat, false),
                foraging: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_foraging, false),
                fishing: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_fishing, false),
                enchanting: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_enchanting, false),
                alchemy: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_alchemy, false),
                carpentry: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_carpentry, false),
                runecrafting: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_runecrafting, true),
                taming: SkillLeveling.getLevelByXp(profile.members[user.uuid].experience_skill_taming, false)
            };
        } else {
            out = {
                profile_id: profile.profile_id,
                api: false,
                average: null,
                averageWithoutProgress: null,
                farming: SkillLeveling.getLevelByXp(player.achievements.skyblock_harvester ? SkillLeveling.leveling_xp[player.achievements.skyblock_harvester] : 0, false),
                mining: SkillLeveling.getLevelByXp(player.achievements.skyblock_excavator ? SkillLeveling.leveling_xp[player.achievements.skyblock_excavator] : 0, false),
                combat: SkillLeveling.getLevelByXp(player.achievements.skyblock_combat ? SkillLeveling.leveling_xp[player.achievements.skyblock_combat] : 0, false),
                foraging: SkillLeveling.getLevelByXp(player.achievements.skyblock_gatherer ? SkillLeveling.leveling_xp[player.achievements.skyblock_gatherer] : 0, false),
                fishing: SkillLeveling.getLevelByXp(player.achievements.skyblock_angler ? SkillLeveling.leveling_xp[player.achievements.skyblock_angler] : 0, false),
                enchanting: SkillLeveling.getLevelByXp(player.achievements.skyblock_augmentation ? SkillLeveling.leveling_xp[player.achievements.skyblock_augmentation] : 0, false),
                alchemy: SkillLeveling.getLevelByXp(player.achievements.skyblock_concoctor ? SkillLeveling.leveling_xp[player.achievements.skyblock_concoctor] : 0, false),
                carpentry: SkillLeveling.getLevelByXp(0, false),
                runecrafting: SkillLeveling.getLevelByXp(0, true),
                taming: SkillLeveling.getLevelByXp(0, false)
            };
        }
        out.average = Math.round(((out.farming.levelProgress + out.mining.levelProgress + out.combat.levelProgress + out.foraging.levelProgress + out.fishing.levelProgress + out.enchanting.levelProgress + out.alchemy.levelProgress + out.taming.levelProgress) / 8) * 100) / 100;
        out.averageWithoutProgress = Math.round(((out.farming.level + out.mining.level + out.combat.level + out.foraging.level + out.fishing.level + out.enchanting.level + out.alchemy.level + out.taming.level) / 8) * 100) / 100;
        return out;
    }
}
