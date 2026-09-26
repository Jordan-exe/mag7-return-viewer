import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnChart } from "@/components/return-chart";
import { ReturnValue } from "@/components/return-value";
import { SummaryRow } from "./summary-row";
import { summarize } from "@/lib/summarizer";
import type { SingleReturn } from "@/lib/api/client";

export function TickerCard({ ticker, data }: { ticker: string; data: SingleReturn[] }) {
    const summary = summarize(data.map((d) => d.return));

    return (
        <Card className="border-t-2 border-t-navy">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-navy">{ticker}</CardTitle>
                {data.length > 0 && (
                    <CardAction className="text-right">
                        <div className="text-[0.6875rem] font-bold uppercase tracking-wide text-muted-foreground">
                            Total
                        </div>
                        <ReturnValue value={summary.cumulative_return} className="text-base font-bold" />
                    </CardAction>
                )}
            </CardHeader>
            <CardContent className="space-y-3">
                {data.length ? (
                    <>
                        <SummaryRow stats={summary} />
                        <ReturnChart data={data} />
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground">No data for this range.</p>
                )}
            </CardContent>
        </Card>
    );
}
