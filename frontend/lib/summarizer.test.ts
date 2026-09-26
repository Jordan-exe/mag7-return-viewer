import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/summarizer";

describe("summarize", () => {
    it("one number", () => {
        expect(summarize([1])).toEqual({ min: 1, max: 1, mean: 1, cumulative_return: 1 });
    });

    it("more than one number", () => {
        const s = summarize([1, 2, 3])!;
        expect(s.min).toBe(1);
        expect(s.max).toBe(3);
        expect(s.mean).toBeCloseTo(2, 10);
    });

    it("it compounds returns properly", () => {
        const s = summarize([0.1, 0.2, 0.3])!;
        const expected = 1.1 * 1.2 * 1.3 - 1;
        expect(s.cumulative_return).toBeCloseTo(expected, 10);
    });
});
