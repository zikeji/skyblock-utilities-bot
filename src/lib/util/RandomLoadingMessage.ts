import {SkyBlockZUtilitiesClient} from "../structures/SkyBlockZUtilitiesClient";

export class RandomLoadingMessage {
    private static messages: string[] = [
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait, the Pony Express is fetching your results.`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Our detectives are looking into this for you.`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait while we fetch your results!`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait while we work on this!`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait while we analyze this. :microscope:...`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait, I swear I'm not judging you.`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait, I'm handling this request.`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait, we're bringing that up for you.`,
        `${SkyBlockZUtilitiesClient.emotes.loading} **|** Please wait, the minions are busy processing paperwork. :file_folder:`
];

    public static get() {
        return RandomLoadingMessage.messages[Math.floor(Math.random() * RandomLoadingMessage.messages.length)];
    }
}
