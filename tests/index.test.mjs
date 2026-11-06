import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('parses a metric duration', () => {
  assert.deepEqual(api.parseServerTiming('db;dur=12.4'), [{ name: 'db', duration: 12.4 }]);
});
test('preserves comma inside quoted description', () => {
  assert.equal(api.parseServerTiming('db;desc="a, b"')[0].description, 'a, b');
});
test('round trips metrics', () => {
  const x = [{ name: 'cache', duration: 0, description: 'hit "yes"' }, { name: 'origin' }];
  assert.deepEqual(api.parseServerTiming(api.formatServerTiming(x)), x);
});
test('accepts empty header', () => {
  assert.deepEqual(api.parseServerTiming(''), []);
});
test('rejects negative duration', () => {
  assert.throws(() => api.parseServerTiming('db;dur=-1'), RangeError);
});
test('rejects malformed name', () => {
  assert.throws(() => api.parseServerTiming('bad name;dur=1'), TypeError);
});
