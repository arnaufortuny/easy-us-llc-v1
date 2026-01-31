import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND_GREEN = '#6EDC8A';
const BRAND_DARK = '#0E1215';
const BRAND_GRAY = '#6B7280';
const BRAND_LIGHT_GREEN = '#ECFDF5';
const BRAND_LIGHT_GRAY = '#F9FAFB';

const BANK_INFO = {
  name: 'Column Bank NA',
  holder: 'Fortuny Consulting LLC',
  routing: '121145433',
  account: '141432778929495',
  swift: 'CLNOUS66MER',
  address: '1209 Mountain Road Place NE, STE R, Albuquerque, NM 87110'
};

let cachedLogoPath: string | null = null;
let logoChecked = false;

function getLogoPath(): string | null {
  if (logoChecked) return cachedLogoPath;
  const possiblePaths = [
    path.join(process.cwd(), 'client/public/logo-icon.png'),
    path.join(process.cwd(), 'dist/public/logo-icon.png'),
    path.join(__dirname, '../../client/public/logo-icon.png'),
  ];
  for (const logoPath of possiblePaths) {
    if (fs.existsSync(logoPath)) {
      cachedLogoPath = logoPath;
      logoChecked = true;
      return logoPath;
    }
  }
  logoChecked = true;
  return null;
}

export interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  idType?: string;
  idNumber?: string;
  address?: string;
  streetType?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
  clientId?: string;
}

