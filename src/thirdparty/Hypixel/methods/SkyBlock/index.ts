import {HypixelApiWrapper} from "../../util/wrapper";
import {Auction} from "./auction";
import {Bazaar} from "./bazaar";
import {Profile} from "./profile";

export class SkyBlock extends HypixelApiWrapper {
    public readonly Auction: Auction;
    public readonly Bazaar: Bazaar;
    public readonly Profile: Profile;

    constructor(key: string) {
        super(key);
        this.Auction = new Auction(key);
        this.Bazaar = new Bazaar(key);
        this.Profile = new Profile(key);
    }
}
