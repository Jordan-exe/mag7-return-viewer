import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { summarize } from "@/lib/summarizer";
import type { SingleReturn } from "@/lib/api/client";
import { min } from "date-fns";

type Row = {
    ticker: string;
    total_return: number | null;
    best: number | null;
    worst: number | null;
};

function toRow(ticker: string, series: SingleReturn[]): Row {
    const returns = series.map((d) => d.return);
    const summary = summarize(returns);
    return {
        ticker,
        total_return: summary.cumulative_return,
        best: summary.max,
        worst: summary.min,
    };
}
function descReturns(a: Row, b: Row) {
    if (a.total_return === null) return 1;
    if (b.total_return === null) return -1;
    return b.total_return - a.total_return;
}

export function SummaryTable({
    data,
    from,
    to,
}: {
    data: Record<string, SingleReturn[]>;
    from: Date | undefined;
    to: Date | undefined;
}) {
    const rows = Object.entries(data)
        .map(([ticker, series]) => toRow(ticker, series))
        .sort(descReturns);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Summary ({from?.toLocaleDateString()} - {to?.toLocaleDateString()})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticker</TableHead>
                            <TableHead className="text-right">Total return</TableHead>
                            <TableHead className="text-right">Best day</TableHead>
                            <TableHead className="text-right">Worst day</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.ticker}>
                                <TableCell className="font-medium">{r.ticker}</TableCell>
                                <TableCell className="text-right tabular-nums">{r.total_return}</TableCell>
                                <TableCell className="text-right tabular-nums">{r.best}</TableCell>
                                <TableCell className="text-right tabular-nums">{r.worst}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
