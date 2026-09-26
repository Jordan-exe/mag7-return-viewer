export type SummaryStats = { min: number; max: number; mean: number; cumulative_return: number };

export function summarize(data: number[]): SummaryStats {
    let low = Infinity;
    let high = -Infinity;
    let sum = 0;
    let compounding = 1;
    for (const x of data) {
        if (x < low) low = x;
        if (x > high) high = x;
        sum += x;
        compounding *= 1 + x;
    }
    const avg = data.length > 0 ? sum / data.length : -Infinity;
    const cr = compounding - 1;
    return { min: low, max: high, mean: avg, cumulative_return: cr };
}
