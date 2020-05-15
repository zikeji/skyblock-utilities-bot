import {Task, TaskStore} from "klasa";
import * as prettyMilliseconds from "pretty-ms";
import {SkyBlockZUtilitiesClient} from "../lib/structures/SkyBlockZUtilitiesClient";

export default class SendAuctionReminder extends Task {
    public readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: TaskStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: 'SendAuctionReminder',
            enabled: true
        });
    }

    async run({userId, auctioneer, title, ends}: { userId: string, auctioneer: string; title: string, ends: number }) {
        try {
            const user = this.client.users.cache.get(userId);
            if (user) {
                await user.send(`**Hello!** You asked me to remind you of the auction "${title}" (by \`${auctioneer}\`) that ends in ${prettyMilliseconds(new Date(ends).getTime() - new Date().getTime(), {secondsDecimalDigits: 0})}.`);
            }
        } catch (e) {
            this.client.console.error(`Error in SendAuctionReminder. ${e}`);
        }
    }
}
