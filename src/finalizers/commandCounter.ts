import {Finalizer, KlasaMessage} from "klasa";
import {SkyblockUtilitiesClient} from "../lib/structures/SkyblockUtilitiesClient";

export default class extends Finalizer {
    public readonly client: SkyblockUtilitiesClient;

    async run (message: KlasaMessage) {
        const cmds = this.client.health.commands.temp;
        if (!cmds[message.command.name]) cmds[message.command.name] = 0;
        cmds[message.command.name] += 1;
        this.client.health.commands.temp.count += 1;

        const config = this.client.settings;
        const cmd = message.command.name;
        let count = config.get<any[]>('counter.commands').find(c => c.name === cmd);
        let index = config.get<any[]>('counter.commands').findIndex(c => c.name === cmd);
        if (index === -1) {
            count = { name: cmd, count: 0 };
            index = null;
        }

        await config.update("counter.total", config.get<number>('counter.total') + 1);
        await config.update("counter.commands", { name: cmd, count: count.count + 1 }, { arrayPosition: index });
    }
}
