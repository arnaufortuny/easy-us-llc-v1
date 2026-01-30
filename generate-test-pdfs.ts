import { generateInvoicePdf, generateReceiptPdf } from './server/lib/pdf-generator';
import * as fs from 'fs';

async function generateTestPDFs() {
  console.log('Generating test PDFs...');
  
  // Test Invoice
  const invoiceData = {
    invoiceNumber: "INV-2026-0001",
    date: new Date().toLocaleDateString('es-ES'),
    customerName: "Juan García López",
    customerEmail: "juan.garcia@ejemplo.com",
    productName: "New Mexico LLC Formation",
    amount: 73900,
    currency: "EUR",
    status: "Pagado",
    originalAmount: 79900,
    discountAmount: 6000,
    discountCode: "BIENVENIDO10"
  };
  
  const invoicePdf = await generateInvoicePdf(invoiceData);
  fs.writeFileSync('test-invoice.pdf', invoicePdf);
  console.log('✓ Invoice generated: test-invoice.pdf (' + invoicePdf.length + ' bytes)');
  
  // Test Receipt  
  const receiptData = {
    requestCode: "NM-12345678",
    date: new Date().toLocaleDateString('es-ES'),
    customerName: "María Fernández Ruiz",
    productName: "Wyoming LLC Formation",
    amount: 89900,
    currency: "EUR",
    status: "Completado",
    companyName: "TechStartup LLC",
    state: "Wyoming",
    ein: "12-3456789",
    notes: "Incluye EIN y Registered Agent 12 meses"
  };
  
  const receiptPdf = await generateReceiptPdf(receiptData);
  fs.writeFileSync('test-receipt.pdf', receiptPdf);
  console.log('✓ Receipt generated: test-receipt.pdf (' + receiptPdf.length + ' bytes)');
  
  console.log('\nPDFs generated successfully!');
}

generateTestPDFs().catch(console.error);
