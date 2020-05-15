import { Task } from 'klasa';
import {SkyBlockZUtilitiesClient} from "../lib/structures/SkyBlockZUtilitiesClient";

export default class extends Task {
    public readonly client: SkyBlockZUtilitiesClient;

    async run() {
        this.client.health.commands.cmdCount.shift();
        this.client.health.commands.cmdCount.push(this.client.health.commands.temp);
        this.client.health.commands.temp = {
            count: 0,
            ran: {}
        };
    }
};
