import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

export function useReturns() {
  const start = "2026-01-01"
  const end = "2026-09-25"

  return useQuery({
    queryKey: ["returns", start, end],
    enabled: true,
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