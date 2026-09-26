import { TickerCard } from "@/components/ticker-card";
import type { ReturnsData } from "@/lib/api/client";

export function ReturnsGrid({ chartData, statsData }: { chartData: ReturnsData; statsData: ReturnsData }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(chartData).map(([ticker, series]) => (
                <TickerCard key={ticker} ticker={ticker} chartData={series} statsData={statsData[ticker] ?? []} />
            ))}
        </div>
    );
}
