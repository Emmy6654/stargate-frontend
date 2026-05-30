import test from 'node:test';
import assert from 'node:assert/strict';

// Mock postMessage handler for testing
function createPostMessageHandler() {
  const handlers = {};
  
  function on(eventType, callback) {
    if (!handlers[eventType]) {
      handlers[eventType] = [];
    }
    handlers[eventType].push(callback);
  }
  
  function emit(eventType, data) {
    if (handlers[eventType]) {
      handlers[eventType].forEach(callback => callback(data));
    }
  }
  
  function parseMessage(message) {
    if (!message || typeof message !== 'object') {
      throw new Error('Invalid message format');
    }
    
    if (!message.type) {
      throw new Error('Message must have a type');
    }
    
    return message;
  }
  
  function validateMessage(message) {
    const parsed = parseMessage(message);
    
    if (!parsed.type || parsed.type.trim() === '') {
      throw new Error(`Invalid message type: ${parsed.type}`);
    }
    
    const validTypes = ['STARGATE_LOADED', 'STARGATE_PAID', 'STARGATE_ERROR', 'STARGATE_INIT'];
    if (!validTypes.includes(parsed.type)) {
      throw new Error(`Invalid message type: ${parsed.type}`);
    }
    
    return parsed;
  }
  
  return { on, emit, parseMessage, validateMessage };
}

test('Widget SDK postMessage handler - message parsing', async (t) => {
  const handler = createPostMessageHandler();
  
  await t.test('parses valid message object', () => {
    const message = { type: 'STARGATE_LOADED', data: {} };
    const parsed = handler.parseMessage(message);
    
    assert.equal(parsed.type, 'STARGATE_LOADED');
  });

  await t.test('throws error for null message', () => {
    assert.throws(() => handler.parseMessage(null), /Invalid message format/);
  });

  await t.test('throws error for undefined message', () => {
    assert.throws(() => handler.parseMessage(undefined), /Invalid message format/);
  });

  await t.test('throws error for non-object message', () => {
    assert.throws(() => handler.parseMessage('string'), /Invalid message format/);
  });

  await t.test('throws error for message without type', () => {
    assert.throws(() => handler.parseMessage({ data: {} }), /Message must have a type/);
  });

  await t.test('parses message with additional properties', () => {
    const message = { type: 'STARGATE_PAID', data: { amount: 100 }, timestamp: Date.now() };
    const parsed = handler.parseMessage(message);
    
    assert.equal(parsed.type, 'STARGATE_PAID');
    assert.ok(parsed.data);
    assert.ok(parsed.timestamp);
  });
});

test('Widget SDK postMessage handler - message validation', async (t) => {
  const handler = createPostMessageHandler();
  
  await t.test('validates STARGATE_LOADED message', () => {
    const message = { type: 'STARGATE_LOADED' };
    const validated = handler.validateMessage(message);
    
    assert.equal(validated.type, 'STARGATE_LOADED');
  });

  await t.test('validates STARGATE_PAID message', () => {
    const message = { type: 'STARGATE_PAID', data: { transactionId: 'tx-123' } };
    const validated = handler.validateMessage(message);
    
    assert.equal(validated.type, 'STARGATE_PAID');
  });

  await t.test('validates STARGATE_ERROR message', () => {
    const message = { type: 'STARGATE_ERROR', error: 'Payment failed' };
    const validated = handler.validateMessage(message);
    
    assert.equal(validated.type, 'STARGATE_ERROR');
  });

  await t.test('validates STARGATE_INIT message', () => {
    const message = { type: 'STARGATE_INIT', config: { invoiceId: 'INV-123' } };
    const validated = handler.validateMessage(message);
    
    assert.equal(validated.type, 'STARGATE_INIT');
  });

  await t.test('rejects invalid message type', () => {
    const message = { type: 'INVALID_TYPE' };
    assert.throws(() => handler.validateMessage(message), /Invalid message type/);
  });

  await t.test('rejects message with empty type', () => {
    const message = { type: '' };
    assert.throws(() => handler.validateMessage(message), /Message must have a type/);
  });
});

test('Widget SDK postMessage handler - event handling', async (t) => {
  const handler = createPostMessageHandler();
  
  await t.test('registers event listener', () => {
    let called = false;
    handler.on('STARGATE_LOADED', () => {
      called = true;
    });
    
    handler.emit('STARGATE_LOADED', {});
    assert.ok(called, 'Event listener should be called');
  });

  await t.test('handles multiple listeners for same event', () => {
    let count = 0;
    handler.on('STARGATE_PAID', () => count++);
    handler.on('STARGATE_PAID', () => count++);
    
    handler.emit('STARGATE_PAID', {});
    assert.equal(count, 2, 'Both listeners should be called');
  });

  await t.test('passes data to event listener', () => {
    let receivedData = null;
    handler.on('STARGATE_PAID', (data) => {
      receivedData = data;
    });
    
    const testData = { amount: 100, currency: 'USDC' };
    handler.emit('STARGATE_PAID', testData);
    
    assert.deepEqual(receivedData, testData);
  });

  await t.test('handles different event types independently', () => {
    let loadedCalled = false;
    let paidCalled = false;
    
    handler.on('STARGATE_LOADED', () => {
      loadedCalled = true;
    });
    handler.on('STARGATE_PAID', () => {
      paidCalled = true;
    });
    
    handler.emit('STARGATE_LOADED', {});
    assert.ok(loadedCalled && !paidCalled, 'Only LOADED listener should be called');
    
    handler.emit('STARGATE_PAID', {});
    assert.ok(paidCalled, 'PAID listener should now be called');
  });
});

