import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { descReturns, toRow } from "@/lib/summary-rows";
import type { SingleReturn } from "@/lib/api/client";

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
