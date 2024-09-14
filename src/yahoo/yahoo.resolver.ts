import { Logger } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import to from 'await-to-js';
import yahooFinance from 'yahoo-finance2';
import { ChartResultArrayQuote } from './yahoo.model';

@Resolver()
export class YahooResolver {
  private readonly logger = new Logger(YahooResolver.name);

  @Query(() => [ChartResultArrayQuote])
  async getHistoricalData(
    @Args('stockSymbol') stockSymbol: string,
    @Args('resolution') resolution: '1h' | '1d' | '1wk' | '1mo',
    @Args('startDate') startDate: number,
    @Args('endDate') endDate: number
  ): Promise<ChartResultArrayQuote[]> {
    const parsedStartDate = new Date(Number(startDate));
    const parsedEndDate = new Date(Number(endDate));

    const [err, response] = await to(
      yahooFinance.chart(stockSymbol, {
        period1: parsedStartDate,
        period2: parsedEndDate,
        interval: resolution,
      })
    );

    if (err) {
      this.logger.error(`Failed to fetch historical data: ${err}`);
      throw new Error(`Failed to fetch historical data: ${err}`);
    }

    return response.quotes;
  }
}
