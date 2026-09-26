import { SummaryStats } from "@/lib/summarizer";
import { ReturnValue } from "@/components/return-value";

export function SummaryRow({ stats }: { stats: SummaryStats }) {
    const info = [
        { label: "Min", value: stats.min },
        { label: "Mean (daily, arithmetic)", value: stats.mean },
        { label: "Max", value: stats.max },
    ];

    return (
        <dl className="grid grid-cols-3 gap-2 border-b border-border pb-3">
            {info.map(({ label, value }) => (
                <div key={label} className="flex flex-col justify-between gap-1">
                    <dt className="text-[0.6875rem] leading-tight font-bold uppercase tracking-wide text-navy">
                        {label}
                    </dt>
                    <dd className="text-sm font-medium">
                        <ReturnValue value={value} />
                    </dd>
                </div>
            ))}
        </dl>
    );
}
