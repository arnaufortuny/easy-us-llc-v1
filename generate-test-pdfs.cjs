const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const BRAND_GREEN = '#6EDC8A';
const BRAND_DARK = '#0E1215';
const BRAND_GRAY = '#6B7280';

function getLogoPath() {
  const possiblePaths = [
    path.join(process.cwd(), 'client/public/logo-icon.png'),
    path.join(process.cwd(), 'dist/public/logo-icon.png'),
  ];
  for (const logoPath of possiblePaths) {
    if (fs.existsSync(logoPath)) return logoPath;
  }
  return null;
}

function generateInvoicePdf(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.rect(0, 0, 595, 90).fill(BRAND_DARK);
    const logoPath = getLogoPath();
    if (logoPath) {
      try { doc.image(logoPath, 50, 15, { width: 55, height: 55 }); } catch {}
    }
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#FFFFFF').text('Easy US LLC', 115, 28);
    doc.font('Helvetica').fontSize(10).fillColor('#9CA3AF').text('Tu socio para formar LLC en USA', 115, 52);

    // Invoice title
    doc.fillColor(BRAND_DARK).font('Helvetica-Bold').fontSize(24).text('FACTURA', 50, 110);
    doc.font('Helvetica').fontSize(11).fillColor(BRAND_GRAY).text(`Número: ${data.invoiceNumber}`, 50, 140);
    doc.text(`Fecha: ${data.date}`, 50, 155);

    // Customer info
    doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND_DARK).text('CLIENTE', 50, 195);
    doc.font('Helvetica').fontSize(11).fillColor(BRAND_GRAY);
    doc.text(data.customerName, 50, 215);
    doc.text(data.customerEmail, 50, 230);

    // Line items header
    doc.rect(50, 270, 495, 30).fill('#F3F4F6');
    doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK);
    doc.text('DESCRIPCIÓN', 60, 280);
    doc.text('IMPORTE', 450, 280);

    // Line item
    doc.font('Helvetica').fontSize(11).fillColor(BRAND_DARK);
    doc.text(data.productName, 60, 315);
    const amount = (data.amount / 100).toFixed(2);
    doc.text(`${amount} €`, 450, 315);

    // Discount if applicable
    let yPos = 350;
    if (data.discountCode && data.discountAmount) {
      doc.fillColor('#059669').text(`Descuento (${data.discountCode}): -${(data.discountAmount / 100).toFixed(2)} €`, 350, yPos);
      yPos += 25;
    }

    // Total
    doc.rect(350, yPos, 195, 35).fill(BRAND_GREEN);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#FFFFFF');
    doc.text('TOTAL:', 360, yPos + 10);
    doc.text(`${amount} €`, 450, yPos + 10);

    // Status badge
    doc.rect(50, yPos + 60, 80, 25).fillAndStroke('#D1FAE5', '#10B981');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#059669').text(data.status.toUpperCase(), 65, yPos + 67);

    // Footer
    doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY);
    doc.text('EASY US LLC • FORTUNY CONSULTING LLC', 50, 750);
    doc.text('1209 Mountain Road Place NE, STE R, Albuquerque, NM 87110', 50, 762);
    doc.text('info@easyusllc.com • +34 614 91 69 10', 50, 774);

    doc.end();
  });
}

function generateReceiptPdf(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.rect(0, 0, 595, 90).fill(BRAND_DARK);
    const logoPath = getLogoPath();
    if (logoPath) {
      try { doc.image(logoPath, 50, 15, { width: 55, height: 55 }); } catch {}
    }
    doc.font('Helvetica-Bold').fontSize(22).fillColor('#FFFFFF').text('Easy US LLC', 115, 28);
    doc.font('Helvetica').fontSize(10).fillColor('#9CA3AF').text('Tu socio para formar LLC en USA', 115, 52);

    // Receipt title
    doc.fillColor(BRAND_DARK).font('Helvetica-Bold').fontSize(24).text('RECIBO', 50, 110);
    doc.font('Helvetica').fontSize(11).fillColor(BRAND_GRAY);
    doc.text(`Referencia: ${data.requestCode}`, 50, 140);
    doc.text(`Fecha: ${data.date}`, 50, 155);

    // Customer info
    doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND_DARK).text('CLIENTE', 50, 195);
    doc.font('Helvetica').fontSize(11).fillColor(BRAND_GRAY).text(data.customerName, 50, 215);

    // LLC Details
    doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND_DARK).text('DETALLES DE LA LLC', 50, 255);
    doc.font('Helvetica').fontSize(11).fillColor(BRAND_GRAY);
    if (data.companyName) doc.text(`Empresa: ${data.companyName}`, 50, 275);
    if (data.state) doc.text(`Estado: ${data.state}`, 50, 290);
    if (data.ein) doc.text(`EIN: ${data.ein}`, 50, 305);

    // Service
    doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND_DARK).text('SERVICIO', 50, 345);
    doc.font('Helvetica').fontSize(11).fillColor(BRAND_GRAY).text(data.productName, 50, 365);

    // Total
    const amount = (data.amount / 100).toFixed(2);
    doc.rect(350, 400, 195, 40).fill(BRAND_GREEN);
    doc.font('Helvetica-Bold').fontSize(14).fillColor('#FFFFFF');
    doc.text('TOTAL PAGADO:', 360, 412);
    doc.text(`${amount} €`, 460, 412);

    // Status
    doc.rect(50, 420, 100, 25).fillAndStroke('#D1FAE5', '#10B981');
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#059669').text('COMPLETADO', 65, 427);

    // Notes
    if (data.notes) {
      doc.font('Helvetica').fontSize(10).fillColor(BRAND_GRAY).text(`Notas: ${data.notes}`, 50, 470);
    }

    // Footer
    doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY);
    doc.text('EASY US LLC • FORTUNY CONSULTING LLC', 50, 750);
    doc.text('1209 Mountain Road Place NE, STE R, Albuquerque, NM 87110', 50, 762);
    doc.text('info@easyusllc.com • +34 614 91 69 10', 50, 774);

    doc.end();
  });
}

async function main() {
  console.log('Generating test PDFs...\n');

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
  console.log('✓ Factura generada: test-invoice.pdf (' + Math.round(invoicePdf.length / 1024) + ' KB)');
  
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
  console.log('✓ Recibo generado: test-receipt.pdf (' + Math.round(receiptPdf.length / 1024) + ' KB)');
  
  console.log('\n¡PDFs generados correctamente!');
}

main().catch(console.error);
