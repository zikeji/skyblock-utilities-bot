import {SkyBlockZUtilitiesEvent} from "../lib/structures/SkyBlockZUtilitiesEvent";

export default class extends SkyBlockZUtilitiesEvent {
    async run(error) {
        this.client.console.error(`${this.shardHeader}`, error);
    }
}
