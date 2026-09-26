"use client";
import { useState } from "react";
import { subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useReturns } from "@/hooks/use-returns";
import { ReturnsGrid } from "@/components/returns-grid";
import { TimelineBrush, type DateWindow } from "@/components/timeline-brush";
import { DateSelector } from "@/components/date-selector";
import { SummaryTable } from "@/components/summary-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import type { ReturnsData } from "@/lib/api/client";

function filterByWindow(data: ReturnsData, window: DateWindow): ReturnsData {
    return Object.fromEntries(
        Object.entries(data).map(([ticker, series]) => [
            ticker,
            series.filter((d) => d.date >= window.start && d.date <= window.end),
        ]),
    );
}

export default function Home() {
    const [range, setRange] = useState<DateRange>(() => ({
        from: subMonths(new Date(), 1),
        to: new Date(),
    }));
    const { data, isLoading, isError, error, isFetching } = useReturns(range);

    // Reset the brush window (and remount the brush) whenever a new data object arrives.
    const [brush, setBrush] = useState<{
        data: ReturnsData | undefined;
        window: DateWindow | null;
        generation: number;
    }>(() => ({ data, window: null, generation: 0 }));
    if (brush.data !== data) {
        setBrush((b) => ({ data, window: null, generation: b.generation + 1 }));
    }

    const brushSeries = data ? (Object.values(data)[0] ?? []) : [];
    const fullWindow: DateWindow | null = brushSeries.length
        ? { start: brushSeries[0].date, end: brushSeries[brushSeries.length - 1].date }
        : null;
    const statsData = data && brush.window ? filterByWindow(data, brush.window) : data;

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wide text-gray-600">Date range</h2>
                <DateSelector value={range} onChange={setRange} />
            </div>

            {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {isError && (
                <Alert variant="destructive">
                    <AlertDescription>Error: {error.message}</AlertDescription>
                </Alert>
            )}
            {data && (
                <div className={cn("space-y-6", isFetching && "opacity-60 transition-opacity")}>
                    <SummaryTable
                        data={statsData ?? data}
                        from={range.from}
                        to={range.to}
                        window={brush.window ?? fullWindow}
                    />
                    <div>
                        <TimelineBrush
                            key={brush.generation}
                            data={brushSeries}
                            onWindowChange={(window) => setBrush((b) => ({ ...b, window }))}
                        />
                        <h2 className="text-xs font-bold tracking-wide text-gray-600">
                            Drag along this Timeline Brush to zoom/truncate the charts and summaries.
                        </h2>
                    </div>
                    <ReturnsGrid chartData={data} statsData={statsData ?? data} />
                </div>
            )}
        </main>
    );
}
