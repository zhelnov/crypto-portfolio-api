import { Module } from '@nestjs/common';

import { ApiModule } from '../api';
import { LoaderService } from './loader.service';

@Module({
  imports: [ApiModule],
  controllers: [],
  providers: [LoaderService],
})
export class LoaderModule {}
