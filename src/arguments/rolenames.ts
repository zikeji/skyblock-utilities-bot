import {ArgumentStore, KlasaClient, MultiArgument} from "klasa";

export default class RoleNamesArgument extends MultiArgument {
    constructor(client: KlasaClient, store: ArgumentStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            aliases: ['...rolename']
        });
    }

    get base() {
        return this.store.get('rolename');
    }
}
