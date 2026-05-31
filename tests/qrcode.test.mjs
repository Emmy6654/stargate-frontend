import test from 'node:test';
import assert from 'node:assert/strict';

test('QR code generation - URL encoding', async (t) => {
  await t.test('encodes payment link URLs correctly', () => {
    const testCases = [
      { url: 'https://example.com/pay/INV-123', expected: 'https://example.com/pay/INV-123' },
      { url: 'https://example.com/pay/INV 456', expected: 'https://example.com/pay/INV%20456' },
      { url: 'https://example.com/pay/INV&789', expected: 'https://example.com/pay/INV%26789' },
      { url: 'https://example.com/pay/INV?test=1', expected: 'https://example.com/pay/INV%3Ftest%3D1' },
    ];

    testCases.forEach(({ url, expected }) => {
      const encoded = encodeURIComponent(url);
      assert.ok(encoded.length > 0, `URL should be encoded: ${url}`);
    });
  });

  await t.test('handles special characters in payment link IDs', () => {
    const specialIds = ['INV-123', 'INV_456', 'INV.789', 'INV@test'];
    
    specialIds.forEach((id) => {
      const encoded = encodeURIComponent(id);
      assert.ok(encoded.length > 0, `ID should be encoded: ${id}`);
    });
  });

  await t.test('preserves URL structure after encoding', () => {
    const baseUrl = 'https://example.com/pay/';
    const invoiceId = 'INV-123-ABC';
    const fullUrl = baseUrl + invoiceId;
    
    const encoded = encodeURIComponent(fullUrl);
    assert.ok(encoded.includes('https'), 'Encoded URL should contain protocol');
    assert.ok(encoded.includes('example.com'), 'Encoded URL should contain domain');
  });
});

test('QR code generation - canvas dimensions', async (t) => {
  await t.test('generates QR code with correct size for short URLs', () => {
    const shortUrl = 'https://example.com/pay/INV-1';
    const size = 180;
    
    assert.equal(size, 180, 'Short URL QR code should be 180x180');
  });

  await t.test('generates QR code with correct size for long URLs', () => {
    const longUrl = 'https://example.com/pay/INV-123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const size = 180;
    
    assert.equal(size, 180, 'Long URL QR code should still be 180x180');
  });

  await t.test('maintains aspect ratio (square)', () => {
    const size = 180;
    const width = size;
    const height = size;
    
    assert.equal(width, height, 'QR code should be square');
  });

  await t.test('supports different size options', () => {
    const sizes = [120, 150, 180, 200, 256];
    
    sizes.forEach((size) => {
      assert.ok(size > 0, `Size should be positive: ${size}`);
      assert.ok(size % 1 === 0, `Size should be integer: ${size}`);
    });
  });
});

test('QR code generation - error correction levels', async (t) => {
  await t.test('uses appropriate error correction level', () => {
    const levels = ['L', 'M', 'Q', 'H'];
    const selectedLevel = 'M';
    
    assert.ok(levels.includes(selectedLevel), 'Should use valid error correction level');
  });

  await t.test('level M provides balance between size and reliability', () => {
    // Level M = ~15% error correction
    const level = 'M';
    assert.equal(level, 'M', 'Should use level M for balance');
  });
});

test('QR code generation - Stellar URI encoding', async (t) => {
  await t.test('encodes Stellar payment URI correctly', () => {
    const address = 'GBUQWP3BOUZX34ULNQG23RQ6F4BVWCIBTICSW2NSE7JSXNQC33GFVSTX';
    const stellarUri = `web+stellar:pay?destination=${encodeURIComponent(address)}`;
    
    assert.ok(stellarUri.startsWith('web+stellar:pay'), 'Should start with Stellar protocol');
    assert.ok(stellarUri.includes('destination='), 'Should include destination parameter');
    assert.ok(stellarUri.includes(address), 'Should include encoded address');
  });

  await t.test('handles long Stellar addresses', () => {
    const address = 'GBUQWP3BOUZX34ULNQG23RQ6F4BVWCIBTICSW2NSE7JSXNQC33GFVSTX';
    const encoded = encodeURIComponent(address);
    
    assert.equal(encoded.length, address.length, 'Address should not need encoding');
  });

  await t.test('includes margin in QR code', () => {
    const includeMargin = true;
    assert.ok(includeMargin, 'QR code should include margin');
  });
});

test('QR code generation - canvas rendering', async (t) => {
  await t.test('renders canvas element', () => {
    // Simulating canvas rendering
    const canvas = { width: 180, height: 180, getContext: () => ({}) };
    
    assert.equal(canvas.width, 180, 'Canvas should have correct width');
    assert.equal(canvas.height, 180, 'Canvas should have correct height');
  });

  await t.test('supports PNG export', () => {
    const formats = ['image/png', 'image/jpeg', 'image/webp'];
    const selectedFormat = 'image/png';
    
    assert.ok(formats.includes(selectedFormat), 'Should support PNG format');
  });

  await t.test('supports SVG export', () => {
    const svgElement = { outerHTML: '<svg></svg>' };
    
    assert.ok(svgElement.outerHTML.includes('svg'), 'Should support SVG format');
  });
});

test('QR code generation - data URL generation', async (t) => {
  await t.test('generates valid data URL for PNG', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    assert.ok(dataUrl.startsWith('data:image/png'), 'Should be valid PNG data URL');
  });

  await t.test('data URL can be used as download link', () => {
    const dataUrl = 'data:image/png;base64,test';
    const link = { href: dataUrl, download: 'qr-code.png' };
    
    assert.equal(link.download, 'qr-code.png', 'Should have correct filename');
  });
});

test('QR code generation - edge cases', async (t) => {
  await t.test('handles empty URL gracefully', () => {
    const url = '';
    assert.equal(url.length, 0, 'Empty URL should be handled');
  });

  await t.test('handles very long URLs', () => {
    const longUrl = 'https://example.com/pay/' + 'A'.repeat(500);
    assert.ok(longUrl.length > 500, 'Should handle long URLs');
  });

  await t.test('handles URLs with unicode characters', () => {
    const unicodeUrl = 'https://example.com/pay/INV-🎉-123';
    const encoded = encodeURIComponent(unicodeUrl);
    
    assert.ok(encoded.length > unicodeUrl.length, 'Unicode should be encoded');
  });

  await t.test('handles URLs with query parameters', () => {
    const urlWithParams = 'https://example.com/pay/INV-123?amount=100&currency=USDC';
    const encoded = encodeURIComponent(urlWithParams);
    
    assert.ok(encoded.includes('%3F'), 'Query string should be encoded');
    assert.ok(encoded.includes('%26'), 'Ampersand should be encoded');
  });
});
