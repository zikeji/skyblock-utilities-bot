import { Task } from 'klasa';
import {SkyblockUtilitiesClient} from "../lib/structures/SkyblockUtilitiesClient";

export default class extends Task {
    public readonly client: SkyblockUtilitiesClient;

    async run() {
        this.client.health.commands.cmdCount.shift();
        this.client.health.commands.cmdCount.push(this.client.health.commands.temp);
        this.client.health.commands.temp = {
            count: 0,
            ran: {}
        };
    }
};
