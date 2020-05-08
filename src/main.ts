import {BaseCluster} from "kurasuta";
import {Colors} from "klasa";

export default class extends BaseCluster {
    launch() {
        const red = new Colors({text: 'red'});
        this.client.on('error', e => {
            this.client.console.error(`${red.format('[DISCORD ERROR]')} ${e.name} ${e.message}`);
        });

        return new Promise<void>((resolve, reject) => {
            this.client.login(process.env.BOT_TOKEN)
                .then(() => resolve())
                .catch(reject);
        });
    }
}
