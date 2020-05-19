import {Colors} from "klasa";
import {SkyBlockZUtilitiesEvent} from "../lib/structures/SkyBlockZUtilitiesEvent";

export default class extends SkyBlockZUtilitiesEvent {
    async run(e: Error | string) {
        if (e instanceof Error) {
            this.client.console.error(`${this.shardHeader} ${new Colors({text: 'red'}).format('[CLIENT ERROR]')} ${e.name} ${e.message}`, e.stack);
        } else {
            this.client.console.error(`${this.shardHeader} ${new Colors({text: 'red'}).format('[CLIENT ERROR]')} ${e}`);
        }
    }
};
