import {Event} from "klasa";

export default class extends Event {
    async run() {
        if (!this.client.settings.get('schedules').some(task => task.taskName === "health")) {
            await this.client.schedule.create("health", "* * * * *");
        }

        this.client.console.log(`[${this.client.shard.id}]: Online`);
    }
}
