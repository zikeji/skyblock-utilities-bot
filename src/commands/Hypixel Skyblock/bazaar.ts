import {Command, CommandStore, KlasaMessage} from "klasa";
import {HypixelApi} from "../../lib/thirdparty/Hypixel";
import {MessageEmbed} from "discord.js";
import {ProductResponse} from "../../lib/thirdparty/Hypixel/interfaces/SkyBlock/bazaar";
import {RandomLoadingMessage} from "../../lib/util/RandomLoadingMessage";
import {AbbreviateNumber} from "../../lib/util/AbbreviateNumber";
import {SkyBlockZUtilitiesClient} from "../../lib/structures/SkyBlockZUtilitiesClient";

export default class BazaarCommand extends Command {
    readonly client: SkyBlockZUtilitiesClient;

    constructor(client: SkyBlockZUtilitiesClient, store: CommandStore, file: string[], directory: string) {
        super(client, store, file, directory, {
            name: "bazaar",
            enabled: true,
            runIn: ['text', 'dm'],
            aliases: ['bz'],
            requiredPermissions: ['EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
            description: 'List bazaar summary for item.',
            quotedStringSupport: false,
            usage: '<item_name:...string>',
            usageDelim: ' ',
            extendedHelp: [
                '[PREFIX_COMMAND] super egg',
            ].join('\n')
        });

        this.customizeResponse('item_name', message => `:no_entry: **|** You must supply the item name of the item you are checking! Run \`${this.client.prefixCommand('help bazaar', message)}\` for more instructions.`);
    }

    async run(message: KlasaMessage, [itemName]: [string | null]): Promise<any> {
        await message.send(RandomLoadingMessage.get());
        const product = BazaarCommand.getProduct(itemName.replace(/ /g, '_').toUpperCase());

        let data: ProductResponse;

        try {
            data = await HypixelApi.SkyBlock.Bazaar.getByProductId(product.id, false);
        } catch (e) {
            return message.send(`:no_entry: **|** No bazaar product matches that name!`);
        }
        const productInfo = data.product_info;

        const embed = new MessageEmbed()
            .setAuthor(product.name, 'https://stonks.gg/res/favicon.png', `https://stonks.gg/product/${product.id}`)
            .setColor('#5f5ac6');

        const description = [];

        if (productInfo.quick_status.sellPrice === 0) {
            description.push(`**Buy price:** N/A`);
            description.push('No offers!');
        } else {
            productInfo.sell_summary.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
            const buyPrice = productInfo.sell_summary.length === 0 ? 'N/A' : Math.round(productInfo.sell_summary[0].pricePerUnit * 10) / 10;

            description.push(`**Buy price:** ${buyPrice.toLocaleString()} coins`);
            description.push(`${AbbreviateNumber(productInfo.quick_status.sellVolume)} in ${productInfo.quick_status.sellOrders} offers`);
            description.push(`${AbbreviateNumber(productInfo.quick_status.sellMovingWeek)} insta-buys in 7d`);
        }
        description.push('');

        if (productInfo.quick_status.buyPrice === 0) {
            description.push(`**Sell price:** N/A`);
            description.push('No offers!');
        } else {
            productInfo.buy_summary.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
            const sellPrice = productInfo.buy_summary.length === 0 ? 'N/A' : Math.round(productInfo.buy_summary[0].pricePerUnit * 10) / 10;

            description.push(`**Sell price:** ${sellPrice.toLocaleString()} coins`);
            description.push(`${AbbreviateNumber(productInfo.quick_status.buyVolume)} in ${productInfo.quick_status.buyOrders} orders`);
            description.push(`${AbbreviateNumber(productInfo.quick_status.buyMovingWeek)} insta-sells in 7d`);
        }

        embed.setDescription(description.join('\n'));
        embed.setFooter('Note: Information is based on the latest buy and sell orders in-game and may not be accurate.');

        return message.send(message.author, {embed});
    }

    private static getProduct(query: string) {
        for (const product of BazaarCommand.products) {
            if (product.id === query || product.aliases.includes(query)) {
                return product;
            }
        }
        return {
            name: 'Unknown',
            id: query,
            aliases: []
        }
    }

    private static products: { id: string, name: string, aliases: string[] }[] = [
        {
            id: 'ENCHANTED_RAW_CHICKEN',
            name: 'Enchanted Raw Chicken',
            aliases: ['E_RAW_CHICKEN']
        },
        {
            id: 'INK_SACK:3',
            name: 'Cocoa Beans',
            aliases: ['COCOA_BEANS']
        },
        {
            id: 'BROWN_MUSHROOM',
            name: 'Brown Mushroom',
            aliases: []
        },
        {
            id: 'ENCHANTED_WATER_LILY',
            name: 'Enchanted Lily Pad',
            aliases: ['ENCHANTED_LILY_PAD', 'E_LILY_PAD']
        },
        {
            id: 'INK_SACK:4',
            name: 'Lapis Lazuli',
            aliases: ['LAPIS_LAZULI', 'LAPIS']
        },
        {
            id: 'TARANTULA_WEB',
            name: 'Tarantula Web',
            aliases: []
        },
        {
            id: 'CARROT_ITEM',
            name: 'Carrot',
            aliases: ['CARROT', 'CARROTS']
        },
        {
            id: 'ENCHANTED_POTATO',
            name: 'Enchanted Potato',
            aliases: ['E_POTATO', 'E_POTATOS', 'E_POTATOES']
        },
        {
            id: 'LOG:1',
            name: 'Spruce Wood',
            aliases: ['SPRUCE', 'SPRUCE_LOG', 'SPRUCE_WOOD']
        },
        {
            id: 'ENCHANTED_SLIME_BALL',
            name: 'Enchanted Slime Ball',
            aliases: ['E_SLIME_BALL']
        },
        {
            id: 'ENCHANTED_GOLDEN_CARROT',
            name: 'Enchanted Golden Carrot',
            aliases: ['E_GOLDEN_CARROT']
        },
        {
            id: 'LOG:3',
            name: 'Jungle Wood',
            aliases: ['JUNGLE', 'JUNGLE_LOG', 'JUNGLE_WOOD']
        },
        {
            id: 'LOG:2',
            name: 'Birch Wood',
            aliases: ['BIRCH', 'BIRCH_LOG', 'BIRCH_WOOD']
        },
        {
            id: 'ENCHANTED_RABBIT_HIDE',
            name: 'Enchanted Rabbit Hide',
            aliases: ['E_RABBIT_HIDE']
        },
        {
            id: 'ENCHANTED_GLOWSTONE_DUST',
            name: 'Enchanted Glowstone Dust',
            aliases: ['E_GLOWSTONE_DUST']
        },
        {
            id: 'ENCHANTED_INK_SACK',
            name: 'Enchanted Ink Sack',
            aliases: ['E_INK_SACK']
        },
        {
            id: 'ENCHANTED_CACTUS',
            name: 'Enchanted Cactus',
            aliases: ['E_CACTUS']
        },
        {
            id: 'ENCHANTED_SUGAR_CANE',
            name: 'Enchanted Sugar Cane',
            aliases: ['E_SUGAR_CANE']
        },
        {
            id: 'ENCHANTED_BIRCH_LOG',
            name: 'Enchanted Birch Wood',
            aliases: ['ENCHANTED_BIRCH', 'ENCHANTED_BIRCH_WOOD', 'E_BIRCH', 'E_BIRCH_WOOD']
        },
        {
            id: 'ENCHANTED_GUNPOWDER',
            name: 'Enchanted Gunpowder',
            aliases: ['E_GUNPOWDER']
        },
        {
            id: 'ENCHANTED_MELON',
            name: 'Enchanted Melon',
            aliases: ['E_MELON']
        },
        {
            id: 'ENCHANTED_COOKED_SALMON',
            name: 'Enchanted Cooked Salmon',
            aliases: ['E_COOKED_SALMON']
        },
        {
            id: 'ENCHANTED_SUGAR',
            name: 'Enchanted Sugar',
            aliases: ['E_SUGAR']
        },
        {
            id: 'LOG',
            name: 'Oak Wood',
            aliases: ['OAK', 'OAK_LOG', 'OAK_WOOD']
        },
        {
            id: 'CACTUS',
            name: 'Cactus',
            aliases: []
        },
        {
            id: 'ENCHANTED_BLAZE_ROD',
            name: 'Enchanted Blaze Rod',
            aliases: ['E_BLAZE_ROD']
        },
        {
            id: 'GHAST_TEAR',
            name: 'Ghast Tear',
            aliases: []
        },
        {
            id: 'ENCHANTED_CAKE',
            name: 'Enchanted Cake',
            aliases: ['E_CAKE']
        },
        {
            id: 'PUMPKIN',
            name: 'Pumpkin',
            aliases: []
        },
        {
            id: 'ENCHANTED_ENDER_PEARL',
            name: 'Enchanted Ender Pearl',
            aliases: ['E_ENDER_PEARL']
        },
        {
            id: 'PURPLE_CANDY',
            name: 'Purple Candy',
            aliases: []
        },
        {
            id: 'WHEAT',
            name: 'Wheat',
            aliases: []
        },
        {
            id: 'ENCHANTED_FERMENTED_SPIDER_EYE',
            name: 'Enchanted Fermented Spider Eye',
            aliases: ['E_FERMENTED_SPIDER_EYE', 'E_F_SPIDER_EYE']
        },
        {
            id: 'ENCHANTED_GOLD_BLOCK',
            name: 'Enchanted Gold Block',
            aliases: ['E_GOLD_BLOCK']
        },
        {
            id: 'ENCHANTED_RAW_SALMON',
            name: 'Enchanted Raw Salmon',
            aliases: ['E_RAW_SALMON']
        },
        {
            id: 'ENCHANTED_JUNGLE_LOG',
            name: 'Enchanted Jungle Wood',
            aliases: ['ENCHANTED_JUNGLE', 'ENCHANTED_JUNGLE_WOOD', 'E_JUNGLE', 'E_JUNGLE_WOOD']
        },
        {
            id: 'ENCHANTED_FLINT',
            name: 'Enchanted Flint',
            aliases: ['E_FLINT']
        },
        {
            id: 'ENCHANTED_GLISTERING_MELON',
            name: 'Enchanted Glistering Melon',
            aliases: ['E_GLISTERING_MELON']
        },
        {
            id: 'IRON_INGOT',
            name: 'Iron Ingot',
            aliases: []
        },
        {
            id: 'PRISMARINE_SHARD',
            name: 'Prismarine Shard',
            aliases: []
        },
        {
            id: 'ENCHANTED_EMERALD',
            name: 'Enchanted Emerald',
            aliases: ['E_EMERALD']
        },
        {
            id: 'ENCHANTED_SPIDER_EYE',
            name: 'Enchanted Spider Eye',
            aliases: ['E_SPIDER_EYE']
        },
        {
            id: 'ENCHANTED_EMERALD_BLOCK',
            name: 'Enchanted Emerald Block',
            aliases: ['E_EMERALD_BLOCK']
        },
        {
            id: 'RED_MUSHROOM',
            name: 'Red Mushroom',
            aliases: []
        },
        {
            id: 'MUTTON',
            name: 'Mutton',
            aliases: []
        },
        {
            id: 'ENCHANTED_MELON_BLOCK',
            name: 'Enchanted Melon Block',
            aliases: ['E_MELON_BLOCK']
        },
        {
            id: 'ENCHANTED_CLAY_BALL',
            name: 'Enchanted Clay',
            aliases: ['ENCHANTED_CLAY', 'E_CLAY']
        },
        {
            id: 'DIAMOND',
            name: 'Diamond',
            aliases: []
        },
        {
            id: 'COBBLESTONE',
            name: 'Cobblestone',
            aliases: []
        },
        {
            id: 'SPIDER_EYE',
            name: 'Spider Eye',
            aliases: []
        },
        {
            id: 'RAW_FISH',
            name: 'Raw Fish',
            aliases: []
        },
        {
            id: 'ENCHANTED_PUFFERFISH',
            name: 'Enchanted Pufferfish',
            aliases: ['E_PUFFERFISH']
        },
        {
            id: 'GLOWSTONE_DUST',
            name: 'Glowstone Dust',
            aliases: []
        },
        {
            id: 'GOLD_INGOT',
            name: 'Gold Ingot',
            aliases: ['GOLD']
        },
        {
            id: 'REVENANT_VISCERA',
            name: 'Revenant Viscera',
            aliases: []
        },
        {
            id: 'TARANTULA_SILK',
            name: 'Tarantula Silk',
            aliases: []
        },
        {
            id: 'POTATO_ITEM',
            name: 'Potato',
            aliases: ['POTATO', 'POTATOS', 'POTATOES']
        },
        {
            id: 'ENCHANTED_MUTTON',
            name: 'Enchanted Mutton',
            aliases: ['E_MUTTON']
        },
        {
            id: 'ENCHANTED_HUGE_MUSHROOM_1',
            name: 'Enchanted Brown Mushroom Block',
            aliases: ['ENCHANTED_BROWN_MUSHROOM_BLOCK', 'E_BROWN_MUSHROOM_BLOCK']
        },
        {
            id: 'SUPER_COMPACTOR_3000',
            name: 'Super Compactor 3000',
            aliases: ['SC3K', 'SUPER_COMPACTOR', 'SUPER_COMPACTER', 'SUPER_COMPACTER_3000']
        },
        {
            id: 'ENCHANTED_IRON',
            name: 'Enchanted Iron',
            aliases: ['E_IRON']
        },
        {
            id: 'STOCK_OF_STONKS',
            name: 'Stock of Stonks',
            aliases: ['STONKS']
        },
        {
            id: 'ENCHANTED_COBBLESTONE',
            name: 'Enchanted Cobblestone',
            aliases: ['E_COBBLESTONE']
        },
        {
            id: 'ENCHANTED_BONE',
            name: 'Enchanted Bone',
            aliases: ['E_BONE']
        },
        {
            id: 'ENCHANTED_PAPER',
            name: 'Enchanted Paper',
            aliases: ['E_PAPER']
        },
        {
            id: 'ENCHANTED_HUGE_MUSHROOM_2',
            name: 'Enchanted Red Mushroom Block',
            aliases: ['ENCHANTED_RED_MUSHROOM_BLOCK', 'E_RED_MUSHROOM_BLOCK']
        },
        {
            id: 'PORK',
            name: 'Raw Porkchop',
            aliases: ['RAW_PORKCHOP', 'PORKCHOP']
        },
        {
            id: 'ENCHANTED_DIAMOND_BLOCK',
            name: 'Enchanted Diamond Block',
            aliases: ['E_DIAMOND_BLOCK']
        },
        {
            id: 'EMERALD',
            name: 'Emerald',
            aliases: []
        },
        {
            id: 'ENCHANTED_RABBIT_FOOT',
            name: 'Enchanted Rabbit Foot',
            aliases: ['E_RABBIT_FOOT']
        },
        {
            id: 'PRISMARINE_CRYSTALS',
            name: 'Prismarine Crystals',
            aliases: []
        },
        {
            id: 'HOT_POTATO_BOOK',
            name: 'Hot Potato Book',
            aliases: ['HPB']
        },
        {
            id: 'ENCHANTED_ICE',
            name: 'Enchanted Ice',
            aliases: ['E_ICE']
        },
        {
            id: 'ICE',
            name: 'Ice',
            aliases: []
        },
        {
            id: 'CLAY_BALL',
            name: 'Clay',
            aliases: ['CLAY']
        },
        {
            id: 'HUGE_MUSHROOM_1',
            name: 'Brown Mushroom Block',
            aliases: ['BROWN_MUSHROOM_BLOCK']
        },
        {
            id: 'HUGE_MUSHROOM_2',
            name: 'Red Mushroom Block',
            aliases: ['RED_MUSHROOM_BLOCK']
        },
        {
            id: 'LOG_2:1',
            name: 'Dark Oak Wood',
            aliases: ['DARK_OAK', 'DARK_OAK_LOG', 'DARK_OAK_WOOD']
        },
        {
            id: 'GREEN_GIFT',
            name: 'Green Gift',
            aliases: []
        },
        {
            id: 'GOLDEN_TOOTH',
            name: 'Golden Tooth',
            aliases: ['GOLD_TOOTH']
        },
        {
            id: 'STRING',
            name: 'String',
            aliases: []
        },
        {
            id: 'PACKED_ICE',
            name: 'Packed Ice',
            aliases: []
        },
        {
            id: 'WATER_LILY',
            name: 'Lily Pad',
            aliases: ['LILY_PAD']
        },
        {
            id: 'RABBIT_FOOT',
            name: 'Rabbit Foot',
            aliases: []
        },
        {
            id: 'LOG_2',
            name: 'Acacia Wood',
            aliases: ['ACACIA', 'ACACIA_LOG', 'ACACIA_WOOD']
        },
        {
            id: 'REDSTONE',
            name: 'Redstone',
            aliases: []
        },
        {
            id: 'ENCHANTED_OBSIDIAN',
            name: 'Enchanted Obsidian',
            aliases: ['E_OBSIDIAN']
        },
        {
            id: 'ENCHANTED_COAL',
            name: 'Enchanted Coal',
            aliases: ['E_COAL']
        },
        {
            id: 'COAL',
            name: 'Coal',
            aliases: []
        },
        {
            id: 'ENCHANTED_QUARTZ',
            name: 'Enchanted Quartz',
            aliases: ['E_QUARTZ']
        },
        {
            id: 'ENDER_PEARL',
            name: 'Ender Pearl',
            aliases: ['E_PEARL']
        },
        {
            id: 'ENCHANTED_COAL_BLOCK',
            name: 'Enchanted Coal Block',
            aliases: ['E_COAL_BLOCK']
        },
        {
            id: 'ENCHANTED_CACTUS_GREEN',
            name: 'Enchanted Cactus Green',
            aliases: ['E_CACTUS_GREEN']
        },
        {
            id: 'ENCHANTED_PRISMARINE_CRYSTALS',
            name: 'Enchanted Prismarine Crystals',
            aliases: ['E_PRISMARINE_CRYSTALS']
        },
        {
            id: 'ENCHANTED_CARROT_ON_A_STICK',
            name: 'Enchanted Carrot on a Stick',
            aliases: ['E_CARROT_ON_A_STICK']
        },
        {
            id: 'ENCHANTED_ENDSTONE',
            name: 'Enchanted Endstone',
            aliases: ['E_ENDSTONE', 'E_END_STONE', 'ENCHANTED_END_STONE']
        },
        {
            id: 'ENCHANTED_LAPIS_LAZULI_BLOCK',
            name: 'Enchanted Lapis Lazuli Block',
            aliases: ['E_LAPIS_LAZULI_BLOCK']
        },
        {
            id: 'ENCHANTED_COOKIE',
            name: 'Enchanted Cookie',
            aliases: ['E_COOKIE']
        },
        {
            id: 'ENCHANTED_STRING',
            name: 'Enchanted String',
            aliases: ['E_STRING']
        },
        {
            id: 'SLIME_BALL',
            name: 'Slimeball',
            aliases: ['SLIMEBALL']
        },
        {
            id: 'ENDER_STONE',
            name: 'End Stone',
            aliases: ['END_STONE', 'ENDSTONE']
        },
        {
            id: 'ENCHANTED_RAW_FISH',
            name: 'Enchanted Raw Fish',
            aliases: ['E_RAW_FISH']
        },
        {
            id: 'ENCHANTED_ACACIA_LOG',
            name: 'Enchanted Acacia Wood',
            aliases: ['ENCHANTED_ACACIA', ' ENCHANTED_ACACIA_WOOD', 'E_ACACIA', 'E_ACACIA_LOG', 'E_ACACIA_WOOD']
        },
        {
            id: 'ENCHANTED_EGG',
            name: 'Enchanted Egg',
            aliases: ['E_EGG']
        },
        {
            id: 'SUPER_EGG',
            name: 'Super Enchanted Egg',
            aliases: ['SUPER_ENCHANTED_EGG', 'SUPER_E_EGG', 'S_ENCHANTED_EGG', 'S_E_EGG']
        },
        {
            id: 'QUARTZ',
            name: 'Nether Quartz',
            aliases: []
        },
        {
            id: 'ENCHANTED_EYE_OF_ENDER',
            name: 'Enchanted Eye of Ender',
            aliases: ['E_EYE_OF_ENDER']
        },
        {
            id: 'SAND',
            name: 'Sand',
            aliases: []
        },
        {
            id: 'RAW_CHICKEN',
            name: 'Raw Chicken',
            aliases: ['CHICKEN']
        },
        {
            id: 'MAGMA_CREAM',
            name: 'Magma Cream',
            aliases: []
        },
        {
            id: 'SUGAR_CANE',
            name: 'Sugar Cane',
            aliases: ['SUGARCANE']
        },
        {
            id: 'ENCHANTED_LAPIS_LAZULI',
            name: 'Enchanted Lapis Lazuli',
            aliases: ['E_LAPIS_LAZULI']
        },
        {
            id: 'ENCHANTED_GHAST_TEAR',
            name: 'Enchanted Ghast Tear',
            aliases: ['E_GHAST_TEAR']
        },
        {
            id: 'ENCHANTED_COCOA',
            name: 'Enchanted Cocoa',
            aliases: ['E_COCOA']
        },
        {
            id: 'RED_GIFT',
            name: 'Red Gift',
            aliases: []
        },
        {
            id: 'ENCHANTED_RAW_BEEF',
            name: 'Enchanted Raw Beef',
            aliases: ['E_RAW_BEEF']
        },
        {
            id: 'SEEDS',
            name: 'Seeds',
            aliases: []
        },
        {
            id: 'ENCHANTED_LEATHER',
            name: 'Enchanted Leather',
            aliases: ['E_LEATHER']
        },
        {
            id: 'ENCHANTED_SPONGE',
            name: 'Enchanted Sponge',
            aliases: ['E_SPONGE']
        },
        {
            id: 'ENCHANTED_FEATHER',
            name: 'Enchanted Feather',
            aliases: ['E_FEATHER']
        },
        {
            id: 'ENCHANTED_SLIME_BLOCK',
            name: 'Enchanted Slime Block',
            aliases: ['E_SLIME_BLOCK']
        },
        {
            id: 'ENCHANTED_OAK_LOG',
            name: 'Enchanted Oak Wood',
            aliases: ['ENCHANTED_OAK', 'ENCHANTED_OAK_WOOD', 'E_OAK', 'E_OAK_LOG', 'E_OAK_WOOD']
        },
        {
            id: 'RABBIT_HIDE',
            name: 'Rabbit Hide',
            aliases: []
        },
        {
            id: 'WHITE_GIFT',
            name: 'White Gift',
            aliases: []
        },
        {
            id: 'INK_SACK',
            name: 'Ink Sack',
            aliases: []
        },
        {
            id: 'FLINT',
            name: 'Flint',
            aliases: []
        },
        {
            id: 'ENCHANTED_SPRUCE_LOG',
            name: 'Enchanted Spruce Wood',
            aliases: ['ENCHANTED_SPRUCE', 'ENCHANTED_SPRUCE_WOOD', 'E_SPRUCE', 'E_SPRUCE_LOG', 'E_SPRUCE_WOOD']
        },
        {
            id: 'WOLF_TOOTH',
            name: 'Wolf Tooth',
            aliases: []
        },
        {
            id: 'ENCHANTED_ROTTEN_FLESH',
            name: 'Enchanted Rotten Flesh',
            aliases: ['E_ROTTEN_FLESH', 'E_FLESH']
        },
        {
            id: 'ENCHANTED_GRILLED_PORK',
            name: 'Enchanted Grilled Pork',
            aliases: ['E_GRILLED_PORK']
        },
        {
            id: 'SULPHUR',
            name: 'Gunpowder',
            aliases: ['GUNPOWDER']
        },
        {
            id: 'NETHER_STALK',
            name: 'Nether Wart',
            aliases: ['NETHERWART', 'NETHER_WART']
        },
        {
            id: 'RABBIT',
            name: 'Raw Rabbit',
            aliases: ['RAW_RABBIT']
        },
        {
            id: 'ENCHANTED_NETHER_STALK',
            name: 'Enchanted Nether Wart',
            aliases: ['ENCHANTED_NETHER_WART', 'ENCHANTED_NETHERWART', 'E_NETHER_WART', 'E_NETHERWART']
        },
        {
            id: 'ENCHANTED_REDSTONE_BLOCK',
            name: 'Enchanted Redstone Block',
            aliases: ['E_REDSTONE_BLOCK']
        },
        {
            id: 'ENCHANTED_QUARTZ_BLOCK',
            name: 'Enchanted Quartz Block',
            aliases: ['E_QUARTZ_BLOCK']
        },
        {
            id: 'ENCHANTED_CARROT',
            name: 'Enchanted Carrot',
            aliases: ['ENCHANTED_CARROTS', 'E_CARROT', 'E_CARROTS']
        },
        {
            id: 'ENCHANTED_PUMPKIN',
            name: 'Enchanted Pumpkin',
            aliases: ['E_PUMPKIN']
        },
        {
            id: 'GREEN_CANDY',
            name: 'Green Candy',
            aliases: []
        },
        {
            id: 'ENCHANTED_REDSTONE',
            name: 'Enchanted Redstone',
            aliases: ['E_REDSTONE']
        },
        {
            id: 'ROTTEN_FLESH',
            name: 'Rotten Flesh',
            aliases: ['FLESH']
        },
        {
            id: 'ENCHANTED_COOKED_FISH',
            name: 'Enchanted Cooked Fish',
            aliases: ['E_COOKED_FISH']
        },
        {
            id: 'OBSIDIAN',
            name: 'Obsidian',
            aliases: []
        },
        {
            id: 'ENCHANTED_MAGMA_CREAM',
            name: 'Enchanted Magma Cream',
            aliases: ['E_MAGMA_CREAM']
        },
        {
            id: 'GRAVEL',
            name: 'Gravel',
            aliases: []
        },
        {
            id: 'MELON',
            name: 'Melon',
            aliases: []
        },
        {
            id: 'RAW_FISH:3',
            name: 'Pufferfish',
            aliases: ['PUFFERFISH']
        },
        {
            id: 'ENCHANTED_PRISMARINE_SHARD',
            name: 'Enchanted Prismarine Shard',
            aliases: ['E_PRISMARINE_SHARD']
        },
        {
            id: 'ENCHANTED_IRON_BLOCK',
            name: 'Enchanted Iron Block',
            aliases: ['E_IRON_BLOCK']
        },
        {
            id: 'LEATHER',
            name: 'Leather',
            aliases: []
        },
        {
            id: 'ENCHANTED_COOKED_MUTTON',
            name: 'Enchanted Cooked Mutton',
            aliases: ['E_COOKED_MUTTON']
        },
        {
            id: 'BONE',
            name: 'Bone',
            aliases: []
        },
        {
            id: 'RAW_FISH:1',
            name: 'Raw Salmon',
            aliases: ['RAW_SALMON']
        },
        {
            id: 'REVENANT_FLESH',
            name: 'Revenant Flesh',
            aliases: []
        },
        {
            id: 'ENCHANTED_PORK',
            name: 'Enchanted Pork',
            aliases: ['E_PORK']
        },
        {
            id: 'ENCHANTED_GLOWSTONE',
            name: 'Enchanted Glowstone',
            aliases: ['E_GLOWSTONE']
        },
        {
            id: 'ENCHANTED_BREAD',
            name: 'Enchanted Bread',
            aliases: ['E_BREAD']
        },
        {
            id: 'HAY_BLOCK',
            name: 'Hay Bale',
            aliases: ['HAY_BALE']
        },
        {
            id: 'ENCHANTED_HAY_BLOCK',
            name: 'Enchanted Hay Bale',
            aliases: ['ENCHANTED_HAY_BALE', 'E_HAY_BALE']
        },
        {
            id: 'FEATHER',
            name: 'Feather',
            aliases: []
        },
        {
            id: 'ENCHANTED_CHARCOAL',
            name: 'Enchanted Charcoal',
            aliases: ['E_CHARCOAL']
        },
        {
            id: 'ENCHANTED_BLAZE_POWDER',
            name: 'Enchanted Blaze Powder',
            aliases: ['E_BLAZE_POWDER']
        },
        {
            id: 'NETHERRACK',
            name: 'Netherrack',
            aliases: ['NETHER_RACK']
        },
        {
            id: 'SUMMONING_EYE',
            name: 'Summoning Eye',
            aliases: ['SEYE', 'EYE', 'EYES']
        },
        {
            id: 'SPONGE',
            name: 'Sponge',
            aliases: []
        },
        {
            id: 'BLAZE_ROD',
            name: 'Blaze Rod',
            aliases: []
        },
        {
            id: 'ENCHANTED_DARK_OAK_LOG',
            name: 'Enchanted Dark Oak Wood',
            aliases: ['ENCHANTED_DARK_OAK', 'ENCHANTED_DARK_OAK_WOOD', 'E_DARK_OAK', 'E_DARK_OAK_LOG', 'E_DARK_OAK_WOOD']
        },
        {
            id: 'ENCHANTED_BAKED_POTATO',
            name: 'Enchanted Baked Potato',
            aliases: ['E_BAKED_POTATO', 'EBP']
        },
        {
            id: 'COMPACTOR',
            name: 'Compactor',
            aliases: []
        },
        {
            id: 'ENCHANTED_DIAMOND',
            name: 'Enchanted Diamond',
            aliases: ['E_DIAMOND']
        },
        {
            id: 'ENCHANTED_GOLD',
            name: 'Enchanted Gold',
            aliases: ['E_GOLD']
        },
        {
            id: 'PROTECTOR_FRAGMENT',
            name: 'Protector Dragon Fragment',
            aliases: ['PROT_FRAG', 'PROTECTOR_FRAG', 'PROT_FRAGMENT', 'PROTECTOR_DRAGON_FRAG', 'PROTECTOR_DRAGON_FRAGMENT', 'PROT_DRAGON_FRAG', 'PROTECTOR_DRAGON_FRAG']
        },
        {
            id: 'OLD_FRAGMENT',
            name: 'Old Dragon Fragment',
            aliases: ['OLD_FRAG', 'OLD_DRAGON_FRAG', 'OLD_DRAGON_FRAGMENT']
        },
        {
            id: 'UNSTABLE_FRAGMENT',
            name: 'Unstable Dragon Fragment',
            aliases: ['UNSTABLE_FRAG', 'UNSTABLE_DRAGON_FRAG', 'UNSTABLE_DRAGON_FRAGMENT']
        },
        {
            id: 'STRONG_FRAGMENT',
            name: 'Strong Dragon Fragment',
            aliases: ['STRONG_FRAG', 'STRONG_DRAGON_FRAG', 'STRONG_DRAGON_FRAGMENT']
        },
        {
            id: 'YOUNG_FRAGMENT',
            name: 'Young Dragon Fragment',
            aliases: ['YOUNG_FRAG', 'YOUNG_DRAGON_FRAG', 'YOUNG_DRAGON_FRAGMENT']
        },
        {
            id: 'WISE_FRAGMENT',
            name: 'Wise Dragon Fragment',
            aliases: ['WISE_FRAG', 'WISE_DRAGON_FRAG', 'WISE_DRAGON_FRAGMENT']
        },
        {
            id: 'SUPERIOR_FRAGMENT',
            name: 'Superior Dragon Fragment',
            aliases: ['SUP_FRAG', 'SUPERIOR_FRAG', 'SUP_DRAGON_FRAG', 'SUPERIOR_DRAGON_FRAG', 'SUP_DRAGON_FRAGMENT', 'SUPERIOR_DRAGON_FRAGMENT']
        },
        {
            id: 'ENCHANTED_LAVA_BUCKET',
            name: 'Enchanted Lava Bucket',
            aliases: ['ELAVA', 'ELAVA_BUCKET']
        },
        {
            id: 'HAMSTER_WHEEL',
            name: 'Hamster Wheel',
            aliases: ['HAM_WHEEL']
        },
        {
            id: 'FOUL_FLESH',
            name: 'Foul Flesh',
            aliases: []
        },
        {
            id: 'CATALYST',
            name: 'Catalyst',
            aliases: []
        },
        {
            id: 'ENCHANTED_REDSTONE_LAMP',
            name: 'Enchanted Redstone Lamp',
            aliases: ['E_REDSTONE_LAMP', 'E_RED_LAMP', 'ERL']
        }
    ];

};
