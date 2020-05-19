import {SkyBlockZUtilitiesEvent} from "../lib/structures/SkyBlockZUtilitiesEvent";

export default class extends SkyBlockZUtilitiesEvent {
    async run() {
        if (!this.client.settings.get('schedules').some(task => task.taskName === "health")) {
            await this.client.schedule.create("health", "* * * * *");
        }

        if (!this.client.settings.get('schedules').some(task => task.taskName === "dbl")) {
            await this.client.schedule.create("dbl", "*/20 * * * *");
        }

        this.client.console.log(`${this.shardHeader} Online, serving ${this.client.guilds.cache.size} guilds.`);
    }
}
