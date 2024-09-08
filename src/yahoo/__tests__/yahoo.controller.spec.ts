import { Test, TestingModule } from '@nestjs/testing';
import { YahooController } from '../yahoo.controller';
import yahooFinance from 'yahoo-finance2';
import { HttpException, HttpStatus } from '@nestjs/common';

jest.mock('yahoo-finance2', () => ({
  search: jest.fn(),
  quoteSummary: jest.fn(),
  quote: jest.fn(),
  chart: jest.fn(),
}));

describe('YahooController', () => {
  let controller: YahooController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YahooController],
    }).compile();

    controller = module.get<YahooController>(YahooController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSymbols', () => {
    it('should return search results when successful', async () => {
      const mockQuotes = [{ symbol: 'AAPL' }];
      (yahooFinance.search as jest.Mock).mockResolvedValue({
        quotes: mockQuotes,
      });

      const result = await controller.getSymbols('AAPL');
      expect(result).toEqual(mockQuotes);
    });

    it('should throw an HttpException when search fails', async () => {
      (yahooFinance.search as jest.Mock).mockRejectedValue(
        new Error('search failed')
      );

      await expect(controller.getSymbols('AAPL')).rejects.toThrow(
        new HttpException(
          'GET symbols failed: Error: search failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe('getStockDetails', () => {
    it('should return stock details when successful', async () => {
      const mockStockDetails = { assetProfile: {} };
      (yahooFinance.quoteSummary as jest.Mock).mockResolvedValue(
        mockStockDetails
      );

      const result = await controller.getStockDetails('AAPL');
      expect(result).toEqual(mockStockDetails);
    });

    it('should throw an HttpException when getting stock details fails', async () => {
      (yahooFinance.quoteSummary as jest.Mock).mockRejectedValue(
        new Error('quoteSummary failed')
      );

      await expect(controller.getStockDetails('AAPL')).rejects.toThrow(
        new HttpException(
          'GET stock details failed: Error: quoteSummary failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe('getQuote', () => {
    it('should return quote when successful', async () => {
      const mockQuote = { symbol: 'AAPL', price: 150 };
      (yahooFinance.quote as jest.Mock).mockResolvedValue(mockQuote);

      const result = await controller.getQuote('AAPL');
      expect(result).toEqual(mockQuote);
    });

    it('should throw an HttpException when getting quote fails', async () => {
      (yahooFinance.quote as jest.Mock).mockRejectedValue(
        new Error('quote failed')
      );

      await expect(controller.getQuote('AAPL')).rejects.toThrow(
        new HttpException(
          'GET quote failed: Error: quote failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });

  describe('getHistoricalData', () => {
    it('should return historical data when successful', async () => {
      const mockHistoricalData = { prices: [] as any };
      (yahooFinance.chart as jest.Mock).mockResolvedValue({
        quotes: mockHistoricalData,
      });

      const result = await controller.getHistoricalData(
        'AAPL',
        '1d',
        1622520000000,
        1622606400000
      );
      expect(result).toEqual(mockHistoricalData);
    });

    it('should throw an HttpException when getting historical data fails', async () => {
      (yahooFinance.chart as jest.Mock).mockRejectedValue(
        new Error('historical failed')
      );

      await expect(
        controller.getHistoricalData('AAPL', '1d', 1622520000000, 1622606400000)
      ).rejects.toThrow(
        new HttpException(
          'GET historical data failed: Error: historical failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      );
    });
  });
});
