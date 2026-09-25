"use client";
import { useReturns } from "@/hooks/use-returns";
import { ReturnsGrid } from "@/components/returns-grid";

export default function Home() {
  const { data, isLoading, isError, error } = useReturns();
  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error: {error.message}</p>;
  if (!data) return null;

  return (
    <main className="mx-auto max-w-7xl p-6">
      <ReturnsGrid data={data} />
    </main>
  );
}