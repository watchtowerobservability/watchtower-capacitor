import test from 'node:test';
import assert from 'node:assert';
import { createWatchtower } from '../src/core.js';

function fakes() {
  const calls = [];
  const client = { captureError: (e) => calls.push(['capture', e]), replay: { flush: async () => calls.push(['replayFlush']) } };
  return {
    calls,
    browser: { init: (c) => { calls.push(['browser', c]); return client; } },
    plugin: { init: async (c) => calls.push(['native', c]), flush: async () => calls.push(['nativeFlush']) },
  };
}
const opts = { publishableKey: 'pk', endpoint: 'http://e', service: 's', replay: { enabled: true } };

test('native shell: browser SDK without DOM replay, native SDK with replay flag', async () => {
  const f = fakes();
  await createWatchtower({ ...f, isNative: true }).init(opts);
  assert.strictEqual(f.calls[0][1].replay, undefined);
  assert.deepStrictEqual(f.calls[1][1], { key: 'pk', endpoint: 'http://e', service: 's', release: undefined, environment: undefined, replay: true });
});

test('web: browser SDK only, replay kept', async () => {
  const f = fakes();
  await createWatchtower({ ...f, isNative: false }).init(opts);
  assert.deepStrictEqual(f.calls.map((c) => c[0]), ['browser']);
  assert.deepStrictEqual(f.calls[0][1].replay, { enabled: true });
});

test('native:false skips the native SDK', async () => {
  const f = fakes();
  await createWatchtower({ ...f, isNative: true }).init({ ...opts, native: false });
  assert.deepStrictEqual(f.calls.map((c) => c[0]), ['browser']);
});

test('required options are checked', async () => {
  const f = fakes();
  await assert.rejects(createWatchtower({ ...f, isNative: false }).init({ endpoint: 'x', service: 's' }), /publishableKey/);
});

test('captureError and flush', async () => {
  const f = fakes();
  const wt = createWatchtower({ ...f, isNative: true });
  wt.captureError(new Error('before init')); // ignored, no throw
  await wt.init(opts);
  wt.captureError('e');
  await wt.flush();
  assert.deepStrictEqual(f.calls.slice(2).map((c) => c[0]), ['capture', 'nativeFlush', 'replayFlush']);
});
