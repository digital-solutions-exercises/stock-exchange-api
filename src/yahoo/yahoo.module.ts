import { Module } from '@nestjs/common';
import { YahooController } from './yahoo.controller';
import { YahooResolver } from './yahoo.resolver';

@Module({
  controllers: [YahooController],
  providers: [YahooResolver],
})
export class YahooModule {}
