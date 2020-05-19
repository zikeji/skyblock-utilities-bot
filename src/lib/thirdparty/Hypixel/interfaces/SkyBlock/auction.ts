import {BaseApiResponse} from "../../index";

export interface AuctionResponse extends BaseApiResponse {
    fetched: Date;
    auctions?: Array<AuctionItem>;
}

export interface AuctionItem {
    _id: string;
    uuid: string;
    auctioneer: string;
    profile_id: string;
    coop: Array<string>;
    start: number;
    end: number;
    bin?: boolean;
    item_name: string;
    item_lore: string;
    extra: string;
    category: string;
    tier: string;
    starting_bid: number;
    item_bytes: {
        type: number;
        data: string;
    },
    claimed: boolean;
    claimed_bidders: Array<string>;
    highest_bid_amount: number;
    bids: {
        auction_id: string;
        bidder: string;
        profile_id: string;
        amount: number;
        timestamp: number;
    }[]
}
