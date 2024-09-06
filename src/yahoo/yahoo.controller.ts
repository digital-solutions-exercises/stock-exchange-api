import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import to from 'await-to-js';
// import { MailerGrpcService } from '../mailer-grpc/mailer-grpc-service.service';
// import { SendEmailResponse } from 'src/generated/mailer/SendEmailResponse';
// import { JoiValidationPipe } from '../utils/joi-validation.pipe';
// import { SendEmailSchema } from './email-api.validator';
import yahooFinance from 'yahoo-finance2';
import { HistoricalHistoryResult } from 'yahoo-finance2/dist/esm/src/modules/historical';
import { Quote } from 'yahoo-finance2/dist/esm/src/modules/quote';
import { QuoteSummaryResult } from 'yahoo-finance2/dist/esm/src/modules/quoteSummary-iface';
import { SearchResult } from 'yahoo-finance2/dist/esm/src/modules/search';

@Controller('yahoo')
export class YahooController {
  private readonly logger = new Logger(YahooController.name);

  @Get('symbols')
  async getSymbols(
    @Query('query') query: string
  ): Promise<SearchResult['quotes']> {
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

  @Get('stock-details')
  async getStockDetails(
    @Query('stockSymbol') stockSymbol: string
  ): Promise<QuoteSummaryResult> {
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

  @Get('quote')
  async getQuote(@Query('stockSymbol') stockSymbol: string): Promise<Quote> {
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

  @Get('historical-data')
  async getHistoricalData(
    @Query('stockSymbol') stockSymbol: string,
    @Query('resolution') resolution: '1d' | '1wk' | '1mo',
    @Query('startDate') startDate: number,
    @Query('endDate') endDate: number
  ): Promise<HistoricalHistoryResult> {
    const parsedStartDate = new Date(Number(startDate));
    const parsedEndDate = new Date(Number(endDate));

    const [err, response] = await to(
      yahooFinance.historical(stockSymbol, {
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

    return response;
  }
}
