import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { descReturns, toRow } from "@/lib/summary-rows";
import type { SingleReturn } from "@/lib/api/client";
import { format } from "date-fns";
import { ReturnValue } from "@/components/return-value";

const headClass = "text-[0.6875rem] font-bold uppercase tracking-wide text-navy";

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
        <Card className="border-t-2 border-t-navy">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-navy">Summary</CardTitle>
                <CardDescription>
                    {from && format(from, "MMM d, yyyy")} – {to && format(to, "MMM d, yyyy")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={headClass}>Ticker</TableHead>
                            <TableHead className={`text-right ${headClass}`}>Total return</TableHead>
                            <TableHead className={`text-right ${headClass}`}>Best day</TableHead>
                            <TableHead className={`text-right ${headClass}`}>Worst day</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((r) => (
                            <TableRow key={r.ticker}>
                                <TableCell className="font-bold text-navy">{r.ticker}</TableCell>
                                <TableCell className="text-right font-bold">
                                    <ReturnValue value={r.total_return} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <ReturnValue value={r.best} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <ReturnValue value={r.worst} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
