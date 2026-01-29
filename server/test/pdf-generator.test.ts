import { describe, it, expect } from 'vitest';
import { generateInvoicePdf, generateReceiptPdf } from '../lib/pdf-generator';

describe('PDF Generator', () => {
  describe('generateInvoicePdf', () => {
    it('should generate a valid PDF buffer for invoice', async () => {
      const invoiceData = {
        invoiceNumber: 'TEST-001',
        date: '15/01/2025',
        customerName: 'Juan García',
        customerEmail: 'juan@example.com',
        productName: 'LLC New Mexico',
        amount: 73900,
        currency: 'EUR',
        status: 'paid',
      };

      const pdfBuffer = await generateInvoicePdf(invoiceData);
      
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
      expect(pdfBuffer.slice(0, 4).toString()).toBe('%PDF');
    });

    it('should include discount information when provided', async () => {
      const invoiceData = {
        invoiceNumber: 'TEST-002',
        date: '15/01/2025',
        customerName: 'María López',
        customerEmail: 'maria@example.com',
        productName: 'LLC Wyoming',
        amount: 80910,
        currency: 'EUR',
        status: 'paid',
        originalAmount: 89900,
        discountAmount: 8990,
        discountCode: 'WELCOME10',
      };

      const pdfBuffer = await generateInvoicePdf(invoiceData);
      
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
    });
  });

  describe('generateReceiptPdf', () => {
    it('should generate a valid PDF buffer for receipt', async () => {
      const receiptData = {
        requestCode: 'NM-25-ABC123',
        date: '15/01/2025',
        customerName: 'Juan García',
        productName: 'LLC New Mexico',
        amount: 73900,
        currency: 'EUR',
        status: 'pending',
      };

      const pdfBuffer = await generateReceiptPdf(receiptData);
      
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
      expect(pdfBuffer.slice(0, 4).toString()).toBe('%PDF');
    });

    it('should handle different order statuses', async () => {
      const statuses = ['pending', 'processing', 'paid', 'completed', 'cancelled'];
      
      for (const status of statuses) {
        const receiptData = {
          requestCode: `TEST-${status.toUpperCase()}`,
          date: '15/01/2025',
          customerName: 'Test User',
          productName: 'LLC Delaware',
          amount: 119900,
          currency: 'EUR',
          status,
        };

        const pdfBuffer = await generateReceiptPdf(receiptData);
        expect(pdfBuffer).toBeInstanceOf(Buffer);
        expect(pdfBuffer.length).toBeGreaterThan(0);
      }
    });
  });
});
