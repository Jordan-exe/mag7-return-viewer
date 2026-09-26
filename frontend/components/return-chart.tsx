"use client";
import { Line, LineChart, XAxis, YAxis, Brush } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import type { SingleReturn } from "@/lib/api/client";

const config = { return: { label: "Return" } };

export function ReturnChart({ data }: { data: SingleReturn[] }) {
  return (
    <ChartContainer config={config} className="h-48 w-full">
      <LineChart data={data} syncId="returns">
        <XAxis dataKey="date"/>
        <YAxis/>
        <ChartTooltip
          content={
            <ChartTooltipContent
            labelFormatter={(label) => label}
            formatter={(value) =>(
              <div>
                <span>Return </span>
                <span>{value}</span>
              </div>
            )}
            />
          }
        />
        <Line dataKey="return" stroke="black" strokeWidth={1.5} dot={false} />
        <Brush dataKey="date" height={20} />
      </LineChart>
    </ChartContainer>
  );
}