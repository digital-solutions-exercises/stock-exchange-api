import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
  UsePipes,
} from '@nestjs/common';
import to from 'await-to-js';
import { JoiValidationPipe } from '../utils/joi-validation.utils';
import yahooFinance from 'yahoo-finance2';
import { ChartResultArrayQuote } from 'yahoo-finance2/dist/esm/src/modules/chart';
import { Quote } from 'yahoo-finance2/dist/esm/src/modules/quote';
import { QuoteSummaryResult } from 'yahoo-finance2/dist/esm/src/modules/quoteSummary-iface';
import { SearchResult } from 'yahoo-finance2/dist/esm/src/modules/search';
import {
  HistoricalDataSchema,
  QuoteSchema,
  StockDetailsSchema,
  SymbolsSchema,
} from './yahoo.validator';

@Controller('yahoo')
export class YahooController {
  private readonly logger = new Logger(YahooController.name);

  @UsePipes(new JoiValidationPipe(SymbolsSchema))
  @Get('symbols')
  async getSymbols(
    @Query() requestQuery: { query: string }
  ): Promise<SearchResult['quotes']> {
    const { query } = requestQuery;

    const [err, response] = await to(yahooFinance.search(query));
    if (err) {
      this.logger.error(`GET symbols failed: ${err}`);
      throw new HttpException(
        `GET symbols failed: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return response.quotes;
  }

  @UsePipes(new JoiValidationPipe(StockDetailsSchema))
  @Get('quote-company-details')
  async getQuoteCompanyDetails(
    @Query() query: { stockSymbol: string }
  ): Promise<QuoteSummaryResult> {
    const { stockSymbol } = query;

    const [err, response] = await to(
      yahooFinance.quoteSummary(stockSymbol, { modules: ['assetProfile'] })
    );
    if (err) {
      this.logger.error(`GET stock details failed: ${err}`);
      throw new HttpException(
        `GET stock details failed: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return response;
  }

  @UsePipes(new JoiValidationPipe(QuoteSchema))
  @Get('quote')
  async getQuote(@Query() query: { stockSymbol: string }): Promise<Quote> {
    const { stockSymbol } = query;

    const [err, response] = await to(yahooFinance.quote(stockSymbol));
    if (err) {
      this.logger.error(`GET quote failed: ${err}`);
      throw new HttpException(
        `GET quote failed: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return response;
  }

  @UsePipes(new JoiValidationPipe(HistoricalDataSchema))
  @Get('historical-data')
  async getHistoricalData(
    @Query()
    query: {
      stockSymbol: string;
      resolution: '1h' | '1d' | '1wk' | '1mo';
      startDate: number;
      endDate: number;
    }
  ): Promise<ChartResultArrayQuote[]> {
    const { stockSymbol, resolution, startDate, endDate } = query;
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
      this.logger.error(`GET historical data failed: ${err}`);
      throw new HttpException(
        `GET historical data failed: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return response.quotes;
  }
}
