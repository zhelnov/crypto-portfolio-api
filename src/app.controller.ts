import { Controller, Get, Query } from '@nestjs/common';
import { ApiService } from './api';

@Controller()
export class AppController {
  constructor(private readonly apiService: ApiService) {}

  @Get('coins')
  async getSupportedCoins() {
    return this.apiService.getCoinsList();
  }

  @Get('currencies')
  async getSupportedCurrencies() {
    return this.apiService.getFiatCurrencies();
  }

  @Get('prices')
  async getCoinPrices(@Query('coins') coins: string[]) {
    return this.apiService.getCoinPrices(coins);
  }

  @Get('historical')
  async getHistoricalData(
    @Query('coin') coin: string,
    @Query('date') date: string,
  ) {
    return this.apiService.getHistoricalData(coin, date);
  }
}
