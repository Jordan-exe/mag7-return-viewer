import { describe, expect, it } from "vitest";
import { summarize } from "@/lib/summarizer"

describe("summarize", () => {
  it("one number", () => {
    expect(summarize([1])).toEqual({ min: 1, max: 1, mean: 1 });
  });

  it("more than one number", () => {
    const s = summarize([1, 2, 3])!;
    expect(s.min).toBe(1);
    expect(s.max).toBe(3);
    expect(s.mean).toBeCloseTo(2, 10);
  });
})