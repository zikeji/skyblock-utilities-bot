import * as prettyMilliseconds from "pretty-ms";

export class ETA {
    private readonly etaBufferLength: number;
    private valueBuffer: number[];
    private timeBuffer: number[];
    private eta: string = '0';

    constructor(length: number = 10, initTime: number = new Date().getTime(), initValue: number = 0) {
        this.etaBufferLength = length || 100;
        this.valueBuffer = [initValue];
        this.timeBuffer = [initTime];
    }

    public update(value: number, total: number) {
        this.valueBuffer.push(value);
        this.timeBuffer.push(new Date().getTime());

        this.calculate(total - value);
    }

    public getEta(): string {
        return this.eta;
    }

    private calculate(remaining: number) {
        const currentBufferSize = this.valueBuffer.length;
        const buffer = Math.min(this.etaBufferLength, currentBufferSize);

        const v_diff = this.valueBuffer[currentBufferSize - 1] - this.valueBuffer[currentBufferSize - buffer];
        const t_diff = this.timeBuffer[currentBufferSize - 1] - this.timeBuffer[currentBufferSize - buffer];

        const vt_rate = v_diff / t_diff;

        this.valueBuffer = this.valueBuffer.slice(-this.etaBufferLength);
        this.timeBuffer = this.timeBuffer.slice(-this.etaBufferLength);

        const eta = Math.ceil(remaining / vt_rate);

        if (isNaN(eta)) {
            this.eta = 'Unknown';
        } else if (!isFinite(eta)) {
            this.eta = '∞';
        } else if (eta > 100000000) {
            this.eta = '∞';

        } else {
            this.eta = prettyMilliseconds(eta, {secondsDecimalDigits: 0});
        }
    }
}