export interface InvoiceData {
  orderNumber: string;
  date: string;
  dueDate?: string;
  customer: CustomerData;
  items: Array<{
    description: string;
    details?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  discount?: {
    code?: string;
    type?: 'percentage' | 'fixed';
    value?: number;
    amount: number;
  };
  total: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  paymentMethod?: 'transfer' | 'card' | 'stripe' | 'paypal' | 'link' | 'other';
  paymentDate?: string;
  paymentLink?: string;
  notes?: string;
  isMaintenance?: boolean;
}

export interface ReceiptData {
  orderNumber: string;
  requestCode: string;
  date: string;
  customer: CustomerData;
  service: {
    name: string;
    description?: string;
    features?: string[];
    state?: string;
  };
  llcDetails?: {
    companyName?: string;
    designator?: string;
    state?: string;
    ein?: string;
    creationDate?: string;
    registeredAgent?: string;
  };
  amount: number;
  currency: string;
  paymentMethod?: string;
  paymentDate?: string;
  transactionId?: string;
  notes?: string;
  isMaintenance?: boolean;
}

export interface CustomInvoiceData {
  invoiceNumber: string;
  date: string;
  customer: CustomerData;
  concept: string;
  description?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid';
  paymentMethod?: string;
  notes?: string;
}

function formatCurrency(cents: number, currency: string): string {
  const amount = (cents / 100).toFixed(2).replace('.', ',');
  return currency === 'EUR' ? `${amount} €` : `$${amount}`;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getStatusText(status: string): string {
  const map: Record<string, string> = {
    'pending': 'PENDIENTE', 'paid': 'PAGADO', 'completed': 'COMPLETADO',
    'cancelled': 'CANCELADO', 'refunded': 'REEMBOLSADO'
  };
  return map[status] || status.toUpperCase();
}

function getPaymentMethodText(method?: string): string {
  if (!method) return 'No especificado';
  const map: Record<string, string> = {
    'transfer': 'Transferencia bancaria',
    'link': 'Enlace de pago'
  };
  return map[method] || 'Transferencia bancaria';
}

export function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: false,
        info: { Title: `Factura ${data.orderNumber}`, Author: 'Easy US LLC' }
      });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // White background, no large dark header
      doc.rect(0, 0, 595, 842).fill('#FFFFFF');
      
      // Minimal top border for brand touch
      doc.rect(0, 0, 595, 4).fill(BRAND_DARK);
      
      // Header & Logo
      const logoPath = getLogoPath();
      if (logoPath) { try { doc.image(logoPath, 45, 30, { width: 40, height: 40 }); } catch {} }
      
      doc.font('Helvetica-Bold').fontSize(18).fillColor(BRAND_DARK).text('Easy US LLC', 95, 32);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_GRAY).text('BEYOND BORDERS BUSINESS', 95, 52);
      
      // Invoice Info Right Aligned
      doc.font('Helvetica-Bold').fontSize(22).fillColor(BRAND_DARK).text('FACTURA', 350, 32, { align: 'right', width: 200 });
      doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY).text(`№ ${data.orderNumber}`, 350, 58, { align: 'right', width: 200 });

      let y = 100;

      // Compact layout to avoid 2 pages
      // EMISOR (Left) | CLIENTE (Right)
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_GRAY).text('EMISOR', 45, y);
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text('Fortuny Consulting LLC', 45, y + 14);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_GRAY);
      doc.text('1209 Mountain Road Place NE, STE R', 45, y + 26);
      doc.text('Albuquerque, NM 87110, USA', 45, y + 36);
      doc.text('hola@easyusllc.com', 45, y + 46);

      const clientX = 350;
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_GRAY).text('CLIENTE', clientX, y);
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text(data.customer.name, clientX, y + 14);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_GRAY);
      let cy = y + 26;
      if (data.customer.idType && data.customer.idNumber) {
        doc.text(`${data.customer.idType}: ${data.customer.idNumber}`, clientX, cy);
        cy += 10;
      }
      doc.text(data.customer.email, clientX, cy);
      cy += 10;
      if (data.customer.address) {
        const addr = [data.customer.streetType, data.customer.address, data.customer.postalCode, data.customer.city, data.customer.country].filter(Boolean).join(', ');
        doc.fontSize(7).text(addr, clientX, cy, { width: 200 });
      }
      
      y += 75;

      // Compact Summary Bar
      doc.rect(45, y, 505, 30).fill(BRAND_LIGHT_GRAY);
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('FECHA EMISIÓN', 60, y + 8);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(formatDate(data.date), 60, y + 18);
      
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('VENCIMIENTO', 180, y + 8);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(data.dueDate ? formatDate(data.dueDate) : formatDate(data.date), 180, y + 18);
      
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('ESTADO', 320, y + 8);
      const statusColors: Record<string, string> = { pending: '#F59E0B', paid: '#10B981', cancelled: '#EF4444', refunded: '#8B5CF6' };
      const sColor = statusColors[data.status] || '#10B981';
      doc.font('Helvetica-Bold').fontSize(9).fillColor(sColor).text(getStatusText(data.status), 320, y + 18);

      y += 45;

      // Table Header (Dark & Compact)
      doc.rect(45, y, 505, 20).fill(BRAND_DARK);
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#FFFFFF');
      doc.text('DESCRIPCIÓN', 60, y + 6);
      doc.text('CANT', 360, y + 6);
      doc.text('PRECIO', 420, y + 6);
      doc.text('TOTAL', 490, y + 6);
      y += 20;

      // Table Rows
      for (const item of data.items) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(item.description, 60, y + 8, { width: 280 });
        if (item.details) {
          doc.font('Helvetica').fontSize(7).fillColor(BRAND_GRAY).text(item.details, 60, y + 18, { width: 280 });
        }
        doc.font('Helvetica').fontSize(9).fillColor(BRAND_DARK);
        doc.text(item.quantity.toString(), 365, y + 12);
        doc.text(formatCurrency(item.unitPrice, data.currency), 415, y + 12);
        doc.font('Helvetica-Bold').text(formatCurrency(item.total, data.currency), 485, y + 12);
        
        doc.moveTo(45, y + 30).lineTo(550, y + 30).strokeColor('#EEEEEE').lineWidth(0.5).stroke();
        y += 30;
      }

      // Compact Totals
      y += 10;
      const totalX = 350;
      doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY).text('Subtotal', totalX, y);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(formatCurrency(data.subtotal, data.currency), totalX + 130, y, { align: 'right', width: 70 });
      y += 14;

      if (data.discount && data.discount.amount > 0) {
        doc.font('Helvetica').fontSize(9).fillColor('#10B981').text('Descuento', totalX, y);
        doc.font('Helvetica-Bold').fontSize(9).fillColor('#10B981').text(`-${formatCurrency(data.discount.amount, data.currency)}`, totalX + 130, y, { align: 'right', width: 70 });
        y += 14;
      }

      doc.rect(totalX - 5, y, 210, 25).fill(BRAND_DARK);
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#FFFFFF').text('TOTAL', totalX, y + 8);
      doc.fontSize(12).fillColor(BRAND_GREEN).text(formatCurrency(data.total, data.currency), totalX + 80, y + 7, { align: 'right', width: 120 });
      y += 40;

      // Payment Info (Compact Grid)
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text('MÉTODO DE PAGO (TRANSFERENCIA)', 45, y);
      doc.rect(45, y + 12, 505, 50).strokeColor('#E5E7EB').lineWidth(0.5).stroke();
      
      const px = 60;
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('BANCO', px, y + 20);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_DARK).text(BANK_INFO.name, px, y + 28);
      
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('TITULAR', px + 120, y + 20);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_DARK).text(BANK_INFO.holder, px + 120, y + 28);
      
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('NÚMERO DE CUENTA', px + 280, y + 20);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_DARK).text(BANK_INFO.account, px + 280, y + 28);

      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('ROUTING / SWIFT', px, y + 42);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_DARK).text(`${BANK_INFO.routing} / ${BANK_INFO.swift}`, px, y + 50);

      if (data.status === 'pending' && data.paymentLink) {
        y += 75;
        doc.rect(45, y, 505, 25).fill(BRAND_GREEN);
        doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text('PAGAR ONLINE →', 60, y + 8);
        doc.font('Helvetica').fontSize(8).fillColor(BRAND_DARK).text(data.paymentLink, 160, y + 8, { link: data.paymentLink, underline: true });
      }

      // Footer
      doc.fontSize(7).fillColor(BRAND_GRAY).text('Easy US LLC es una marca de Fortuny Consulting LLC. 1209 Mountain Road Place NE, STE R, Albuquerque, NM 87110, USA', 45, 800, { align: 'center', width: 505 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: false,
        info: { Title: `Recibo ${data.requestCode}`, Author: 'Easy US LLC' }
      });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // White background, minimal header
      doc.rect(0, 0, 595, 842).fill('#FFFFFF');
      doc.rect(0, 0, 595, 4).fill(BRAND_DARK);
      
      // Logo & Header
      const logoPath = getLogoPath();
      if (logoPath) { try { doc.image(logoPath, 45, 25, { width: 35, height: 35 }); } catch {} }
      
      doc.font('Helvetica-Bold').fontSize(16).fillColor(BRAND_DARK).text('Easy US LLC', 90, 28);
      doc.font('Helvetica').fontSize(7).fillColor(BRAND_GRAY).text('CONFIRMACIÓN DE SERVICIO', 90, 46);
      
      // Receipt Title
      doc.font('Helvetica-Bold').fontSize(20).fillColor(BRAND_DARK).text(data.isMaintenance ? 'MANTENIMIENTO' : 'RECIBO', 350, 28, { align: 'right', width: 200 });
      doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY).text(`REF: ${data.requestCode}`, 350, 52, { align: 'right', width: 200 });

      let y = 85;

      // Customer & LLC info (Compact)
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_GRAY).text('CLIENTE', 45, y);
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text(data.customer.name, 45, y + 14);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_GRAY);
      let cy = y + 26;
      doc.text(data.customer.email, 45, cy);
      cy += 10;
      if (data.customer.address) {
        const addr = [data.customer.streetType, data.customer.address, data.customer.postalCode, data.customer.city].filter(Boolean).join(', ');
        doc.fontSize(7).text(addr, 45, cy, { width: 230 });
      }

      const llcX = 320;
      if (data.llcDetails && (data.llcDetails.companyName || data.llcDetails.state)) {
        doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_GRAY).text('DATOS DE LA LLC', llcX, y);
        let ly = y + 14;
        if (data.llcDetails.companyName) {
          doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text(`${data.llcDetails.companyName} ${data.llcDetails.designator || 'LLC'}`, llcX, ly);
          ly += 14;
        }
        doc.font('Helvetica').fontSize(8).fillColor(BRAND_GRAY);
        if (data.llcDetails.state) { doc.text(`Estado: ${data.llcDetails.state}`, llcX, ly); ly += 10; }
        if (data.llcDetails.ein) { doc.text(`EIN: ${data.llcDetails.ein}`, llcX, ly); }
      }

      y += 75;

      // Summary Bar (Compact)
      doc.rect(45, y, 505, 30).fill(BRAND_LIGHT_GRAY);
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('FECHA', 60, y + 8);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(formatDate(data.date), 60, y + 18);
      
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('PEDIDO №', 180, y + 8);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(data.orderNumber, 180, y + 18);
      
      doc.font('Helvetica-Bold').fontSize(7).fillColor(BRAND_GRAY).text('MÉTODO', 320, y + 8);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(getPaymentMethodText(data.paymentMethod), 320, y + 18);

      y += 45;

      // Service Details (Modern & Compact)
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text('DETALLE DEL SERVICIO', 45, y);
      doc.rect(45, y + 12, 505, 60).strokeColor('#E5E7EB').lineWidth(0.5).stroke();
      
      doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND_DARK).text(data.service.name, 60, y + 25);
      if (data.service.description) {
        doc.font('Helvetica').fontSize(8).fillColor(BRAND_GRAY).text(data.service.description, 60, y + 42, { width: 300 });
      }
      
      // Amount (Aligned with service)
      doc.rect(400, y + 12, 150, 60).fill(BRAND_GREEN);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(BRAND_DARK).text('TOTAL PAGADO', 415, y + 25);
      doc.fontSize(16).text(formatCurrency(data.amount, data.currency), 415, y + 40, { width: 120, align: 'center' });

      y += 85;

      // Success Message (Compact)
      doc.rect(45, y, 505, 30).fill(BRAND_LIGHT_GREEN);
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#059669').text('¡Gracias por confiar en Easy US LLC!', 45, y + 10, { align: 'center', width: 505 });

      // Footer
      doc.fontSize(7).fillColor(BRAND_GRAY).text('Documento de confirmación. Easy US LLC | easyusllc.com', 45, 800, { align: 'center', width: 505 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function generateCustomInvoicePdf(data: CustomInvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 40, bufferPages: false,
        info: { Title: `Factura ${data.invoiceNumber}`, Author: 'Easy US LLC' }
      });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Background
      doc.rect(0, 0, 595, 842).fill('#FFFFFF');
      doc.rect(0, 0, 595, 160).fill(BRAND_DARK);
      
      // Logo & Header
      const logoPath = getLogoPath();
      if (logoPath) { try { doc.image(logoPath, 45, 35, { width: 45, height: 45 }); } catch {} }
      
      doc.font('Helvetica-Bold').fontSize(20).fillColor('#FFFFFF').text('Easy US LLC', 100, 40);
      doc.font('Helvetica').fontSize(8).fillColor(BRAND_GREEN).text('FACTURA MANUAL', 100, 62);
      
      // Invoice Title
      doc.font('Helvetica-Bold').fontSize(24).fillColor('#FFFFFF').text('FACTURA', 350, 40, { align: 'right', width: 200 });
      doc.font('Helvetica').fontSize(10).fillColor('#9CA3AF').text(`№ ${data.invoiceNumber}`, 350, 70, { align: 'right', width: 200 });

      let y = 180;

      // Two columns: Company | Customer
      // EMISOR
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text('EMISOR', 45, y);
      doc.font('Helvetica-Bold').fontSize(11).text('Fortuny Consulting LLC', 45, y + 18);
      doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY);
      doc.text('1209 Mountain Road Place NE, STE R', 45, y + 34);
      doc.text('Albuquerque, NM 87110, USA', 45, y + 48);
      doc.text('hola@easyusllc.com', 45, y + 62);

      // CLIENTE
      const clientX = 350;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text('CLIENTE', clientX, y);
      doc.font('Helvetica-Bold').fontSize(11).text(data.customer.name, clientX, y + 18);
      doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY);
      doc.text(data.customer.email, clientX, y + 34);
      if (data.customer.phone) {
        doc.text(data.customer.phone, clientX, y + 48);
      }
      
      y += 100;

      // Summary Bar
      doc.rect(45, y, 505, 40).fill(BRAND_LIGHT_GRAY);
      doc.font('Helvetica-Bold').fontSize(8).fillColor(BRAND_GRAY).text('FECHA EMISIÓN', 60, y + 10);
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text(formatDate(data.date), 60, y + 22);
      
      doc.font('Helvetica-Bold').fontSize(8).fillColor(BRAND_GRAY).text('ESTADO', 180, y + 10);
      const sColor = data.status === 'paid' ? '#10B981' : '#F59E0B';
      doc.font('Helvetica-Bold').fontSize(10).fillColor(sColor).text(getStatusText(data.status), 180, y + 22);

      y += 65;

      // Concept Table
      doc.rect(45, y, 505, 30).fill(BRAND_DARK);
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#FFFFFF');
      doc.text('CONCEPTO / DESCRIPCIÓN', 60, y + 10);
      doc.text('IMPORTE', 480, y + 10);
      y += 30;

      doc.rect(45, y, 505, 60).fill('#FAFAFA');
      doc.font('Helvetica-Bold').fontSize(11).fillColor(BRAND_DARK).text(data.concept, 60, y + 15, { width: 380 });
      if (data.description) {
        doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY).text(data.description, 60, y + 32, { width: 380 });
      }
      doc.font('Helvetica-Bold').fontSize(12).fillColor(BRAND_DARK).text(formatCurrency(data.amount, data.currency), 460, y + 22, { align: 'right', width: 80 });
      
      y += 80;

      // Total
      const totalX = 350;
      doc.rect(totalX - 10, y, 215, 45).fill(BRAND_DARK);
      doc.font('Helvetica-Bold').fontSize(12).fillColor('#FFFFFF').text('TOTAL', totalX, y + 16);
      doc.fontSize(18).fillColor(BRAND_GREEN).text(formatCurrency(data.amount, data.currency), totalX + 80, y + 14, { align: 'right', width: 120 });
      
      y += 70;

      // Payment Info
      doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text('INFORMACIÓN DE PAGO', 45, y);
      doc.rect(45, y + 15, 505, 65).strokeColor('#E5E7EB').lineWidth(1).stroke();
      
      doc.font('Helvetica-Bold').fontSize(8).fillColor(BRAND_GRAY).text('MÉTODO', 60, y + 25);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(getPaymentMethodText(data.paymentMethod), 60, y + 37);
      
      doc.font('Helvetica-Bold').fontSize(8).fillColor(BRAND_GRAY).text('BANCO', 180, y + 25);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(BANK_INFO.name, 180, y + 37);
      
      doc.font('Helvetica-Bold').fontSize(8).fillColor(BRAND_GRAY).text('CUENTA', 320, y + 25);
      doc.font('Helvetica-Bold').fontSize(9).fillColor(BRAND_DARK).text(BANK_INFO.account, 320, y + 37);

      if (data.notes) {
        y += 100;
        doc.font('Helvetica-Bold').fontSize(10).fillColor(BRAND_DARK).text('NOTAS', 45, y);
        doc.font('Helvetica').fontSize(9).fillColor(BRAND_GRAY).text(data.notes, 45, y + 18, { width: 505 });
      }

      // Footer
      doc.fontSize(8).fillColor(BRAND_GRAY).text('Documento oficial emitido por Fortuny Consulting LLC.', 45, 780, { align: 'center', width: 505 });
      doc.text('hola@easyusllc.com | easyusllc.com', 45, 795, { align: 'center', width: 505 });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export function generateOrderInvoice(orderData: {
  order: { id: number; invoiceNumber?: string | null; amount: number; originalAmount?: number | null; discountCode?: string | null; discountAmount?: number | null; currency: string; status: string; createdAt?: Date | null; };
  product: { name: string; description: string; features?: string[]; };
  user: { firstName?: string | null; lastName?: string | null; email: string; };
  application?: { ownerFullName?: string | null; ownerEmail?: string | null; ownerPhone?: string | null; ownerIdType?: string | null; ownerIdNumber?: string | null; ownerStreetType?: string | null; ownerAddress?: string | null; ownerCity?: string | null; ownerProvince?: string | null; ownerPostalCode?: string | null; ownerCountry?: string | null; paymentMethod?: string | null; state?: string | null; } | null;
  maintenanceApplication?: { ownerFullName?: string | null; ownerEmail?: string | null; ownerPhone?: string | null; state?: string | null; paymentMethod?: string | null; } | null;
  paymentLink?: string | null;
  notes?: string | null;
}): Promise<Buffer> {
  const app = orderData.application || orderData.maintenanceApplication;
  const llcApp = orderData.application;
  const customerName = app?.ownerFullName || [orderData.user.firstName, orderData.user.lastName].filter(Boolean).join(' ') || orderData.user.email.split('@')[0];

  const invoiceData: InvoiceData = {
    orderNumber: orderData.order.invoiceNumber || `ORD-${orderData.order.id.toString().padStart(8, '0')}`,
    date: orderData.order.createdAt?.toISOString() || new Date().toISOString(),
    customer: {
      name: customerName,
      email: app?.ownerEmail || orderData.user.email,
      phone: app?.ownerPhone || undefined,
      idType: llcApp?.ownerIdType || undefined,
      idNumber: llcApp?.ownerIdNumber || undefined,
      streetType: llcApp?.ownerStreetType || undefined,
      address: llcApp?.ownerAddress || undefined,
      city: llcApp?.ownerCity || undefined,
      province: llcApp?.ownerProvince || undefined,
      postalCode: llcApp?.ownerPostalCode || undefined,
      country: llcApp?.ownerCountry || undefined,
      clientId: orderData.user.email.split('@')[0].substring(0, 8).toUpperCase()
    },
    items: [{
      description: orderData.product.name,
      details: orderData.product.features?.slice(0, 3).join(' • ') || orderData.product.description.substring(0, 80),
      quantity: 1,
      unitPrice: orderData.order.originalAmount || orderData.order.amount,
      total: orderData.order.originalAmount || orderData.order.amount
    }],
    subtotal: orderData.order.originalAmount || orderData.order.amount,
    discount: orderData.order.discountAmount && orderData.order.discountAmount > 0 ? { code: orderData.order.discountCode || undefined, amount: orderData.order.discountAmount } : undefined,
    total: orderData.order.amount,
    currency: orderData.order.currency,
    status: orderData.order.status === 'paid' || orderData.order.status === 'completed' ? 'paid' : 'pending',
    paymentMethod: (app?.paymentMethod as 'transfer' | 'link') || undefined,
    paymentLink: orderData.paymentLink || undefined,
    notes: orderData.notes || undefined,
    isMaintenance: !!orderData.maintenanceApplication
  };
  return generateInvoicePdf(invoiceData);
}