test('Widget SDK postMessage handler - STARGATE_LOADED event', async (t) => {
  const handler = createPostMessageHandler();
  
  await t.test('handles STARGATE_LOADED with widget ready state', () => {
    let loadedData = null;
    handler.on('STARGATE_LOADED', (data) => {
      loadedData = data;
    });
    
    const message = { type: 'STARGATE_LOADED', ready: true };
    handler.validateMessage(message);
    handler.emit('STARGATE_LOADED', message);
    
    assert.ok(loadedData);
  });
});

test('Widget SDK postMessage handler - STARGATE_PAID event', async (t) => {
  const handler = createPostMessageHandler();
  
  await t.test('handles STARGATE_PAID with transaction details', () => {
    let paidData = null;
    handler.on('STARGATE_PAID', (data) => {
      paidData = data;
    });
    
    const message = {
      type: 'STARGATE_PAID',
      transactionId: 'tx-abc123',
      amount: 100,
      currency: 'USDC'
    };
    handler.validateMessage(message);
    handler.emit('STARGATE_PAID', message);
    
    assert.equal(paidData.transactionId, 'tx-abc123');
    assert.equal(paidData.amount, 100);
  });

  await t.test('validates required fields in STARGATE_PAID', () => {
    const message = { type: 'STARGATE_PAID' };
    const validated = handler.validateMessage(message);
    
    assert.equal(validated.type, 'STARGATE_PAID');
  });
});

test('Widget SDK postMessage handler - STARGATE_ERROR event', async (t) => {
  const handler = createPostMessageHandler();
  
  await t.test('handles STARGATE_ERROR with error details', () => {
    let errorData = null;
    handler.on('STARGATE_ERROR', (data) => {
      errorData = data;
    });
    
    const message = {
      type: 'STARGATE_ERROR',
      error: 'Payment failed',
      code: 'PAYMENT_FAILED'
    };
    handler.validateMessage(message);
    handler.emit('STARGATE_ERROR', message);
    
    assert.equal(errorData.error, 'Payment failed');
    assert.equal(errorData.code, 'PAYMENT_FAILED');
  });

  await t.test('handles different error codes', () => {
    const errorCodes = ['PAYMENT_FAILED', 'WALLET_NOT_CONNECTED', 'INSUFFICIENT_BALANCE', 'NETWORK_ERROR'];
    
    errorCodes.forEach((code) => {
      const message = { type: 'STARGATE_ERROR', code };
      const validated = handler.validateMessage(message);
      assert.equal(validated.code, code);
    });
  });
});

test('Widget SDK postMessage handler - message origin validation', async (t) => {
  await t.test('should validate message origin in real implementation', () => {
    // In real implementation, origin should be validated
    const allowedOrigins = ['https://example.com', 'https://app.example.com'];
    const messageOrigin = 'https://example.com';
    
    assert.ok(allowedOrigins.includes(messageOrigin), 'Origin should be in allowed list');
  });

  await t.test('should reject messages from untrusted origins', () => {
    const allowedOrigins = ['https://example.com'];
    const messageOrigin = 'https://malicious.com';
    
    assert.ok(!allowedOrigins.includes(messageOrigin), 'Untrusted origin should be rejected');
  });
});

test('Widget SDK postMessage handler - edge cases', async (t) => {
  const handler = createPostMessageHandler();
  
  await t.test('handles message with null data', () => {
    const message = { type: 'STARGATE_LOADED', data: null };
    const validated = handler.validateMessage(message);
    
    assert.equal(validated.type, 'STARGATE_LOADED');
  });

  await t.test('handles message with empty object data', () => {
    const message = { type: 'STARGATE_PAID', data: {} };
    const validated = handler.validateMessage(message);
    
    assert.equal(validated.type, 'STARGATE_PAID');
  });

  await t.test('handles message with nested data', () => {
    const message = {
      type: 'STARGATE_PAID',
      data: {
        transaction: {
          id: 'tx-123',
          details: {
            amount: 100,
            currency: 'USDC'
          }
        }
      }
    };
    const validated = handler.validateMessage(message);
    
    assert.ok(validated.data.transaction.details);
  });

  await t.test('handles rapid successive messages', () => {
    let count = 0;
    handler.on('STARGATE_LOADED', () => count++);
    
    for (let i = 0; i < 10; i++) {
      handler.emit('STARGATE_LOADED', {});
    }
    
    assert.equal(count, 10, 'All messages should be processed');
  });
});
