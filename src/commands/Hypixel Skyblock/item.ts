import {Command, CommandStore, KlasaClient, KlasaMessage} from "klasa";
import {Craftlink} from "../../lib/thirdparty/Craftlink";
import {MessageEmbed} from "discord.js";
import {ItemsListResponse} from "../../lib/thirdparty/Craftlink/interfaces/itemsList";
import {RandomLoadingMessage} from "../../lib/util/RandomLoadingMessage";


export default class ItemCommand extends Command {
    constructor(client: KlasaClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "item",
            enabled: true,
            runIn: ['text', 'dm'],
            cooldown: 5,
            deletable: false,
            aliases: ['itemlookup'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: "Lookup an item's average price on auctions.craftlink.xyz.",
            quotedStringSupport: false,
            usage: '<query:...string>',
            usageDelim: ' ',
            extendedHelp: [
                'Lookup an item\'s average price on auctions.craftlink.xyz.',
                '',
                'Examples ::',
                'item Superior Dragon Helmet',
            ].join('\n')
        });

        this.customizeResponse('query', message => `:no_entry: **|** You must supply a search query! Run \`${message.guild ? message.guild.settings.get('prefix') : this.client.options.prefix} help item\` for more instructions.`);
    }


    async run(message: KlasaMessage, [query]: [string]): Promise<any> {
        await message.send(RandomLoadingMessage.get());

        let response: ItemsListResponse;

        try {
            response = await Craftlink.itemsList(query);
        } catch (e) {
            return await message.send(':no_entry: **|** Something went wrong! Please try again.');
        }

        const embed = new MessageEmbed()
            .setColor('#5f5ac6')
            .setTitle(`Results for "${query}"`)
            .setAuthor('Powered by auctions.craftlink.xyz', 'https://cdn.discordapp.com/icons/640429862338822155/b4e8f9cf9341cc5110604b1db77688e6.webp?size=128', 'https://auctions.craftlink.xyz/items');

        let hasResults = false;
        let iterations = 0;

        for (const itemResponse of response.item) {
            hasResults = true;
            ++iterations;
            if (iterations > 5) continue;
            const item = response.item.find(item => item.id === itemResponse.id);

            embed.addField(`Name`, `**${item.name}**`, true);

            embed.addField('Average Price', itemResponse.stats.averageFiltered ? `${parseFloat(itemResponse.stats.averageFiltered).toLocaleString()} coins` : 'n/a', true);
            embed.addField('Median Price', itemResponse.stats.median ? `${parseFloat(itemResponse.stats.median).toLocaleString()} coins` : 'n/a', true);
        }

        if (!hasResults) {
            embed.setDescription('There were no results.');
        }

        if (iterations > 5) {
            embed.setFooter('We found more results. Please make your query more concise if your request is missing.');
        }

        return message.send(message.author, {embed});
    }
};
