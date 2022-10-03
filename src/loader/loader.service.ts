import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';

import { ALLOWED_COINS, ApiService } from '../api';
import { PriceEntity } from '../entities/price.entity';

const START_DATE = '01-01-2022';

@Injectable()
export class LoaderService {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    private readonly apiService: ApiService,
  ) {
    this.loadData();
  }

  private async loadData(startDate?: moment.Moment) {
    const date = startDate || (await this.getStartDate());
    const toInsert: PriceEntity[] = [];
    for (const coin of ALLOWED_COINS) {
      console.log(`Loading ${date}, ${coin}`);
      const prices = await this.apiService.getHistoricalData(
        coin,
        date.format('DD-MM-YYYY'),
      );
      const base = {
        coin,
        date: date.toDate(),
      };
      for (const { currency, price } of prices) {
        toInsert.push({
          ...base,
          currency,
          price: price.toString(),
        });
      }
    }
    await this.priceRepository.save(toInsert);

    const newDate = this.incrementDate(date);
    if (newDate) {
      setTimeout(() => this.loadData(newDate), 2000);
    }
  }

  private incrementDate(date: moment.Moment): moment.Moment | null {
    const newDate = date.add(1, 'days');
    if (moment().startOf('day') < date) {
      return null;
    }
    return newDate;
  }

  private async getStartDate() {
    const [lastLoaded] = await this.priceRepository
      .createQueryBuilder('price')
      .select('MAX(price.date)')
      .execute();
    if (lastLoaded?.max) {
      console.log(`Got max date ${lastLoaded.max}`);
      return moment(lastLoaded.max);
    }
    return moment(START_DATE, 'DD-MM-YYYY');
  }

  private async list() {
    console.dir(await this.priceRepository.find());
  }
}
