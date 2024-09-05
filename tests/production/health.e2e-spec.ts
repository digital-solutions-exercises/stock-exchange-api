import request from 'supertest';
import { appUrl } from '../e2e-support/e2e.config';

const app = appUrl();

describe('HealthController', () => {
    it('should return status 200 and data with status "ok"', (done) => {
        request(app)
            .get('/health')
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toEqual({ status: 'ok' });
                done();
            });
    });
});
