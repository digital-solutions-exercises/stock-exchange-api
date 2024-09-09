import * as joi from 'joi';

export const SymbolsSchema = joi.object({
  query: joi.string().required(),
});

export const StockDetailsSchema = joi.object({
  stockSymbol: joi.string().required(),
});

export const QuoteSchema = joi.object({
  stockSymbol: joi.string().required(),
});

export const HistoricalDataSchema = joi.object({
  stockSymbol: joi.string().required(),
  resolutions: joi.string().valid('1h', '1d', '1wk', '1mo').required(),
  startDate: joi.number().required(),
  endDate: joi.number().required(),
});
