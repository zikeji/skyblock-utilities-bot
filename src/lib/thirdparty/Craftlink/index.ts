import {post} from 'web-request';
import {cache} from "../../../cache";
import {ItemsListResponse} from "./interfaces/itemsList";
import matchSorter from 'match-sorter';

export class Craftlink {
    public static async itemsList(query: string): Promise<ItemsListResponse> {
        const result = await cache.wrap(`craftlink:itemslist:${query.toLowerCase()}`, () => {
            return post(`https://auctions.craftlink.xyz/graphql`, {
                json: true,
                body: {
                    operationName: 'ItemsList',
                    variables: {
                        page: 1,
                        items: 10,
                        limit: 100,
                        name: query
                    },
                    query:
                        `query ItemsList($page: Int, $items: Int, $name: String) {
                            itemList(page: $page, items: $items, name: $name) {
                                page
                                item {
                                    name
                                    id
                                    texture
                                    tag
                                    itemId
                                    stats {
                                        min
                                        max
                                        mode
                                        average
                                        averageFiltered
                                        median
                                        __typename
                                    }
                                    __typename
                                }
                                __typename
                            }
                        }`
                }
            });
        }, {ttl: 60 * 5});
        if (result.body && result.body.data && result.body.data.itemList) {
            result.body.data.itemList.item = matchSorter(result.body.data.itemList.item, query, {keys: ['name']});
            return result.body.data.itemList;
        }
        throw "Invalid";
    }
}
