import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/summarizer";
import { descReturns, toRow } from "@/lib/summary-rows";
import type { ReturnsData } from "@/lib/api/client";
import fixture from "./fixtures/returns_2022-05-23_2022-08-31.json";

// Captured by backend/scripts/capture_fixture.py. Covers the 2022 AMZN, GOOGL and TSLA splits.
const data: ReturnsData = fixture;

describe("baseline: returns_2022-05-23_2022-08-31", () => {
    it("summary table rows", () => {
        // Same derivation as SummaryTable
        const rows = Object.entries(data)
            .map(([ticker, series]) => toRow(ticker, series))
            .sort(descReturns);
        expect(rows).toMatchSnapshot();
    });

    it("ticker card stats", () => {
        // Same derivation as TickerCard
        const stats = Object.fromEntries(
            Object.entries(data).map(([ticker, series]) => [ticker, summarize(series.map((d) => d.return))]),
        );
        expect(stats).toMatchSnapshot();
    });

    it("has no unadjusted split days", () => {
        for (const series of Object.values(data)) {
            for (const d of series) expect(d.return).toBeGreaterThan(-0.5);
        }
    });
});
