import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnChart } from "@/components/return-chart";
import { SummaryRow } from "./summary-row";
import { summarize } from "@/lib/summarizer";
import type { SingleReturn } from "@/lib/api/client";

export function TickerCard({ ticker, data }: { ticker: string; data: SingleReturn[] }) {
    const summary = summarize(data.map((d) => d.return));

    return (
        <Card>
            <CardHeader>
                <CardTitle>{ticker}</CardTitle>
            </CardHeader>
            <CardContent>
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
