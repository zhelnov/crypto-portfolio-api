import { Controller, Get, Param } from '@nestjs/common';
import { ExtrapolationService } from './extrapolation.service';

@Controller('extrapolation')
export class ExtrapolationController {
  constructor(private readonly service: ExtrapolationService) {}

  @Get(':coin/:type/week')
  async getSupportedCoins(
    @Param('coin') coin: string,
    @Param('type') type: string,
  ) {
    return this.service.getFurtherWeek(coin, type);
  }
}
