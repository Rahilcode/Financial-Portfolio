"use client";
import { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function AssetChartModal({
  open,
  onClose,
  historicalMap,
  allocation,
}: {
  open: boolean;
  onClose: () => void;
  historicalMap: Record<string, number>;
  allocation: { ticker: string; weight: number }[];
}) {
  if (!open) return null;

  const [range, setRange] = useState<"30D" | "1Y" | "3Y">("30D");

  // Determine start date for filter
  const now = new Date();
  const startDate = {
    "30D": new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
    "1Y": new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
    "3Y": new Date(now.getFullYear() - 3, now.getMonth(), now.getDate()),
  }[range];

  // Filter based on chosen range
  const filteredEntries = Object.entries(historicalMap)
    .filter(([date]) => new Date(date) >= startDate)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());

  const labels = filteredEntries.map(([date]) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: range === "30D" ? undefined : "numeric",
      day: range === "30D" ? "numeric" : undefined,
    })
  );

  const values = filteredEntries.map(([_, value]) => value);

  // Line chart
  const data = {
    labels,
    datasets: [
      {
        label: "Close",
        data: values,
        tension: 0.2,
        fill: true,
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderColor: "rgba(34, 197, 94, 1)",
        pointRadius: 2,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      x: {
        ticks: { autoSkip: true, maxRotation: 45, minRotation: 30 },
      },
      y: { beginAtZero: false },
    },
  };

  // Pie chart colors
  const pieColors = [
    "#3b82f6",
    "#f97316",
    "#ef4444",
    "#facc15",
    "#10b981",
    "#8b5cf6",
  ];

  const pie = {
    labels: allocation.map((a) => a.ticker),
    datasets: [
      {
        data: allocation.map((a) => a.weight),
        backgroundColor: allocation.map(
          (_, idx) => pieColors[idx % pieColors.length]
        ),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/30 z-40" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-xl p-6 max-w-3xl w-full shadow-2xl z-50"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Historical Price</h3>
          <button className="text-sm text-gray-500" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Range Buttons */}
        <div className="flex gap-2 mb-4">
          {["30D", "1Y", "3Y"].map((r) => (
            <button
              key={r}
              className={`px-3 py-1 rounded ${
                range === r
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setRange(r as "30D" | "1Y" | "3Y")}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Line data={data} options={options} />
          </div>
          <div>
            <h4 className="text-sm text-gray-500 mb-2">Allocation</h4>
            <Pie data={pie} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
