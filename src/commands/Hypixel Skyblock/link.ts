import {Command, CommandStore, KlasaMessage} from "klasa";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";
import {MessageEmbed, TextChannel} from "discord.js";
import {json} from "web-request";
import {UnifiedMojangResponse} from "../../lib/thirdparty/UnifiedMojang/interfaces/response";
import {UnifiedMojang} from "../../lib/thirdparty/UnifiedMojang";
import {HypixelApi} from "../../lib/thirdparty/Hypixel";
import {HypixelKeyResponse} from "../../lib/thirdparty/Hypixel/interfaces/key";
import {HypixelPlayer} from "../../lib/thirdparty/Hypixel/classes/Player";

export default class Link extends Command {
    readonly client: SkyBlockZUtilitiesClient;
    private running: string[];
    private static MC_USERNAME_REGEX = /^[A-Za-z0-9_-]{2,16}$/;
    private static DISCORD_USERNAME_REGEX = /^(.+)#([0-9]{4})$/;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "link",
            enabled: true,
            runIn: ['text', 'dm'],
            aliases: ['linkminecraft', 'linkaccount'],
            description: "Link your Minecraft account."
        });
        this.running = [];
    }

    async run(message: KlasaMessage, []: []): Promise<any> {
        if (message.author.settings.get<string>('minecraft.uuid')) {
            return message.send(`:no_entry: **|** ${message.author}, you are already linked. If you are trying to link a different account, please unlink first using \`${this.client.prefixCommand('unlink')}\`.`);
        }

        if (this.running.includes(message.author.id)) return;
        this.running.push(message.author.id);

        let reply: KlasaMessage;

        try {
            reply = <KlasaMessage>await message.author.send(
                new MessageEmbed()
                    .setColor('#5f5ac6')
                    .setAuthor(`Link Minecraft Account to ${this.client.user.username}.`, this.client.user.avatarURL())
                    .setDescription(
                        [
                            `Thank you for choosing to link your Minecraft account in ${this.client.user.username}! By continuing you acknowledge that this information may be accessible by other users of the bot.`,
                            '',
                            '**How would you like to link your account?**',
                            '🇦 Using MC-oAuth.net',
                            '🇧 Using your Hypixel API Key',
                            '🇨 Using your Hypixel Social Profile'
                        ].join('\n')
                    )
                    .setFooter('🇦 is the easiest and quickest option, we recommend going with that option.')
            );
        } catch {
            return message.send(`:no_entry: **|** ${message.author}, I am unable to DM you. You must enable server DMs under "Privacy" in order to continue and link your Minecraft account.`);
        }

        if (message.channel instanceof TextChannel) {
            await message.reply('please check your DMs to continue the linking process.');
        }

        await reply.react('🇦');
        await reply.react('🇧');
        await reply.react('🇨');

        let collectedReactions = await reply.awaitReactions((reaction, user) => user.id === message.author.id && ['🇦', '🇧', '🇨'].includes(reaction.emoji.name), {
            max: 1,
            time: 60 * 1000
        });

        if (!collectedReactions.size) {
            this.running.splice(this.running.indexOf(message.author.id, 1));
            return reply.send(`:clock1: **|** ${message.author}, this session has timed out. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
        }

        let user: UnifiedMojangResponse;
        let method: 'MC-oAuth' | 'Hypixel API Key' | 'Hypixel Social Profile';

        switch (collectedReactions.first().emoji.name) {
            case '🇦': {
                reply = <KlasaMessage>await reply.send(
                    new MessageEmbed()
                        .setColor('#5f5ac6')
                        .setAuthor(`Link with MC-oAuth.net`, this.client.user.avatarURL())
                        .setDescription([
                            '**Instructions:**',
                            '1) Use your Minecraft client to connect to `srv.mc-oauth.net:25565`.',
                            '2) Once connected, it will give you an auth code (click on the thumbnail for an example).',
                            '3) Type the provided auth code in this DM and press enter.'
                        ].join('\n'))
                        .setThumbnail('https://i.imgur.com/jH4e9Rq.png')
                );

                let collectedMessages = await reply.channel.awaitMessages(msg => msg.author.id === message.author.id, {
                    max: 1,
                    time: 5 * 60 * 1000
                });

                if (!collectedMessages.size) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:clock1: **|** ${message.author}, this session has timed out. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                let response: { status: 'success' | 'fail', message?: string, uuid?: string, username?: string };

                try {
                    response = await json('https://mc-oauth.net/api/api?token', {
                        method: 'GET',
                        headers: {
                            token: collectedMessages.first().content.trim()
                        }
                    });
                } catch {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:no_entry: **|** ${message.author}, an unknown issue occurred. Please start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                if (response.status === 'fail' || !response.uuid || !response.username) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:no_entry: **|** ${message.author}, the auth code you entered is invalid. Please start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                try {
                    user = await UnifiedMojang.user(response.uuid);
                } catch {
                    return reply.send(`:no_entry: **|** ${message.author}, an unknown issue occurred. Please start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                method = 'MC-oAuth';

                break;
            }
            case '🇧': {
                reply = <KlasaMessage>await reply.send(
                    new MessageEmbed()
                        .setColor('#5f5ac6')
                        .setAuthor(`Link with Hypixel API Key`, this.client.user.avatarURL())
                        .setDescription([
                            '**Instructions:**',
                            '1) Use your Minecraft client to connect to Hypixel.',
                            '2) Once connected, and while in the lobby, run `/api new` in chat.',
                            '3) Hover over the API key and click it to copy it to the chat box where you can then copy it to your clipboard (click the thumbnail for example).',
                            '4) Now paste the API key in this DM and press enter.'
                        ].join('\n'))
                        .setThumbnail('https://i.imgur.com/FpI7uL6.png')
                );

                let collectedMessages = await reply.channel.awaitMessages(msg => msg.author.id === message.author.id, {
                    max: 1,
                    time: 5 * 60 * 1000
                });

                if (!collectedMessages.size) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:clock1: **|** ${message.author}, this session has timed out. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                let response: HypixelKeyResponse = null;
                try {
                    response = await HypixelApi.Key.get(collectedMessages.first().content.trim());
                } catch (e) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:no_entry: **|** ${message.author}, we couldn't verify this key. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                if (!response) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:no_entry: **|** ${message.author}, we couldn't verify this key. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                try {
                    // @ts-ignore
                    user = await UnifiedMojang.user(response.record.ownerUuid ? response.record.ownerUuid : response.record.owner);
                } catch {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:no_entry: **|** ${message.author}, an unknown issue occurred. Please start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                method = 'Hypixel API Key';

                break;
            }
            case '🇨': {
                reply = <KlasaMessage>await reply.send(`${message.author}, please enter your Minecraft username.`);

                let collectedMessages = await reply.channel.awaitMessages(msg => msg.author.id === message.author.id, {
                    max: 1,
                    time: 5 * 60 * 1000
                });

                if (!collectedMessages.size) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:clock1: **|** ${message.author}, this session has timed out. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                if (!Link.MC_USERNAME_REGEX.test(collectedMessages.first().content.trim())) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:no_entry: **|** ${message.author}, this doesn't look like a valid Minecraft username. Please double check your username and start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                try {
                    user = await UnifiedMojang.user(collectedMessages.first().content.trim());
                } catch {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return reply.send(`:no_entry: **|** ${message.author}, the username you supplied is invalid or does not exist (\`${collectedMessages.first().content.trim()}\`). Please double check your username and start over with \`${this.client.prefixCommand(this, message)}\`.`);
                }

                let player: HypixelPlayer;

                try {
                    player = await HypixelApi.Player.getByUuid(user.uuid, false);
                } catch (e) {
                    this.running.splice(this.running.indexOf(message.author.id, 1));
                    return await message.send(`:no_entry: **|** ${message.author} we're unable to communicate with Hypixel to link  \`${collectedMessages.first().content.trim()}\`. Please try again later.`);
                }

                let [failedUnset, failedMismatch] = Link.checkDiscordUsernameMatch(message, player);

                if (failedUnset || failedMismatch) {
                    reply = <KlasaMessage>await reply.send(
                        new MessageEmbed()
                            .setColor('#5f5ac6')
                            .setAuthor(`Link with Hypixel Social Profile`, this.client.user.avatarURL())
                            .setDescription([
                                '**Instructions:**',
                                '1) Use your Minecraft client to connect to Hypixel.',
                                '2) Once connected, and while in the lobby, right click "My Profile" in your hotbar. It is option #2.',
                                '3) Click "Social Media" - this button is to the left of the Redstone block (the "Status" button).',
                                '4) Click "Discord" - it is the second last option.',
                                `5) Paste your Discord username into chat and hit enter. For reference your username is: \`${message.author.username}#${message.author.discriminator}\`.`,
                                '6) You\'re done! Wait around 30 seconds and then click the ✅ reaction to continue.',
                                '',
                                '**Getting "The URL isn\'t valid!"?**',
                                'Hypixel has limitations on the characters supported in a Discord username. Try changing your Discord username temporarily to something without special characters, updating it in-game, and trying again.',
                                '',
                                '**Unable to update due to ingame mute?**',
                                `Choose one of the other two verification methods. Click the ⏹ reaction to cancel this session so you can start over with \`${this.client.prefixCommand(this, message)}\` `
                            ].join('\n'))
                            .setThumbnail('https://thumbs.gfycat.com/DentalTemptingLeonberger-size_restricted.gif')
                    );


                    await reply.react('✅');
                    await reply.react('⏹');

                    let collectedReactions = await reply.awaitReactions((reaction, user) => user.id === message.author.id && ['✅', '⏹'].includes(reaction.emoji.name), {
                        max: 1,
                        time: 5 * 60 * 1000
                    });

                    if (!collectedReactions.size) {
                        this.running.splice(this.running.indexOf(message.author.id, 1));
                        return reply.send(`:clock1: **|** ${message.author}, this session has timed out. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
                    }

                    switch (collectedReactions.first().emoji.name) {
                        case '✅': {
                            try {
                                player = await HypixelApi.Player.getByUuid(user.uuid, false);
                            } catch (e) {
                                this.running.splice(this.running.indexOf(message.author.id, 1));
                                return await message.send(`:no_entry: **|** ${message.author} we're unable to communicate with Hypixel to link  \`${collectedMessages.first().content.trim()}\`. Please try again later.`);
                            }

                            let [failedUnset, failedMismatch] = Link.checkDiscordUsernameMatch(message, player);

                            if (failedUnset || failedMismatch) {
                                this.running.splice(this.running.indexOf(message.author.id, 1));
                                return reply.send(`:no_entry: **|** ${message.author}, your Hypixel social profile for Discord does not match your Discord. Please try again, start over with \`${this.client.prefixCommand(this, message)}\`.`);
                            }

                            break;
                        }
                        case '⏹': {
                            this.running.splice(this.running.indexOf(message.author.id, 1));
                            return reply.send(`❌ **|** ${message.author}, this session has been cancelled. Start over with \`${this.client.prefixCommand(this, message)}\`.`);
                        }
                    }
                }

                method = 'Hypixel Social Profile';

                break;
            }
        }

        const results = await this.client.shard.broadcastEval(`this.users.cache.filter(u => u.settings.get('minecraft.uuid') === '${user.uuid}').size`);
        for (const result of results) {
            if (result > 0) {
                this.running.splice(this.running.indexOf(message.author.id, 1));
                return message.send(`:no_entry: **|** ${message.author}, the Minecraft account \`${user.username}\` is currently linked to another Discord user. If you feel this is in error, or your original Discord account is no longer accessible, please join our support server (\`${this.client.prefixCommand('support', message)}\`) to request support.`);
            }
        }

        await message.author.settings.update('minecraft.uuid', user.uuid);
        await message.author.settings.update('minecraft.link_method', method);
        await message.author.settings.update('minecraft.link_datetime', new Date().getTime().toString(10));

        // todo: only reached on success - run guild scanning / role assignment functionality

        this.running.splice(this.running.indexOf(message.author.id, 1));
        return reply.send(`:white_check_mark: **|** ${message.author}, you have linked your Minecraft account \`${user.username}\` successfully!`);
    }

    private static checkDiscordUsernameMatch(message: KlasaMessage, player: HypixelPlayer) {
        let failedUnset = false;
        let failedMismatch = false;
        if (!player.getSocialMedia('DISCORD')) {
            failedUnset = true;
        } else if (player.getSocialMedia('DISCORD') !== `${message.author.username}#${message.author.discriminator}`) {
            const matches = Link.DISCORD_USERNAME_REGEX.exec(player.getSocialMedia('DISCORD'));
            if (matches && matches.length >= 2) {
                if (matches[1].trim() !== message.author.username || matches[2] !== message.author.discriminator) {
                    failedMismatch = true;
                }
            } else {
                failedMismatch = true;
            }
        }
        return [failedUnset, failedMismatch];
    }
};
