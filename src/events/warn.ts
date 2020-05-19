import {Colors} from "klasa";
import {SkyBlockZUtilitiesEvent} from "../lib/structures/SkyBlockZUtilitiesEvent";

export default class extends SkyBlockZUtilitiesEvent {
    async run(e: string) {
        this.client.console.error(`${this.shardHeader} ${new Colors({text: 'warning'}).format('[CLIENT WARN]')} ${e}`);
    }
};
