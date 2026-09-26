import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

export function useReturns(range: DateRange) {
    const start = range.from && format(range.from, "yyyy-MM-dd");
    const end = range.to && format(range.to, "yyyy-MM-dd");

    return useQuery({
        queryKey: ["returns", start, end],
        enabled: !!start && !!end && start < end,
        placeholderData: keepPreviousData,
        queryFn: async ({ signal }) => {
            const { data, response } = await api.GET("/returns", {
                params: { query: { start: start!, end: end! } },
                signal,
            });
            if (!response.ok || !data) throw new Error(`Request failed (${response.status})`);
            return data;
        },
    });
}
