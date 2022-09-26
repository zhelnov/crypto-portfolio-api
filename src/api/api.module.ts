import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ApiService } from './api.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://api.coingecko.com/api/v3/',
    }),
  ],
  controllers: [],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
