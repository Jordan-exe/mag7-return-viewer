import { TickerCard } from "@/components/ticker-card";
import type { ReturnsData } from "@/lib/api/client";

export function ReturnsGrid({ data }: { data: ReturnsData }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Object.entries(data).map(([ticker, series]) => (
        <TickerCard key={ticker} ticker={ticker} data={series} />
      ))}
    </div>
  );
}