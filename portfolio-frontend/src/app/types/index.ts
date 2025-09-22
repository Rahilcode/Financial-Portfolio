export type Asset = {
  id: string;
  ticker: string;
  quantity: number;
  avgPrice?: string | number | null;
  currentPrice?: number | string | null;
  totalValue?: number | string | null;
};

export type Portfolio = {
  id: string;
  name: string;
  assets: Asset[];
  totalValue: number | string;
};
