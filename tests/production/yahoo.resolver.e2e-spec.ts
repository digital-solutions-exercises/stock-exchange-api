import request from 'supertest';
import { appUrl } from '../e2e-support/e2e.config';

const app = appUrl();

describe('YahooResolver (GraphQL)', () => {
  describe('POST /graphql', () => {
    it('should return historical data for a valid symbol through GraphQL', (done) => {
      const query = `
        query {
          getHistoricalData(
            stockSymbol: "AAPL", 
            resolution: "1d", 
            startDate: 1725228000000, 
            endDate: 1725660000000
          ) {
            date
            close
          }
        }
      `;

      request(app)
        .post('/graphql')
        .send({
          query,
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) return done(err);

          const data = res.body.data.getHistoricalData;
          expect(Array.isArray(data)).toBe(true);
          if (data.length > 0) {
            expect(data[0]).toHaveProperty('date');
            expect(data[0]).toHaveProperty('close');
          }

          done();
        });
    });
  });
});
