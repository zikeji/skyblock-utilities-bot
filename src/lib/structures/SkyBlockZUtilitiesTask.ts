import {KlasaClient, Colors, Task, TaskStore, TaskOptions} from "klasa";
import {SkyBlockZUtilitiesClient} from "./SkyBlockZUtilitiesClient";

export abstract class SkyBlockZUtilitiesTask extends Task {
    public readonly client: SkyBlockZUtilitiesClient;
    readonly shardHeader: string;

    protected constructor(client: KlasaClient, store: TaskStore, file: string[], directory: string, options?: TaskOptions) {
        super(client, store, file, directory, options);
        this.shardHeader = new Colors({background: 'cyan', text: 'white'}).format(`[${this.client.shard.ids[0]}]`)
    }
}
