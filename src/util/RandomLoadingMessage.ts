import {SkyblockUtilitiesClient} from "../lib/structures/SkyblockUtilitiesClient";

export class RandomLoadingMessage {
    private static messages: string[] = [
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait, the Pony Express is fetching your results.`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Our detectives are looking into this for you.`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait while we fetch your results!`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait while we work on this!`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait while we analyze this. :microscope:...`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait, I swear I'm not judging you.`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait, I'm handling this request.`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait, we're bringing that up for you.`,
        `${SkyblockUtilitiesClient.emotes.loading} **|** Please wait, the minions are busy processing paperwork. :file_folder:`
];

    public static get() {
        return RandomLoadingMessage.messages[Math.floor(Math.random() * RandomLoadingMessage.messages.length)];
    }
}
