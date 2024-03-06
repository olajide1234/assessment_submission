
import { http, HttpResponse } from 'msw'
import request from 'supertest';
import app from '../..';
import { server as expressServer } from '../..';

// Let's setup the mock server here, since it is a small app/test
import { setupServer } from 'msw/node'

const sampleResponse = {
    pageCount: 3,
    totalResponses: 4,
    responses: [{
        submissionId: 'testid',
        submissionTime: 'timestring',
        urlParameters: [],
        quiz: { id: 'one'},
        lastUpdatedAt: 'lastupdated',
        documents: [],
        calculations: [],
        questions: [],
    }]
}

const server = setupServer(
    http.get('https://api.fillout.com/v1/api/forms/cLZojxk94ous/submissions', () => {
        return HttpResponse.json(sampleResponse)
    }))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => {server.close(); expressServer.close();})

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


describe('GET /:formId/filteredResponse', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/cLZojxk94ous/filteredResponse?limit=1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(sampleResponse);
    });

    it('should return param validation error', async () => {
        const res = await request(app).get('/cLZojxk94ous/filteredResponse?limit=string');
        expect(res.text).toBe("{\"name\":\"Query param validation error\",\"message\":\"\\\"limit\\\" must be a number\"}");
    });

    // And more tests as necessary ...
});
