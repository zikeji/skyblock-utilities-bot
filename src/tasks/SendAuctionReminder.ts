import * as prettyMilliseconds from "pretty-ms";
import {SkyBlockZUtilitiesTask} from "../lib/structures/SkyBlockZUtilitiesTask";

export default class SendAuctionReminder extends SkyBlockZUtilitiesTask {
    async run({userId, auctioneer, title, ends}: { userId: string, auctioneer: string; title: string, ends: number }) {
        try {
            const user = this.client.users.cache.get(userId);
            if (user) {
                await user.send(`**Hello!** You asked me to remind you of the auction "${title}" (by \`${auctioneer}\`) that ends in ${prettyMilliseconds(new Date(ends).getTime() - new Date().getTime(), {secondsDecimalDigits: 0})}.`);
            }
        } catch (e) {
            this.client.console.error(`${this.shardHeader} Error in SendAuctionReminder.`, e);
        }
    }
}
