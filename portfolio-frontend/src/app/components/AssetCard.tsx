"use client";
import { motion } from "framer-motion";
import { Asset } from "../types";

export default function AssetCard({
  asset,
  onOpenChart,
  onRemove,
}: {
  asset: Asset;
  onOpenChart: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className="bg-white p-4 rounded-2xl shadow-soft flex items-center justify-between gap-4"
    >
      <div>
        <div className="text-sm text-gray-500">Ticker</div>
        <div className="text-lg font-semibold">{asset.ticker}</div>
        <div className="text-sm text-gray-500 mt-1">Qty: {asset.quantity}</div>
      </div>

      <div className="text-right">
        <div className="text-sm text-gray-500">Price</div>
        <div className="text-lg font-medium">
          ${Number(asset.currentPrice ?? 0).toFixed(2)}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Value ${Number(asset.totalValue ?? 0).toFixed(2)}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button onClick={onOpenChart} className="text-sm text-accent underline">
          Chart
        </button>
        <button onClick={onRemove} className="text-sm text-red-500">
          Remove
        </button>
      </div>
    </motion.div>
  );
}
