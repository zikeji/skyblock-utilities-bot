import {Command, CommandStore, KlasaClient, KlasaMessage} from "klasa";
import {promisify} from "util";
import {exec as execCb} from "child_process";

const exec = promisify(execCb);
const sleep = promisify(setTimeout);

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            permissionLevel: 10,
            usage: '[branch:string]',
            deletable: false
        });
    }

    public async run(message: KlasaMessage, [branch = 'master']: [string?]): Promise<any> {
        await this.fetch(message, branch);
        await this.updateDependencies(message);
        await this.compile(message);
    }

    private async compile(message: KlasaMessage) {
        const {stderr, code} = await this.exec('cd ../../ && npm run build');
        if (code !== 0 && stderr.length) throw stderr.trim();
        return message.channel.send(`:white_check_mark: Successfully compiled.`);
    }

    private async updateDependencies(message: KlasaMessage) {
        const {stderr, code} = await this.exec('cd ../../ && npm ci');
        if (code !== 0 && stderr.length) throw stderr.trim();
        return message.channel.send(`:white_check_mark: Successfully updated dependencies.`);
    }

    private async fetch(message: KlasaMessage, branch: string) {
        await this.exec('cd ../../ && git fetch');
        const {stdout, stderr} = await exec(`cd ../../ && git pull origin ${branch}`);

        // If it's up to date, do nothing
        if (/already up[ \-]to[ \-]date/i.test(stdout)) throw `:white_check_mark: Up to date.`;

        // If it was not a successful pull, return the output
        if (!this.isSuccessfulPull(stdout)) {
            // If the pull failed because it was in a different branch, run checkout
            if (!await this.isCurrentBranch(branch)) {
                return this.checkout(message, branch);
            }

            // If the pull failed because local changes, run a stash
            if (this.needsStash(stdout + stderr)) return this.stash(message);
        }

        // For all other cases, return the original output
        return message.send([stdout.substr(100, 1800) || ':white_check_mark:', stderr.substr(0, 100) || ':white_check_mark:'].join('\n-=-=-=-\n'), {code: 'prolog'});
    }

    private async stash(message: KlasaMessage) {
        await message.send('Unsuccessful pull, stashing...');
        await sleep(1000);
        const {stdout, stderr} = await this.exec(`cd ../../ && git stash`);
        if (!this.isSuccessfulStash(stdout + stderr)) {
            throw `Unsuccessful pull, stashing:\n\n\`\`\`prolog\n${[stdout || '✔', stderr || '✔'].join('\n-=-=-=-\n')}\`\`\``;
        }

        return message.send([stdout.substr(0, 1800) || '✔', stderr.substr(0, 100) || '✔'].join('\n-=-=-=-\n'), {code: 'prolog'});
    }

    private async checkout(message: KlasaMessage, branch: string) {
        await message.send(`Switching to ${branch}...`);
        await this.exec(`cd ../../ && git checkout ${branch}`);
        return message.send(`:white_check_mark: Switched to ${branch}.`);
    }

    private async isCurrentBranch(branch: string) {
        const {stdout} = await this.exec('cd ../../ && git symbolic-ref --short HEAD');
        return stdout === `refs/heads/${branch}\n` || stdout === `${branch}\n`;
    }

    private isSuccessfulPull(output: string) {
        return /\d+\s*file\s*changed,\s*\d+\s*insertions?\([+-]\),\s*\d+\s*deletions?\([+-]\)/.test(output);
    }

    private isSuccessfulStash(output: string) {
        return output.includes('Saved working directory and index state WIP on');
    }

    private needsStash(output: string) {
        return output.includes('Your local changes to the following files would be overwritten by merge');
    }

    private async exec(script: string) {
        try {
            const result = await exec(script);
            return {...result, code: 0};
        } catch (error) {
            return {stdout: '', stderr: error.message || error || '', code: error.code};
        }
    }
};
