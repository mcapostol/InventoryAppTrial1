// inventory-api/tests/api.int.test.js

const fetch = require('node-fetch');

describe('GET /health', () => {
  const baseUrl = 'http://localhost:4000';

  let server;
  beforeAll(() => {
    // dacă în index.js exportezi un server, îl imporți aici; altfel presupunem că e deja pornit
    server = require('../index');  
  });

  afterAll(done => {
    // dacă ai nevoie să închizi serverul:
    if (server && server.close) {
      server.close(done);
    } else {
      done();
    }
  });

  test('should return { status: "ok" }', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });
});