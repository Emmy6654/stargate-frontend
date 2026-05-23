import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadApiModule(fetchImpl) {
  const source = readFileSync(new URL('../lib/api.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      strict: true,
    },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    Error,
    exports: module.exports,
    fetch: fetchImpl,
    JSON,
    module,
    process: { env: { NEXT_PUBLIC_API_URL: 'https://api.example.test' } },
    window: undefined,
  });
  return module.exports;
}

function jsonResponse(body = {}) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

test('attaches bearer authorization when an access token is set', async () => {
  const calls = [];
  const { api, setAccessToken } = loadApiModule(async (...args) => {
    calls.push(args);
    return jsonResponse({ id: 'merchant_1' });
  });

  setAccessToken('session-token');
  await api.merchants.me();

  assert.equal(calls[0][0], 'https://api.example.test/merchants/me');
  assert.equal(calls[0][1].credentials, 'include');
  assert.equal(calls[0][1].headers.authorization, 'Bearer session-token');
  assert.equal(calls[0][1].headers['content-type'], 'application/json');
});

test('omits authorization for public invoice requests when no token is set', async () => {
  const calls = [];
  const { api, setAccessToken } = loadApiModule(async (...args) => {
    calls.push(args);
    return jsonResponse({ id: 'invoice_1' });
  });

  setAccessToken(null);
  await api.invoices.public('invoice_1');

  assert.equal(calls[0][0], 'https://api.example.test/invoices/public/invoice_1');
  assert.equal(calls[0][1].headers.authorization, undefined);
  assert.equal(calls[0][1].headers['content-type'], 'application/json');
});
