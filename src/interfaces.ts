export interface CoinPrice {
  currency: string;
  price: number;
}

export interface CoinPrices {
  coin: string;
  prices: CoinPrice[];
}
