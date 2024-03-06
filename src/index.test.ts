import app from './index';
import request from 'supertest';

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    });

    it('should return "Welcome to Fillout tech screen!"', async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('Welcome to Fillout tech screen!');
    });
});