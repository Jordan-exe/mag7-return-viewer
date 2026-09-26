"use client";
import { Line, LineChart, XAxis, Brush } from "recharts";
import { format, isValid, parseISO } from "date-fns";
import { ChartContainer } from "@/components/ui/chart";
import type { SingleReturn } from "@/lib/api/client";

export type DateWindow = { start: string; end: string };

const config = { return: { label: "Return", color: "var(--chart-1)" } };

function formatDate(value: unknown, pattern: string) {
    const d = parseISO(String(value));
    return isValid(d) ? format(d, pattern) : String(value);
}

export function TimelineBrush({
    data,
    onWindowChange,
}: {
    data: SingleReturn[];
    onWindowChange: (window: DateWindow) => void;
}) {
    return (
        <ChartContainer config={config} className="aspect-auto h-10 w-full">
            <LineChart data={data} syncId="returns" margin={{ top: 0, right: 4, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" hide />
                <Line dataKey="return" stroke="transparent" dot={false} isAnimationActive={false} />
                <Brush
                    dataKey="date"
                    height={20}
                    stroke="var(--color-teal)"
                    tickFormatter={(d: string) => formatDate(d, "MMM d")}
                    onChange={({ startIndex, endIndex }) => {
                        const start = data[startIndex]?.date;
                        const end = data[endIndex]?.date;
                        if (start && end) onWindowChange({ start, end });
                    }}
                />
            </LineChart>
        </ChartContainer>
    );
}
