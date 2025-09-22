"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function AddAssetForm({
  onAdd,
}: {
  onAdd: (ticker: string, qty: number) => Promise<void>;
}) {
  const [ticker, setTicker] = useState("");
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const quantityNumber = Number(qty);
    if (!ticker || !quantityNumber) return;
    setLoading(true);
    await onAdd(ticker.toUpperCase().trim(), quantityNumber);
    setTicker("");
    setQty("");
    setLoading(false);
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={submit}
      className="flex gap-2 items-center"
    >
      <motion.input
        className="px-3 py-2 border rounded-md w-40"
        placeholder="Ticker e.g. AAPL"
        value={ticker}
        whileFocus={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        onChange={(e) => setTicker(e.target.value)}
      />
      <motion.input
        className="px-3 py-2 border rounded-md w-28"
        placeholder="Quantity"
        value={qty}
        type="number"
        step="any"
        whileFocus={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        onChange={(e) => setQty(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="px-3 py-2 rounded-md bg-accent text-white disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </motion.form>
  );
}
