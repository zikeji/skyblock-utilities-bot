import {BaseCluster} from "kurasuta";

export default class extends BaseCluster {
    launch() {
        return new Promise<void>((resolve, reject) => {
            this.client.login(process.env.BOT_TOKEN)
                .then(() => resolve())
                .catch(reject);
        });
    }
}
