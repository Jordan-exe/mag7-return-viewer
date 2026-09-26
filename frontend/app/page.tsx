"use client";
import { useState } from "react";
import { subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useReturns } from "@/hooks/use-returns";
import { ReturnsGrid } from "@/components/returns-grid";
import { DateSelector } from "@/components/date-selector";
import { SummaryTable } from "@/components/summary-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

export default function Home() {
    const [range, setRange] = useState<DateRange>(() => ({
        from: subMonths(new Date(), 1),
        to: new Date(),
    }));
    const { data, isLoading, isError, error, isFetching } = useReturns(range);

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
                    <SummaryTable data={data} from={range.from} to={range.to} />
                    <ReturnsGrid data={data} />
                </div>
            )}
        </main>
    );
}
