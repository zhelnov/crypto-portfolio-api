import { Module } from '@nestjs/common';

import { ExtrapolationController } from './extrapolation.controller';
import { ExtrapolationService } from './extrapolation.service';

@Module({
  controllers: [ExtrapolationController],
  providers: [ExtrapolationService],
})
export class ExtrapolationModule {}
