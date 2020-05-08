export interface HypixelKeyResponse {
    success: boolean;
    cause?: string;
    record?: {
        ownerUuid: string;
        key: string;
        totalQueries?: number;
    }
}
