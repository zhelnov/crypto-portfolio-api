import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as moment from 'moment';

import { Extrapolator } from './extrapolator';
import { PriceEntity } from '../entities/price.entity';
import { ChartData } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { ALLOWED_COINS } from '../api';

export const EXTRAPOLATION_TYPES = ['linear', 'poly'];

@Injectable()
export class ExtrapolationService {
  constructor(
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
  ) {}

  async getFurtherWeek(coin: string, type: string): Promise<ChartData[]> {
    if (!ALLOWED_COINS.includes(coin)) {
      throw new BadRequestException(
        `${coin} is not among supported (${ALLOWED_COINS.join()})`,
      );
    }
    if (!EXTRAPOLATION_TYPES.includes(type)) {
      throw new BadRequestException(
        `${type} is not among supported (${EXTRAPOLATION_TYPES.join()})`,
      );
    }
    const data = await this.priceRepository.find({
      where: {
        coin,
        currency: 'usd',
      },
    });
    const forExt = data.map((item: PriceEntity) => ({
      x: item.date.getTime(),
      y: parseFloat(item.price),
    }));
    const ext = new Extrapolator(forExt);
    const result: ChartData[] = [];
    for (const timestamp of this.getFutureWeekTimestamps()) {
      const estimatedPrice =
        type === 'linear'
          ? ext.getLinear(timestamp)
          : ext.getPolygonal(timestamp);
      result.push({
        timestamp,
        prices: [
          {
            coin,
            price: estimatedPrice.toString(),
          },
        ],
      });
    }
    return result;
  }

  private getFutureWeekTimestamps() {
    const futureTimestamps = [];
    const today = moment().startOf('day');
    for (let i = 1; i < 8; i++) {
      futureTimestamps.push(today.add(i, 'days').unix() * 1000);
    }
    return futureTimestamps;
  }
}
