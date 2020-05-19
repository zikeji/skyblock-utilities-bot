import {SkyBlockZUtilitiesEvent} from "../lib/structures/SkyBlockZUtilitiesEvent";

export default class extends SkyBlockZUtilitiesEvent {
    async run() {
        this.client.console.warn(`${this.shardHeader} Reconnected`);
    }
}
