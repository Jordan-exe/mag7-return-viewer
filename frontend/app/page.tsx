"use client";
import { useState } from "react";
import { subMonths } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useReturns } from "@/hooks/use-returns";
import { ReturnsGrid } from "@/components/returns-grid";
import { DateSelector } from "@/components/date-selector";
import { SummaryTable } from "@/components/summary-table";

export default function Home() {
    const [range, setRange] = useState<DateRange>(() => ({
        from: subMonths(new Date(), 1),
        to: new Date(),
    }));
    const { data, isLoading, isError, error, isFetching } = useReturns(range);

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <DateSelector value={range} onChange={setRange} />

            {isLoading && <p>Loading…</p>}
            {isError && <p className="text-destructive">Error: {error.message}</p>}
            {data && (
                <div className={isFetching ? "opacity-60 transition-opacity" : ""}>
                    <SummaryTable data={data} from={range.from} to={range.to} />
                    <ReturnsGrid data={data} />
                </div>
            )}
        </main>
    );
}
