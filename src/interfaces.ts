export interface Coin {
  id: string;
  name: string;
  symbol: string;
}

export interface CoinPrice {
  currency: string;
  price: number;
}

export interface CoinChartPrice {
  coin: string;
  price: string;
}

export interface CoinPrices {
  coin: string;
  prices: CoinPrice[];
}

export interface ChartData {
  timestamp: number;
  prices: CoinChartPrice[];
}
