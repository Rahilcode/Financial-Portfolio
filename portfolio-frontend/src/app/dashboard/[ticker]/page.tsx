"use client";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function TickerPage({
  params,
  portfolioId,
}: {
  params: { ticker: string };
  portfolioId: string;
}) {
  const { ticker } = params;
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.get(
          `/market-data/${portfolioId}/assets/${ticker}/history?days=30`
        );
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ticker, portfolioId]);

  if (loading) return <div className="p-6">Loading chart...</div>;

  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${ticker} Price`,
        data: values,
        borderColor: "#4F46E5",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{ticker} - 30 Day History</h1>
      <div className="mt-4 bg-white p-4 rounded-2xl shadow-soft">
        <Line data={chartData} />
      </div>
    </div>
  );
}
