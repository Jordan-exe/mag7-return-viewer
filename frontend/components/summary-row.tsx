import { SummaryStats } from "@/lib/summarizer";

export function SummaryRow({stats}: {stats: SummaryStats}) {
    const info = [
    { label: "Min", value: stats.min },
    { label: "Mean (daily, arithmetic)", value: stats.mean },
    { label: "Max", value: stats.max },
  ];

  return (
    <dl>
        {info.map(({ label, value }) => (
            <div key={label}>
                <dt>{label}</dt>
                <dd className="tabular-nums">{value}</dd>
            </div>
        ))}
    </dl>
  )
}