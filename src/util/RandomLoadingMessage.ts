export class RandomLoadingMessage {
    private static messages: string[] = [
        `<a:loading:707345706578477086> **|** Please wait, the Pony Express is fetching your results.`,
        `<a:loading:707345706578477086> **|** Our detectives are looking into this for you.`,
        `<a:loading:707345706578477086> **|** Please wait while we fetch your results!`,
        `<a:loading:707345706578477086> **|** Please wait while we work on this!`,
        `<a:loading:707345706578477086> **|** Please wait while we analyze this. :microscope:...`,
        `<a:loading:707345706578477086> **|** Please wait, I swear I'm not judging you.`,
        `<a:loading:707345706578477086> **|** Please wait, I'm handling this request.`,
        `<a:loading:707345706578477086> **|** Please wait, we're bringing that up for you.`,
        `<a:loading:707345706578477086> **|** Please wait, the minions are busy processing paperwork. :file_folder:`
];

    public static get() {
        return RandomLoadingMessage.messages[Math.floor(Math.random() * RandomLoadingMessage.messages.length)];
    }
}
