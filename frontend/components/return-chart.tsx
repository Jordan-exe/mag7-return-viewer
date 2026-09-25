"use client";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartContainer} from "@/components/ui/chart";
import type { SingleReturn } from "@/lib/api/client";

const config = { return: { label: "Return" } };

export function ReturnChart({ data }: { data: SingleReturn[] }) {
  return (
    <ChartContainer config={config} className="h-48 w-full">
      <LineChart data={data}>
        <XAxis dataKey="date"/>
        <YAxis/>
        <Line dataKey="return" stroke="black" />
      </LineChart>
    </ChartContainer>
  );
}