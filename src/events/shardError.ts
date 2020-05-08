import {Event} from "klasa";

export default class extends Event {
    async run(error, shardID) {
        this.client.console.error(`[${shardID}]:`, error);
    }
}
