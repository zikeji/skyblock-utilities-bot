import {Colors, Event} from "klasa";

export default class extends Event {
    async run(e: string) {
        this.client.console.error(`${new Colors({text: 'warning'}).format('[CLIENT WARN]')} ${e}`);
    }
};
