import { Module } from '@nestjs/common';

import { TypeOrmGlobalModule } from './typeorm-global';
import { AppController } from './app.controller';
import { ApiModule } from './api';
import { LoaderModule } from './loader/loader.module';
import { ExtrapolationModule } from './extrapolation/extrapolation.module';

@Module({
  imports: [
    ApiModule,
    LoaderModule,
    ExtrapolationModule,
    TypeOrmGlobalModule.registerGlobalEntities(),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
