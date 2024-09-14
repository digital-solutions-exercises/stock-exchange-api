import { Test, TestingModule } from '@nestjs/testing';
import { YahooResolver } from '../yahoo.resolver';
import yahooFinance from 'yahoo-finance2';
import { ChartResultArrayQuote } from '../yahoo.model';

jest.mock('yahoo-finance2', () => ({
  chart: jest.fn(),
}));

describe('YahooResolver', () => {
  let resolver: YahooResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YahooResolver],
    }).compile();

    resolver = module.get<YahooResolver>(YahooResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHistoricalData', () => {
    it('should return historical data when successful', async () => {
      const mockHistoricalData: ChartResultArrayQuote[] = [
        {
          date: new Date(),
          high: 150.0,
          low: 148.0,
          open: 149.0,
          close: 150.0,
          volume: 100000,
          adjclose: 150.0,
        },
      ];

      (yahooFinance.chart as jest.Mock).mockResolvedValue({
        quotes: mockHistoricalData,
      });

      const result = await resolver.getHistoricalData(
        'AAPL',
        '1d',
        1622520000000,
        1622606400000
      );

      expect(result).toEqual(mockHistoricalData);
      expect(yahooFinance.chart).toHaveBeenCalledWith('AAPL', {
        period1: new Date(1622520000000),
        period2: new Date(1622606400000),
        interval: '1d',
      });
    });

    it('should log error and throw an error when yahooFinance.chart fails', async () => {
      (yahooFinance.chart as jest.Mock).mockRejectedValue(
        new Error('historical failed')
      );

      await expect(
        resolver.getHistoricalData('AAPL', '1d', 1622520000000, 1622606400000)
      ).rejects.toThrow(
        new Error('Failed to fetch historical data: Error: historical failed')
      );

      expect(yahooFinance.chart).toHaveBeenCalled();
    });
  });
});
