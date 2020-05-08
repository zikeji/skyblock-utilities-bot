import {json} from 'web-request';
import {Guild} from "discord.js";
import {KlasaGuild} from "klasa";

interface Author {
    id: string,
    username: string,
    avatar: string,
    discriminator: string
}

interface ViolationResponse {
    ts: Date,
    author: Author
}

interface CheckRepResponse {
    totalRep: number,
    violations: ViolationResponse[],
    allMessages: {
        id: string;
        content: string;
        author: {
            id: string;
        }
        timestamp: string;
        mentions: {
            id: string
        }[]
    }[]
}

class SearchViolationsWrapper {
    private readonly token: string;

    public constructor(token: string) {
        this.token = token;
    }

    private recurse(guild: KlasaGuild, channelId: string, userId, messages: any[] | null, offset: number | null): any {
        if (!messages) messages = [];
        if (!offset) offset = 0;
        return new Promise((resolve, reject) => {
            json(`https://discordapp.com/api/v6/guilds/${guild.id}/messages/search`,
                {
                    qs: {
                        channel_id: channelId,
                        mentions: userId,
                        offset: offset
                    },
                    headers: {
                        Authorization: this.token,
                    }
                }
            ).then((response: any) => {
                if (!response || !response.messages) {
                    console.log(response);
                    reject("Failed!");
                }
                response.messages.forEach(innerMessages => {
                    innerMessages.forEach(msg => {
                        if (msg.hit) {
                            messages.push(msg);
                        }
                    });
                });
                if (offset < response.total_results) {
                    offset += 25;
                    this.recurse(guild, channelId, userId, messages, offset).then(messages => {
                        resolve(messages);
                    })
                } else {
                    resolve(messages);
                }
            }).catch(reject);
        });
    }

    public async checkForWindowViolations(guild: Guild, userId): Promise<CheckRepResponse> {
        const messages = await this.recurse(guild, guild.settings.get<string>('reputation_channel'), userId, null, null);
        const data = [];
        for (let i = 0; i < messages.length; i += 1) {
            const message = messages[i];
            const user = data.find(user => user.author.id === message.author.id);
            if (!user) {
                if (guild) {
                    const user = guild.member(message.author.id);
                    if (user) {
                        if (user.roles.cache.has(guild.settings.get('staff_role')) || user.hasPermission('ADMINISTRATOR')) {
                            continue;
                        }
                    }
                }
                data.push({
                    author: message.author,
                    timestamps: [
                        new Date(message.timestamp)
                    ]
                });
            } else {
                user.timestamps.push(new Date(message.timestamp));
            }
        }

        const results = [];
        for (let i = 0; i < data.length; i += 1) {
            const user = data[i];
            if (user.timestamps.length > 1) {
                let lastTs;
                user.timestamps.forEach(ts => {
                    if (!lastTs) lastTs = ts.getTime();
                    const diff = lastTs - ts.getTime();
                    if (diff > 0) {
                        let hoursBetween = Math.floor((diff / 1000 / 60 / 60) * 100) / 100;
                        if (hoursBetween < 5) {
                            const result = results.find(r => r.author.id === user.author.id);
                            if (!result) {
                                results.push({
                                    ts,
                                    author: user.author
                                });
                            }
                        }
                    }
                });
            }
        }

        return {
            totalRep: messages.length,
            violations: results,
            allMessages: messages
        };
    }
}

export const SearchViolations = new SearchViolationsWrapper(process.env.USER_TOKEN);
