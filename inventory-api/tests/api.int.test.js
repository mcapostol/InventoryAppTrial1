// inventory-api/tests/api.int.test.js

// node-fetch v2.x exportează direct o funcție
const fetch = require('node-fetch');
let server;

describe('GET /health', () => {
  const baseUrl = 'http://localhost:4000';

  beforeAll(() => {
    server = require('../index');
  });

  afterAll(callback => {
    if (server && server.close) {
      server.close(callback);
    } else {
      callback();
    }
  });

  test('should return { status: "ok" }', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });
});
