export interface ItemsListResponse {
    page: number;
    item: {
        name: string;
        id: string;
        texture: string;
        tag: string;
        itemId: string;
        stats: {
            min: string;
            max: string;
            mode: string;
            average: string;
            averageFiltered: string;
            median: string;
        }
    }[]
}
