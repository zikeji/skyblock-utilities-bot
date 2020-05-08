import {Command, CommandStore, KlasaClient, KlasaMessage} from "klasa";
import {HypixelApi} from "../../lib/thirdparty/Hypixel";
import {MessageEmbed, TextChannel} from "discord.js";
import MinecraftTextJS from "minecraft-text-js";
import {NBT} from "@xmcl/nbt";
import * as prettyMilliseconds from "pretty-ms";
import * as TurndownService from "turndown";
import {AuctionItem} from "../../lib/thirdparty/Hypixel/interfaces/SkyBlock/auction";
import {UnifiedMojang} from "../../lib/thirdparty/UnifiedMojang";
import {UnifiedMojangResponse} from "../../lib/thirdparty/UnifiedMojang/interfaces/response";
import {RandomLoadingMessage} from "../../lib/util/RandomLoadingMessage";

const turndownService = new TurndownService();

enum EMOJIS {
    BACK = '◀',
    FORWARD = '▶',
    STOP_BUTTON = '⏹',
    REMINDER = '⏰'
}

interface AuctionEmbedData {
    id: string;
    title: string;
    description: string;
    ends: Date;
    fields: {
        name: string;
        value: string;
        inline?: boolean;
    }[]
}

export default class extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "auction",
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            aliases: ['ah'],
            requiredPermissions: ['READ_MESSAGE_HISTORY', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS', 'ADD_REACTIONS'],
            description: 'List user\'s active auctions and set reminders.',
            quotedStringSupport: false,
            usage: '<username:string>',
            usageDelim: ' ',
            extendedHelp: [
            'List user\'s active auctions and set reminders.',
            '',
            'Examples ::',
            'ah RealMinecraftIGN',
        ].join('\n')
        });

        this.customizeResponse('username', message => `:no_entry: **|** You must supply the Minecraft username you are checking! Run \`${message.guild ? message.guild.settings.get('prefix') : this.client.options.prefix}help auction\` for more instructions.`);
    }


    async run(message: KlasaMessage, [username]: [string]): Promise<any> {
        const replies = await message.sendMessage(RandomLoadingMessage.get());
        let reply: KlasaMessage;
        if (replies instanceof Array) {
            reply = replies[0];
        } else {
            reply = replies;
        }

        let user: UnifiedMojangResponse;

        try {
            user = await UnifiedMojang.user(username);
        } catch (e) {
            return await reply.edit(`:no_entry: **|** \`${username}\` is invalid or does not exist!`);
        }

        const data = await HypixelApi.SkyBlock.Auction.getByUuid(user.uuid);

        if (!data || !data.success) {
            return reply.edit(`:no_entry: **|** An unknown error occurred while querying data for \`${user.username}\`!`);
        }

        if (!data.auctions || data.auctions.length === 0) {
            return reply.edit(
                `:no_entry: **|** \`${user.username}\` has no active auctions!`
            );
        }

        const currentTimestamp = new Date().getTime();
        const activeAuctions: Array<AuctionItem> = [];
        for (const auction of data.auctions) {
            if (auction.end > currentTimestamp) {
                activeAuctions.push(auction);
            }
        }

        if (activeAuctions.length === 0) {
            return reply.edit(`:no_entry: **|** \`${user.username}\` has no active auctions!`);
        }

        const auctionEmbedDataArray: AuctionEmbedData[] = [];

        for (const auction of activeAuctions) {
            let description = '';
            const lines = auction.item_lore.split("\n");
            for (const line of lines) {
                description += turndownService.turndown(MinecraftTextJS.toHTML(line)) + "\n";
            }

            const nbtData = await NBT.Persistence.deserialize(Buffer.from(auction.item_bytes.data, 'base64'), {compressed: true});

            const itemCount = nbtData && nbtData.i && nbtData.i.length > 0 && nbtData.i[0].Count > 0 ? nbtData.i[0].Count : 1;

            let title = '';
            if (itemCount > 1) {
                title += `${itemCount}x `;
            }
            title += auction.item_name;

            const auctionEmbed: AuctionEmbedData = {
                id: auction._id,
                title: title,
                description: description,
                ends: new Date(auction.end),
                fields: []
            };

            auctionEmbed.fields.push({
                name: 'Seller',
                value: user.username,
                inline: true
            });

            auctionEmbed.fields.push({
                name: 'Bids',
                value: auction.bids.length.toLocaleString(),
                inline: true
            });

            if (auction.bids.length > 0) {
                try {
                    const topBidder = await UnifiedMojang.user(auction.bids[auction.bids.length - 1].bidder);

                    auctionEmbed.fields.push({
                        name: 'Top Bid',
                        value: `**${auction.highest_bid_amount.toLocaleString()} coins**`,
                        inline: true
                    });

                    auctionEmbed.fields.push({
                        name: 'Bidder',
                        value: topBidder.username,
                        inline: true
                    });
                } catch (e) {
                    auctionEmbed.fields.push({
                        name: 'Top Bid',
                        value: `**${auction.highest_bid_amount.toLocaleString()} coins**`,
                        inline: true
                    });
                }
            } else {
                auctionEmbed.fields.push({
                    name: 'Starting Bid',
                    value: auction.starting_bid.toLocaleString(),
                    inline: true
                });
            }

            if (itemCount > 1) {
                auctionEmbed.fields.push({
                    name: 'Individual Cost',
                    value: `${parseFloat(((auction.bids.length > 0 ? auction.highest_bid_amount : auction.starting_bid) / itemCount).toFixed(2)).toLocaleString()} coins`
                });
            }
            // .addField('Ends In', );
            auctionEmbedDataArray.push(auctionEmbed);
        }

        let currentIndex = 0;
        let reactionErrorDebounce: number = new Date().getTime() - 5000;
        await reply.edit(`${message.author} **Auctions for \`${user.username}\`**`, {
            embed: await this.handleAuctionPage(auctionEmbedDataArray, currentIndex)
        });
        (async () => {
            if (auctionEmbedDataArray.length > 1) {
                for (const emoji of Object.values(EMOJIS).slice(0,3)) {
                    await reply.react(emoji);
                }
            } else {
                await reply.react(EMOJIS.STOP_BUTTON);
            }
            if ((auctionEmbedDataArray[currentIndex].ends.getTime() - new Date().getTime()) > 10 * 60 * 1000) {
                await reply.react(EMOJIS.REMINDER);
            }
        })();
        const collector = reply.createReactionCollector((reaction, user) => user.id === message.author.id && !user.bot && Object.values(EMOJIS).includes(reaction.emoji.name), {time: 5 * 6e4});
        collector.on('collect', async (reaction, reactionUser) => {
            if (message.channel instanceof TextChannel && message.channel.permissionsFor(this.client.user).has(['MANAGE_MESSAGES'], false)) {
                await reaction.users.remove(reactionUser);
            }
            // noinspection FallThroughInSwitchStatementJS
            switch (reaction.emoji.name) {
                case EMOJIS.BACK:
                    currentIndex -= 1;
                    if (currentIndex < 0) {
                        currentIndex = auctionEmbedDataArray.length - 1;
                    }

                    await reply.edit(`${message.author} **Auctions for \`${user.username}\`**`, {
                        embed: await this.handleAuctionPage(auctionEmbedDataArray, currentIndex, reply)
                    });
                    break;
                case EMOJIS.FORWARD:
                    currentIndex += 1;
                    if (currentIndex >= auctionEmbedDataArray.length) {
                        currentIndex = 0;
                    }

                    await reply.edit(`${message.author} **Auctions for \`${user.username}\`**`, {
                        embed: await this.handleAuctionPage(auctionEmbedDataArray, currentIndex, reply)
                    });
                    break;
                case EMOJIS.STOP_BUTTON:
                    collector.stop();
                    break;
                case EMOJIS.REMINDER:
                    const data = auctionEmbedDataArray[currentIndex];
                    if ((data.ends.getTime() - new Date().getTime()) <= 10 * 60 * 1000) {
                        if (new Date().getTime() - reactionErrorDebounce >= 5000) {
                            reactionErrorDebounce = new Date().getTime();
                            message.channel.send(`:no_entry: **|** ${message.author} I can't remind you for an auction that ends in less than 10 minutes!`).then(msg => {
                                msg.delete({timeout: 5000});
                            });
                        }
                    } else {
                        // remind
                        const scheduleId = `auctionreminder-${auctionEmbedDataArray[currentIndex].id}-${message.author.id}`;
                        if (!this.client.schedule.get(scheduleId)) {
                            await this.client.schedule.create('SendAuctionReminder', data.ends.getTime() - 5 * 60 * 1000, {
                                id: scheduleId,
                                catchUp: true,
                                data: {
                                    userId: message.author.id,
                                    auctioneer: user.username,
                                    title: auctionEmbedDataArray[currentIndex].title,
                                    ends: data.ends.getTime()
                                }
                            });
                            message.channel.send(`:white_check_mark: **|** ${message.author} reminder for "${auctionEmbedDataArray[currentIndex].title}" created. I'll remind you when it has 5 or so minutes left.`).then(msg => {
                                msg.delete({timeout: 60000});
                            });
                        } else {
                            if (new Date().getTime() - reactionErrorDebounce >= 5000) {
                                reactionErrorDebounce = new Date().getTime();
                                message.channel.send(`:no_entry: **|** ${message.author} you already setup a reminder for this auction!`).then(msg => {
                                    msg.delete({timeout: 5000});
                                });
                            }
                        }
                    }

                    break;
            }
        });
        collector.on('end', () => {
            if (message.channel instanceof TextChannel && message.channel.permissionsFor(this.client.user).has(['MANAGE_MESSAGES'], false)) {
                reply.reactions.removeAll();
            } else {
                reply.reactions.cache.array().forEach(reaction => {
                    reaction.users.remove(this.client.user.id);
                });
            }
        });
    }

    private async handleAuctionPage(dataArr: AuctionEmbedData[], index, message?: KlasaMessage): Promise<MessageEmbed> {
        const data = dataArr[index];
        const endsIn10Minutes = (data.ends.getTime() - new Date().getTime()) <= 10 * 60 * 1000;

        const embed = new MessageEmbed()
            .setTitle(data.title)
            .setDescription(data.description);

        if (endsIn10Minutes) {
            embed.setColor('#B22222');
            if (message) {
                message.reactions.cache.forEach(reaction => {
                    if (reaction.emoji.name === EMOJIS.REMINDER) {
                        reaction.users.cache.forEach(reactionUser => {
                            reaction.users.remove(reactionUser);
                        });
                    }
                });
            }
        } else {
            embed.setColor('#5f5ac6');
            if (message) {
                await message.react(EMOJIS.REMINDER)
            }
        }

        for (const field of data.fields) {
            embed.addField(field.name, field.value, field.inline);
        }

        if ((data.ends.getTime() - new Date().getTime()) <= 0) {
            embed.addField('Ends In', 'Now/Ended');
        } else if ((data.ends.getTime() - new Date().getTime()) <= 2 * 60 * 1000) {
            embed.addField('Ends In', 'Less than 2 minutes!');
        } else {
            embed.addField('Ends In', prettyMilliseconds(data.ends.getTime() - new Date().getTime(), {secondsDecimalDigits: 0}));
        }
        embed.addField('Page', `${index + 1} of ${dataArr.length}`);

        if (!endsIn10Minutes) {
            embed.setFooter('React with alarm clock to get a reminder ~5 minutes from auction end.');
        }

        embed.setTimestamp(data.ends);

        return embed;
    }
};
