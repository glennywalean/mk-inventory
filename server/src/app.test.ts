import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

import app from './app';

test('GET /health is public', async () => {
  const response = await request(app).get('/health');

  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('GET /api/items requires a valid JWT', async () => {
  const response = await request(app).get('/api/items');

  assert.equal(response.status, 401);
});
