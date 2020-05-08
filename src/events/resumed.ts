import {Event} from "klasa";

export default class extends Event {
    async run() {
        this.client.console.warn(`[${this.client.shard.id}]: Reconnected`);
    }
}
