import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getNextPaymentState,
  getStatusText,
  isPayingAnimationActive,
  PROCESSING_DURATION_MS,
  DONE_DURATION_MS,
} from './paymentState';

test('payment state transitions from ready -> processing -> done -> ready', () => {
  let state = getNextPaymentState('ready', 'CLICK_CARD');
  assert.equal(state, 'processing');

  // Clicking again while processing does not restart or break state
  assert.equal(getNextPaymentState(state, 'CLICK_CARD'), 'processing');

  state = getNextPaymentState(state, 'PROCESSING_COMPLETE');
  assert.equal(state, 'done');

  state = getNextPaymentState(state, 'DONE_TIMEOUT');
  assert.equal(state, 'ready');
});

test('status text matches Apple Pay specification for each state', () => {
  assert.equal(getStatusText('ready'), 'Hold Near Reader');
  assert.equal(getStatusText('processing'), 'Processing...');
  assert.equal(getStatusText('done'), 'Done');
});

test('paying-animation class helper is active when state !== ready', () => {
  assert.equal(isPayingAnimationActive('ready'), false);
  assert.equal(isPayingAnimationActive('processing'), true);
  assert.equal(isPayingAnimationActive('done'), true);
});

test('timing constants match 1500ms processing and 3000ms done durations', () => {
  assert.equal(PROCESSING_DURATION_MS, 1500);
  assert.equal(DONE_DURATION_MS, 3000);
});
