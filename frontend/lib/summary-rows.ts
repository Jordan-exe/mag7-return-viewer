import { summarize } from "@/lib/summarizer";
import type { SingleReturn } from "@/lib/api/client";

export type Row = {
    ticker: string;
    total_return: number | null;
    best: number | null;
    worst: number | null;
};

export function toRow(ticker: string, series: SingleReturn[]): Row {
    const returns = series.map((d) => d.return);
    const summary = summarize(returns);
    return {
        ticker,
        total_return: summary.cumulative_return,
        best: summary.max,
        worst: summary.min,
    };
}
export function descReturns(a: Row, b: Row) {
    if (a.total_return === null) return 1;
    if (b.total_return === null) return -1;
    return b.total_return - a.total_return;
}
