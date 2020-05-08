import {HypixelPlayer} from "./Player";

export class HypixelRank {
    protected id: number;
    protected name: string;
    protected options: { color?: string; prefix?: string; eulaMultiplier?: number };
    protected staff: boolean;

    constructor(id: number, name: string, options: { color?: string; prefix?: string; eulaMultiplier?: number }, staff: boolean = false) {
        this.id = id;
        this.name = name;
        this.options = options;
        this.staff = staff;
    }

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getCleanName(): string {
        if (this.name == 'NON_DONOR' || this.name == 'NONE') return 'DEFAULT';
        if (this.name == 'SUPERSTAR') return 'MVP++';
        return this.name.replace('_', ' ').replace('_PLUS', '+');
    }

    public getOptions(): any {
        return this.options;
    }

    public getPrefix(_: HypixelPlayer): string | null {
        // potentially expand this for colors https://github.com/Plancke/hypixel-php/blob/master/src/responses/player/Rank.php#L69
        return this.options.prefix ? this.options.prefix : null;
    }

    public getColor(): string | null {
        return this.options && this.options.color ? this.options.color : null;
    }

    public getMultiplier(): number {
        return this.options && this.options.eulaMultiplier ? this.options.eulaMultiplier : 1;
    }
}
