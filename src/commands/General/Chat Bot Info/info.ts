import {Command, CommandStore, KlasaClient} from "klasa";

export default class extends Command {
	constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
		super(client, store, file, directory, {
			enabled: false
		});
	}
};
