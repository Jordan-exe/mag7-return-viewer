import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReturnChart } from "@/components/return-chart";
import type { SingleReturn } from "@/lib/api/client";

export function TickerCard({ ticker, data }: { ticker: string; data: SingleReturn[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ticker}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length ? <ReturnChart data={data} /> : <p className="text-sm text-muted-foreground">No data for this range.</p>}
      </CardContent>
    </Card>
  );
}