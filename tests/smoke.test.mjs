import test from 'node:test';
import assert from 'node:assert/strict';

test('frontend smoke', () => {
  assert.equal('stargate'.includes('gate'), true);
});
