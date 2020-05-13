import {SkyblockProfile, SkyblockProfileResponse} from "../../../thirdparty/Hypixel/interfaces/SkyBlock/profile";

export abstract class ProfilePicker {
    static ByLastSave(profiles: SkyblockProfileResponse[], memberUuid: string): SkyblockProfile | null {
        let outProfile: SkyblockProfile;

        for (const profile of profiles) {
            if (!profile.success || !profile.profile) continue;
            if (!outProfile) outProfile = profile.profile;

            if (profile.profile.members[memberUuid].last_save > outProfile.members[memberUuid].last_save) {
                outProfile = profile.profile;
            }
        }

        return outProfile;
    }
}
