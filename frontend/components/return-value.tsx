import { cn } from "@/lib/utils";

const percent = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
});

export function formatReturn(value: number | null | undefined): string {
    return value == null || !Number.isFinite(value) ? "—" : percent.format(value);
}

export function ReturnValue({ value, className }: { value: number | null | undefined; className?: string }) {
    const tone =
        value == null || !Number.isFinite(value) || value === 0
            ? "text-muted-foreground"
            : value > 0
              ? "text-positive"
              : "text-negative";
    return <span className={cn("tabular-nums", tone, className)}>{formatReturn(value)}</span>;
}
