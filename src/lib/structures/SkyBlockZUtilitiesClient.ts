import {Client, Command, KlasaClientOptions, KlasaMessage} from "klasa";

require('./schemas/defaultClientSchema');

export class SkyBlockZUtilitiesClient extends Client {
    public health: {
        commands: {
            temp: {
                count: number;
                ran: any;
            },
            cmdCount: {
                count: number;
                ran: any;
            }[]
        }
    };
    public static emotes = {
        loading: '<a:loading:707345706578477086>'
    };

    constructor(options?: KlasaClientOptions) {
        super(options);

        this.health = Object.seal({
            commands: {
                temp: {
                    count: 0,
                    ran: {}
                },
                cmdCount: new Array(60).fill({
                    count: 0,
                    ran: {}
                })
            }
        });
    }

    public prefixCommand(command: Command, message?: KlasaMessage): string {
        const prefix = message && message.guild ? message.guild.settings.get<string>('prefix') : this.options.prefix;
        return `${prefix}${command.name}`
    }
}
