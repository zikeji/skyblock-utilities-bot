import {SkyBlockZUtilitiesTask} from "../lib/structures/SkyBlockZUtilitiesTask";

export default class extends SkyBlockZUtilitiesTask {
    async run() {
        this.client.health.commands.cmdCount.shift();
        this.client.health.commands.cmdCount.push(this.client.health.commands.temp);
        this.client.health.commands.temp = {
            count: 0,
            ran: {}
        };
    }
};
