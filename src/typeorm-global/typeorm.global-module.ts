import { Global, Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENTITIES } from './entities';

@Global()
@Module({})
export class TypeOrmGlobalModule {
  static registerGlobalEntities(): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'portfolio',
          entities: ENTITIES,
          synchronize: true,
        }),
        TypeOrmModule.forFeature(ENTITIES),
      ],
      exports: [TypeOrmModule],
      module: TypeOrmGlobalModule,
    };
  }
}
