import {Event} from "klasa";

export default class extends Event {
    async run() {
        if (!this.client.settings.get('schedules').some(task => task.taskName === "health")) {
            await this.client.schedule.create("health", "* * * * *");
        }

        if (!this.client.settings.get('schedules').some(task => task.taskName === "dbl")) {
            await this.client.schedule.create("dbl", "*/20 * * * *");
        }

        this.client.console.log(`[${this.client.shard.id}]: Online`);
    }
}
