import { Module } from '@nestjs/common';
import { YahooController } from './yahoo.controller';

@Module({
  controllers: [YahooController],
})
export class YahooModule {}