export function generateOrderReceipt(orderData: {
  order: { id: number; invoiceNumber?: string | null; amount: number; currency: string; status: string; createdAt?: Date | null; };
  product: { name: string; description: string; features?: string[]; };
  user: { firstName?: string | null; lastName?: string | null; email: string; };
  application?: { requestCode?: string | null; ownerFullName?: string | null; ownerEmail?: string | null; ownerPhone?: string | null; ownerIdType?: string | null; ownerIdNumber?: string | null; ownerStreetType?: string | null; ownerAddress?: string | null; ownerCity?: string | null; ownerProvince?: string | null; ownerPostalCode?: string | null; ownerCountry?: string | null; companyName?: string | null; designator?: string | null; state?: string | null; paymentMethod?: string | null; llcCreatedDate?: Date | null; } | null;
  maintenanceApplication?: { requestCode?: string | null; ownerFullName?: string | null; ownerEmail?: string | null; ownerPhone?: string | null; companyName?: string | null; ein?: string | null; state?: string | null; creationYear?: string | null; paymentMethod?: string | null; bankAccount?: string | null; } | null;
}): Promise<Buffer> {
  const app = orderData.application;
  const maintApp = orderData.maintenanceApplication;
  const isMaintenance = !!maintApp;
  const currentApp = app || maintApp;
  const customerName = currentApp?.ownerFullName || [orderData.user.firstName, orderData.user.lastName].filter(Boolean).join(' ') || orderData.user.email.split('@')[0];

  const receiptData: ReceiptData = {
    orderNumber: orderData.order.invoiceNumber || `ORD-${orderData.order.id.toString().padStart(8, '0')}`,
    requestCode: currentApp?.requestCode || `REQ-${orderData.order.id.toString().padStart(8, '0')}`,
    date: orderData.order.createdAt?.toISOString() || new Date().toISOString(),
    customer: {
      name: customerName,
      email: currentApp?.ownerEmail || orderData.user.email,
      phone: currentApp?.ownerPhone || undefined,
      idType: app?.ownerIdType || undefined,
      idNumber: app?.ownerIdNumber || undefined,
      streetType: app?.ownerStreetType || undefined,
      address: app?.ownerAddress || undefined,
      city: app?.ownerCity || undefined,
      province: app?.ownerProvince || undefined,
      postalCode: app?.ownerPostalCode || undefined,
      country: app?.ownerCountry || undefined
    },
    service: { name: orderData.product.name, description: orderData.product.features?.join(' • ') || orderData.product.description, state: app?.state || maintApp?.state || undefined },
    llcDetails: isMaintenance ? { companyName: maintApp?.companyName || undefined, state: maintApp?.state || undefined, ein: maintApp?.ein || undefined, creationDate: maintApp?.creationYear || undefined } :
      app ? { companyName: app.companyName || undefined, designator: app.designator || undefined, state: app.state || undefined, creationDate: app.llcCreatedDate?.toISOString() || undefined, registeredAgent: 'Easy US LLC' } : undefined,
    amount: orderData.order.amount,
    currency: orderData.order.currency,
    paymentMethod: currentApp?.paymentMethod || undefined,
    paymentDate: orderData.order.createdAt?.toISOString(),
    isMaintenance
  };
  return generateReceiptPdf(receiptData);
}
