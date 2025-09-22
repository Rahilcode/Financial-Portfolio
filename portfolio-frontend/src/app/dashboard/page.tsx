"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Portfolio } from "../types";
import api from "../lib/api";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import PortfolioList from "../components/PortfolioList";
import AssetChartModal from "../components/AssetChartModel";

type Insight = {
  diversificationScore: number;
  recommendation: string;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selected, setSelected] = useState<Portfolio | null>(null);
  const [fetching, setFetching] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [historical, setHistorical] = useState<Record<string, number>>({});
  const [allocation, setAllocation] = useState<
    { ticker: string; weight: number }[]
  >([]);
  const [portfolioName, setPortfolioName] = useState("");
  const [insight, setInsight] = useState<Insight | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  async function fetchPortfolios() {
    try {
      setFetching(true);
      const res = await api.get<Portfolio[]>("/portfolios");
      setPortfolios(res.data);
      const first = res.data?.[0] ?? null;
      setSelected(first);
      computeAllocation(first);
      if (first) fetchInsights(first.id);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  }

  async function fetchInsights(portfolioId: string) {
    try {
      const res = await api.get<Insight>(`/portfolios/${portfolioId}/insights`);
      setInsight(res.data);
    } catch (e) {
      console.error("Error fetching insights", e);
      setInsight(null);
    }
  }

  async function handleAddAsset(
    portfolioId: string,
    ticker: string,
    qty: number
  ) {
    await api.post(`/portfolios/${portfolioId}/assets`, {
      ticker,
      quantity: qty,
    });
    await fetchPortfolios();
  }

  async function handleRemoveAsset(portfolioId: string, assetId: string) {
    await api.delete(`/portfolios/${portfolioId}/assets/${assetId}`);
    await fetchPortfolios();
  }

  async function openChart(portfolioId: string, ticker: string) {
    const res = await api.get<Record<string, number>>(
      `/market-data/${portfolioId}/assets/${ticker}/history?days=30`
    );
    setHistorical(res.data);
    const p = portfolios.find((x) => x.id === portfolioId);
    computeAllocation(p ?? null);
    setChartOpen(true);
  }

  function computeAllocation(p: Portfolio | null) {
    if (!p || !p.assets || p.assets.length === 0) {
      setAllocation([]);
      setInsight(null);
      return;
    }
    const total = Number(
      p.totalValue ??
        p.assets.reduce((s, a) => s + Number(a.totalValue ?? 0), 0)
    );
    const arr = p.assets.map((a) => ({
      ticker: a.ticker,
      weight: total ? Number(a.totalValue ?? 0) / total : 0,
    }));
    setAllocation(arr);

    // fetch insights for the selected portfolio
    fetchInsights(p.id);
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-6">
        <div className="flex gap-6">
          <aside className="w-80 bg-white p-4 rounded-2xl shadow-soft">
            <h3 className="font-semibold mb-3">Your portfolios</h3>
            <div className="space-y-3">
              {fetching ? (
                <Spinner />
              ) : (
                <>
                  {portfolios.length === 0 && (
                    <div className="mb-3 text-gray-500">No portfolios yet</div>
                  )}

                  {portfolios.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelected(p);
                        computeAllocation(p);
                      }}
                      className={`p-3 rounded-md cursor-pointer ${
                        selected?.id === p.id ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">
                        ${Number(p.totalValue ?? 0).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  {/* Inline Create Portfolio Form */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!portfolioName.trim()) return;
                      await api.post("/portfolios", {
                        name: portfolioName.trim(),
                      });
                      setPortfolioName("");
                      fetchPortfolios();
                    }}
                    className="mt-4 flex gap-2"
                  >
                    <input
                      type="text"
                      value={portfolioName}
                      onChange={(e) => setPortfolioName(e.target.value)}
                      placeholder="New portfolio name"
                      className="px-3 py-2 border rounded-md flex-1"
                    />
                    <button className="px-3 py-2 bg-accent text-white rounded-md">
                      Create
                    </button>
                  </form>
                </>
              )}
            </div>
          </aside>

          <section className="flex-1">
            {selected ? (
              <div className="space-y-6">
                <PortfolioList
                  portfolio={selected}
                  onAddAsset={handleAddAsset}
                  onRemoveAsset={handleRemoveAsset}
                  onOpenChart={openChart}
                />

                {/* Insights Section */}
                {insight && (
                  <div className="bg-white p-6 rounded-2xl shadow-soft">
                    <h3 className="text-lg font-semibold mb-2">Insights</h3>
                    <p>
                      <strong>Diversification Score:</strong>{" "}
                      {insight.diversificationScore}
                    </p>
                    <p>
                      <strong>Recommendation:</strong> {insight.recommendation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-soft">
                Select or create a portfolio to view details.
              </div>
            )}
          </section>
        </div>
      </main>

      <AssetChartModal
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        historicalMap={historical}
        allocation={allocation}
      />
    </>
  );
}
