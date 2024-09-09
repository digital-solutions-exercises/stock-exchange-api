import {
  HistoricalDataSchema,
  QuoteSchema,
  StockDetailsSchema,
  SymbolsSchema,
} from '../yahoo.validator';

describe('yahoo.validator', () => {
  describe('SymbolsSchema', () => {
    test.each`
      query        | error
      ${'AAPL'}    | ${undefined}
      ${undefined} | ${'"query" is required'}
      ${1}         | ${'"query" must be a string'}
    `('should return error if query is not valid', ({ query, error }) => {
      const validationResult = SymbolsSchema.validate({ query });
      expect(validationResult.error?.message).toBe(error);
    });
  });

  describe('StockDetailsSchema', () => {
    test.each`
      stockSymbol  | error
      ${'AAPL'}    | ${undefined}
      ${undefined} | ${'"stockSymbol" is required'}
      ${1}         | ${'"stockSymbol" must be a string'}
    `(
      'should return error if stockSymbol is not valid in StockDetailsSchema',
      ({ stockSymbol, error }) => {
        const validationResult = StockDetailsSchema.validate({ stockSymbol });
        expect(validationResult.error?.message).toBe(error);
      }
    );
  });

  describe('QuoteSchema', () => {
    test.each`
      stockSymbol  | error
      ${'AAPL'}    | ${undefined}
      ${undefined} | ${'"stockSymbol" is required'}
      ${1}         | ${'"stockSymbol" must be a string'}
    `(
      'should return error if stockSymbol is not valid in QuoteSchema',
      ({ stockSymbol, error }) => {
        const validationResult = QuoteSchema.validate({ stockSymbol });
        expect(validationResult.error?.message).toBe(error);
      }
    );
  });

  describe('HistoricalDataSchema', () => {
    test.each`
      stockSymbol  | resolution   | startDate     | endDate       | error
      ${'AAPL'}    | ${'1d'}      | ${1622520000} | ${1625112000} | ${undefined}
      ${undefined} | ${'1d'}      | ${1622520000} | ${1625112000} | ${'"stockSymbol" is required'}
      ${'AAPL'}    | ${undefined} | ${1622520000} | ${1625112000} | ${'"resolution" is required'}
      ${'AAPL'}    | ${'5d'}      | ${1622520000} | ${1625112000} | ${'"resolution" must be one of [1h, 1d, 1wk, 1mo]'}
      ${'AAPL'}    | ${'1d'}      | ${undefined}  | ${1625112000} | ${'"startDate" is required'}
      ${'AAPL'}    | ${'1d'}      | ${1622520000} | ${undefined}  | ${'"endDate" is required'}
      ${'AAPL'}    | ${'1d'}      | ${'invalid'}  | ${1625112000} | ${'"startDate" must be a number'}
      ${'AAPL'}    | ${'1d'}      | ${1622520000} | ${'invalid'}  | ${'"endDate" must be a number'}
    `(
      'should return error if some field is not valid',
      ({ stockSymbol, resolution, startDate, endDate, error }) => {
        const validationResult = HistoricalDataSchema.validate({
          stockSymbol,
          resolution,
          startDate,
          endDate,
        });
        expect(validationResult.error?.message).toBe(error);
      }
    );
  });
});
