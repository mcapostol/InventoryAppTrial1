// inventory-api/tests/api.int.test.js

// 1) node‑fetch v3 e ESM‑only, deci require() ne dă un obiect cu `default`
const { default: fetch } = require('node-fetch');

describe('GET /health', () => {
  let server;
  let baseUrl;

  beforeAll(() => {
    // 2) importăm index.js, care exportă serverul deja pornit
    server = require('../index');

    // aflăm port‑ul pe care chiar a pornit
    const { port } = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
  });

  afterAll(done => {
    // 3) închidem serverul când s‑au terminat testele
    server.close(done);
  });

  test('should return { status: "ok" }', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });
});
