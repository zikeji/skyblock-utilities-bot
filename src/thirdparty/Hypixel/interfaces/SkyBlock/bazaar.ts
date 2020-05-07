import {BaseApiResponse} from "../../index";

export interface ProductResponse extends BaseApiResponse {
    product_info: {
        product_id: string;
        quick_status: {
            productId: string;
            buyPrice: number;
            buyVolume: number;
            buyMovingWeek: number;
            buyOrders: number;
            sellPrice: number;
            sellVolume: number;
            sellMovingWeek: number;
            sellOrders: number;
        }
        buy_summary: ProductSummaryItem[],
        sell_summary: ProductSummaryItem[],
        week_historic: {
            productId: string;
            timestamp: Date;
            nowBuyVolume: number;
            nowSellVolume: number;
            buyCoins: number;
            buyVolume: number;
            buys: number;
            sellCoins: number;
            sellVolume: number;
            sells: number;
        }[]
    }
}

interface ProductSummaryItem {
    amount: number;
    pricePerUnit: number;
    orders: number;
}
