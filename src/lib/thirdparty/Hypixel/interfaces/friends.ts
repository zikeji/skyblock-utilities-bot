export interface HypixelFriendsResponse {
    success: boolean;
    records?: HypixelFriendsRecord[]
}

export interface HypixelFriendsRecord {
    _id: string;
    uuidSender: string;
    uuidReceiver: string;
    started: Date;
}
