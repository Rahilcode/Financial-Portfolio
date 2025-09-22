"use client";
import AssetCard from "./AssetCard";
import AddAssetForm from "./AddAssetForm";
import { Portfolio } from "../types";

export default function PortfolioList({
  portfolio,
  onAddAsset,
  onRemoveAsset,
  onOpenChart,
}: {
  portfolio: Portfolio;
  onAddAsset: (
    portfolioId: string,
    ticker: string,
    qty: number
  ) => Promise<void>;
  onRemoveAsset: (portfolioId: string, assetId: string) => Promise<void>;
  onOpenChart: (portfolioId: string, ticker: string) => Promise<void>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{portfolio.name}</h2>
        <div className="text-sm text-gray-500">
          Total: ${Number(portfolio.totalValue ?? 0).toFixed(2)}
        </div>
      </div>

      <div className="space-y-3">
        {portfolio.assets.length > 0 ? (
          portfolio.assets.map((a) => (
            <AssetCard
              key={a.id}
              asset={a}
              onOpenChart={() => onOpenChart(portfolio.id, a.ticker)}
              onRemove={() => onRemoveAsset(portfolio.id, a.id)}
            />
          ))
        ) : (
          <div className="text-gray-500">
            Your portfolio is empty. Add assets to get started.
          </div>
        )}
      </div>

      <div className="pt-3 border-t">
        <AddAssetForm onAdd={(t, q) => onAddAsset(portfolio.id, t, q)} />
      </div>
    </div>
  );
}
