import request from 'supertest';
import { appUrl } from '../e2e-support/e2e.config';

const app = appUrl();

describe('YahooController', () => {
    
    describe('GET /yahoo/symbols', () => {
        it('should return status 200 and a list of quotes', (done) => {
            request(app)
                .get('/yahoo/symbols')
                .query({ query: 'AAPL' })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(Array.isArray(res.body)).toBe(true);
                    done();
                });
        });
    });

    describe('GET /yahoo/quote-company-details', () => {
        it('should return status 200 and quote company details for a valid symbol', (done) => {
            request(app)
                .get('/yahoo/quote-company-details')
                .query({ stockSymbol: 'AAPL' })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).toHaveProperty('assetProfile');
                    done();
                });
        });
    });

    describe('GET /yahoo/quote', () => {
        it('should return status 200 and quote details for a valid symbol', (done) => {
            request(app)
                .get('/yahoo/quote')
                .query({ stockSymbol: 'AAPL' })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).toHaveProperty('symbol', 'AAPL');
                    done();
                });
        });
    });

    describe('GET /yahoo/historical-data', () => {
        it('should return status 200 and historical data for a valid symbol', (done) => {
            request(app)
                .get('/yahoo/historical-data')
                .query({
                    stockSymbol: 'AAPL',
                    resolution: '1d',
                    startDate: 1694294914255,
                    endDate: 1725917314255,
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(Array.isArray(res.body)).toBe(true);
                    done();
                });
        });
    });
});
