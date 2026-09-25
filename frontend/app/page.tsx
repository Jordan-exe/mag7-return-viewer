"use client";
import { useReturns } from "@/hooks/use-returns";

export default function Home() {
  const { data, isLoading, isError, error } = useReturns();
  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error: {error.message}</p>;
  return (
    <div>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}