const SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];

export function AbbreviateNumber(number: number) {
    const tier = Math.log10(number) / 3 | 0;

    if (tier == 0) return number;

    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    const scaled = number / scale;

    return scaled < 10 ? TruncateDecimals(scaled, 1) + suffix : TruncateDecimals(scaled, 0) + suffix;
}

function TruncateDecimals(value, digits: number) {
    const re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = value.toString().match(re);
    return m ? parseFloat(m[1]) : value.valueOf();
}
