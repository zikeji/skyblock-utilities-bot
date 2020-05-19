import {Event, EventOptions, EventStore, KlasaClient, Colors} from "klasa";

export abstract class SkyBlockZUtilitiesEvent extends Event {
    readonly shardHeader: string;

    protected constructor(client: KlasaClient, store: EventStore, file: string[], directory: string, options?: EventOptions) {
        super(client, store, file, directory, options);
        this.shardHeader = new Colors({background: 'lightgray', text: 'black'}).format(`[Shard ${this.client.shard.ids[0]}]`)
    }
}
