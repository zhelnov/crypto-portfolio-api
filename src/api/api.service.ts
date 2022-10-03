import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import * as Bluebird from 'bluebird';

import { Coin, CoinPrice, CoinPrices } from '../interfaces';

export const ALLOWED_COINS = ['bitcoin', 'ethereum', 'ripple', 'tether'];

export const ALLOWED_CURRENCIES = ['usd', 'eur', 'uah'];

@Injectable()
export class ApiService {
  private coinsListCache: Coin[] | null = null;

  constructor(private readonly httpService: HttpService) {}

  async getCoinsList(): Promise<Coin[]> {
    if (!this.coinsListCache) {
      const data = await this.request({ url: 'coins/list' });
      this.coinsListCache = data.filter(({ id }) => ALLOWED_COINS.includes(id));
    }
    return this.coinsListCache;
  }

  async getFiatCurrencies(): Promise<string[]> {
    return ALLOWED_CURRENCIES;
  }

  async getSupportedCurrencies() {
    return this.request({ url: 'simple/supported_vs_currencies' });
  }

  async getCoinPrices(coins: string[]): Promise<CoinPrices[]> {
    const data = await this.request({
      url: 'simple/price',
      params: {
        ids: coins.join(),
        vs_currencies: ALLOWED_CURRENCIES.join(','),
      },
    });
    const result: CoinPrices[] = [];
    for (const [coin, prices] of Object.entries(data)) {
      const item: CoinPrices = {
        coin,
        prices: [],
      };
      for (const [currency, price] of Object.entries(prices)) {
        item.prices.push({ currency, price });
      }
      result.push(item);
    }
    return result;
  }

  async getHistoricalData(coin: string, date: string): Promise<CoinPrice[]> {
    const data = await this.request({
      url: `coins/${coin}/history`,
      params: {
        localization: false,
        date,
      },
    });
    const result: CoinPrice[] = [];
    for (const currency of ALLOWED_CURRENCIES) {
      result.push({
        currency,
        price: data.market_data.current_price[currency],
      });
    }
    return result;
  }

  private async request(config: AxiosRequestConfig) {
    try {
      const { data } = await firstValueFrom(this.httpService.request(config));
      return data;
    } catch (error: any) {
      if (error?.response?.status === 429) {
        const delay = error.response.headers['retry-after'] * 1000;
        console.log(`Waiting ${delay} ms`);
        await Bluebird.delay(delay);
        return this.request(config);
      }
      console.error(error);
      throw error;
    }
  }
}
