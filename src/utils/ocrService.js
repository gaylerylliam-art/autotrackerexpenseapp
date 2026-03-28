/**
 * AutoTracker OCR Intelligence Node
 * Service for extracting fiscal telemetry from receipt buffers.
 */

export const performOCR = async (file) => {
  // Simulate network latency for intelligence node handshake
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Extract metadata (Mock intelligence)
  // In a real scenario, this would call an API like Mindee, Tesseract, or Google Vision
  const mockData = {
    vendor: 'ADNOC DISTRIBUTION',
    amount: '240.00',
    date: new Date().toISOString().split('T')[0],
    currency: 'AED',
    category: 'Fuel',
    confidence: 0.98,
    raw_text: 'ADNOC STATION #123\nFUEL: SPECIAL 95\nAMOUNT: 240.00 AED\nDATE: 2026-03-27'
  };

  return mockData;
};
