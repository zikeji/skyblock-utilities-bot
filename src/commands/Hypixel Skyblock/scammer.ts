import {json} from "web-request";
import {cache} from "../../cache";
import {Command, CommandStore, KlasaMessage} from "klasa";
import {UnifiedMojang} from "../../lib/thirdparty/UnifiedMojang";
import {UnifiedMojangResponse} from "../../lib/thirdparty/UnifiedMojang/interfaces/response";
import AddShutdownNotice from '../../lib/util/AddShutdownNotice';
import {RandomLoadingMessage} from "../../lib/util/RandomLoadingMessage";
import {MessageEmbed} from "discord.js";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";

interface ScammerList {
    [key: string]: {
        operated_staff: string;
        reason: string;
        uuid: string;
    }
}

export default class extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "scammer",
            enabled: true,
            runIn: ['text', 'dm'],
            aliases: ['scmr'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: 'Check a user against the SkyBlockZ Discord\'s scammer database.',
            quotedStringSupport: false,
            usage: '<username:string>',
            usageDelim: ' ',
            extendedHelp: [
                '[PREFIX_COMMAND] RealMinecraftIGN'
            ].join('\n')
        });

        this.customizeResponse('username', message => `:no_entry: **|** You must supply the Minecraft username you are checking! Run \`${this.client.prefixCommand('help scammer', message)}\` for more instructions.`);
    }


    async run(message: KlasaMessage, [username]: [string, string | null]): Promise<any> {
        let user: UnifiedMojangResponse;

        await message.send(RandomLoadingMessage.get());

        try {
            user = await UnifiedMojang.user(username);
        } catch (e) {
            return await message.send(`:no_entry: **|** \`${username}\` is invalid or does not exist!`);
        }

        const scammerList: ScammerList = await cache.wrap(`scammer-list`, () => {
            return json<ScammerList>(`https://raw.githubusercontent.com/skyblockz/pricecheckbot/master/scammer.json`);
        }, {ttl: 120});

        const embed = new MessageEmbed()
            .setThumbnail(`https://visage.surgeplay.com/full/128/${user.uuid}`)
            .setFooter(AddShutdownNotice());

        if (scammerList[user.uuid]) {
            embed
                .setColor('#ff0000')
                .setTitle(`${user.username} is a known scammer!`)
                .setDescription(['**Caution!** This user was found in the scammer database!',
                    '',
                    '**Reason:**',
                    scammerList[user.uuid].reason,
                    '',
                    '_Data courtesy of [SkyBlockZ](https://discord.gg/skyblock) and [RobotHanzo](https://patreon.com/robothanzo)._'
                ].join('\n'));
        } else {
            embed
                .setColor('#00ff00')
                .setTitle(`${user.username} is not a known scammer.`)
                .setDescription(['This user was not found in the scammer database.',
                    '',
                    '**Please Note:**',
                    'This does not mean they are safe to trade with! It just means they are not a known scammer. Always use safe trading methods or get a trustworthy middleman.',
                    '',
                    '_Data courtesy of [SkyBlockZ](https://discord.gg/skyblock) and [RobotHanzo](https://patreon.com/robothanzo)._'
                ].join('\n'));
        }

        return message.send(message.author, {embed});
    }
};
