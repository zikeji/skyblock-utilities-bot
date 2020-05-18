import {Colors, Event} from "klasa";

export default class extends Event {
    async run(e: Error | string) {
        if (e instanceof Error) {
            this.client.console.error(`${new Colors({text: 'red'}).format('[CLIENT ERROR]')} ${e.name} ${e.message}`, e.stack);
        } else {
            this.client.console.error(`${new Colors({text: 'red'}).format('[CLIENT ERROR]')} ${e}`);
        }
    }
};
