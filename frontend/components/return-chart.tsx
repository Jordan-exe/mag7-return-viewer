"use client";
import { Line, LineChart, XAxis, YAxis, Brush, ReferenceLine } from "recharts";
import { format, isValid, parseISO } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ReturnValue } from "@/components/return-value";
import type { SingleReturn } from "@/lib/api/client";

const config = { return: { label: "Return", color: "var(--chart-1)" } };

function formatDate(value: unknown, pattern: string) {
    const d = parseISO(String(value));
    return isValid(d) ? format(d, pattern) : String(value);
}

const tickPercent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 1 });

export function ReturnChart({ data }: { data: SingleReturn[] }) {
    return (
        <ChartContainer config={config} className="aspect-auto h-48 w-full">
            <LineChart data={data} syncId="returns" margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={{ stroke: "var(--color-gray-300)" }}
                    tickFormatter={(d: string) => formatDate(d, "MMM d")}
                    minTickGap={24}
                />
                <YAxis
                    width={44}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => tickPercent.format(v)}
                />
                <ReferenceLine y={0} stroke="var(--color-gray-300)" strokeDasharray="3 3" />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(label) => formatDate(label, "MMM d, yyyy")}
                            formatter={(value) => (
                                <div className="flex w-full items-center justify-between gap-3">
                                    <span className="text-muted-foreground">Return</span>
                                    <ReturnValue value={Number(value)} className="font-medium" />
                                </div>
                            )}
                        />
                    }
                />
                <Line dataKey="return" stroke="var(--color-return)" strokeWidth={1.5} dot={false} />
                <Brush
                    dataKey="date"
                    height={20}
                    stroke="var(--color-teal)"
                    tickFormatter={(d: string) => formatDate(d, "MMM d")}
                />
            </LineChart>
        </ChartContainer>
    );
}
