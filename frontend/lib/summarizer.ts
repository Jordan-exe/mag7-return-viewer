export type SummaryStats = { min: number, max: number, mean: number }

export function summarize(data: number[]): SummaryStats {
    let low = Infinity;
    let high = -Infinity;
    let sum = 0;
    for (const x of data) {
        if (x < low) low = x;
        if (x > high) high = x;
        sum += x;
    }
    // TODO: The arithmetic mean here, or the geometric? Take home assessment spec is unclear.
    const avg = data.length > 0 ? sum / data.length : -Infinity
    return {min: low, max: high, mean: avg}
}