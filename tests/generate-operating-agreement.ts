import { jsPDF } from "jspdf";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestLLCData {
  companyName: string;
  designator: string;
  ein: string;
  state: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerIdNumber: string;
  ownerIdType: string;
  ownerAddress: string;
  ownerCity: string;
  ownerCountry: string;
  ownerProvince: string;
  ownerPostalCode: string;
  llcCreatedDate: string;
}

interface FormData {
  memberAddress: string;
  memberPhone: string;
  capitalContribution: string;
  effectiveDate: string;
  orderId: string;
}

const testLLC: TestLLCData = {
  companyName: "ACME DIGITAL SERVICES",
  designator: "LLC",
  ein: "88-1234567",
  state: "New Mexico",
  ownerFullName: "Juan García López",
  ownerEmail: "juan.garcia@ejemplo.com",
  ownerPhone: "+34 612 345 678",
  ownerIdNumber: "12345678A",
  ownerIdType: "DNI",
  ownerAddress: "Calle Gran Vía 123, 4º Izquierda",
  ownerCity: "Madrid",
  ownerCountry: "España",
  ownerProvince: "Madrid",
  ownerPostalCode: "28013",
  llcCreatedDate: "2026-01-15",
};

const testFormData: FormData = {
  memberAddress: "Calle Gran Vía 123, 4º Izquierda, Madrid, Madrid, España 28013",
  memberPhone: "+34 612 345 678",
  capitalContribution: "10,000",
  effectiveDate: "2026-02-03",
  orderId: "NM-12345678",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(): string {
  const now = new Date();
  return now.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function loadLogoBase64(): string | null {
  try {
    const logoPath = path.join(__dirname, "../client/src/assets/logo-icon.png");
    const logoBuffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    return null;
  }
}

function generateOperatingAgreementPDF(llc: TestLLCData, formData: FormData, logoBase64: string | null): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const black: [number, number, number] = [0, 0, 0];
  const gray: [number, number, number] = [100, 100, 100];
  const lightGray: [number, number, number] = [180, 180, 180];

  const companyFullName = `${llc.companyName} ${llc.designator}`;
  const signatureDateTime = formatDateTime();

  let pageNumber = 1;

  const addHeader = () => {
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", pageWidth - margin - 18, 8, 18, 18);
      } catch {}
    }

    doc.setFontSize(7);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text(`Order: ${formData.orderId}`, pageWidth - margin, 30, { align: "right" });

    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 35, pageWidth - margin, 35);
  };

  const addFooter = () => {
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    doc.setFontSize(7);
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("www.easyusllc.com", margin, pageHeight - 8);
    doc.text(`${pageNumber}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  };

  let yPos = 0;

  const checkNewPage = (space: number): number => {
    if (yPos + space > pageHeight - 20) {
      addFooter();
      doc.addPage();
      pageNumber++;
      addHeader();
      return 42;
    }
    return yPos;
  };

  // ===== PAGE 1: COVER =====
  addHeader();

  yPos = 55;

  doc.setTextColor(black[0], black[1], black[2]);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("OPERATING AGREEMENT", pageWidth / 2, yPos, { align: "center" });

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text("of", pageWidth / 2, yPos, { align: "center" });

  yPos += 10;
  doc.setFontSize(16);
  doc.setTextColor(black[0], black[1], black[2]);
  doc.setFont("helvetica", "bold");
  doc.text(companyFullName, pageWidth / 2, yPos, { align: "center" });

  yPos += 20;

  // Info table
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, contentWidth, 35, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray[0], gray[1], gray[2]);

  const col1 = margin + 8;
  const col2 = margin + contentWidth / 3 + 8;
  const col3 = margin + (contentWidth * 2) / 3 + 8;

  doc.text("STATE", col1, yPos + 10);
  doc.text("EIN", col2, yPos + 10);
  doc.text("FORMED", col3, yPos + 10);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(black[0], black[1], black[2]);
  doc.text(llc.state, col1, yPos + 22);
  doc.text(llc.ein, col2, yPos + 22);
  doc.text(formatDate(llc.llcCreatedDate), col3, yPos + 22);

  yPos += 50;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(gray[0], gray[1], gray[2]);
  const intro = `This Operating Agreement governs the operations of ${companyFullName}, a Limited Liability Company organized under the laws of the State of ${llc.state}.`;
  const introLines = doc.splitTextToSize(intro, contentWidth);
  doc.text(introLines, margin, yPos);

  yPos += introLines.length * 5 + 15;

  doc.setFontSize(8);
  doc.text("Effective Date:", margin, yPos);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(black[0], black[1], black[2]);
  doc.text(formatDate(formData.effectiveDate), margin + 28, yPos);

  addFooter();

  // ===== PAGE 2+: CONTENT =====
  doc.addPage();
  pageNumber++;
  addHeader();
  yPos = 42;

  const addSection = (num: number, title: string, content: string) => {
    yPos = checkNewPage(25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text(`${num}. ${title}`, margin, yPos);

    yPos += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    const lines = doc.splitTextToSize(content, contentWidth);
    yPos = checkNewPage(lines.length * 4.5);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 4.5 + 8;
  };

  addSection(1, "FORMATION", `${companyFullName} is a Limited Liability Company formed under the laws of ${llc.state} on ${formatDate(llc.llcCreatedDate)}. EIN: ${llc.ein}.`);

  addSection(2, "NAME AND BUSINESS", `The Company name is ${companyFullName}. The principal place of business shall be as determined by the Members.`);

  addSection(3, "PURPOSE", `The Company may engage in any lawful business activity permitted under the laws of ${llc.state}.`);

  addSection(4, "MEMBERS", `Initial Member: ${llc.ownerFullName} (${llc.ownerIdType}: ${llc.ownerIdNumber}) with 100% ownership interest.`);

  addSection(5, "CAPITAL", `Initial capital contribution: $${formData.capitalContribution} USD. Additional contributions as agreed by Members.`);

  addSection(6, "MANAGEMENT", "The Company is member-managed. Members may bind the Company in ordinary business. Major decisions require majority consent.");

  addSection(7, "DISTRIBUTIONS", "Distributions shall be made to Members in proportion to their ownership interests as determined by the Members.");

  addSection(8, "TAXATION", "The Company elects disregarded entity (single-member) or partnership (multi-member) status unless otherwise elected.");

  addSection(9, "RECORDS", "The Company shall maintain accurate books and records. Members may inspect records during business hours.");

  addSection(10, "AMENDMENTS", "This Agreement may be amended by written consent of all Members.");

  addSection(11, "DISSOLUTION", "The Company dissolves upon: (a) unanimous written consent; (b) judicial decree; or (c) applicable law.");

  addSection(12, "GOVERNING LAW", `This Agreement is governed by the laws of ${llc.state}.`);

  // ===== SIGNATURE PAGE =====
  doc.addPage();
  pageNumber++;
  addHeader();
  yPos = 50;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(black[0], black[1], black[2]);
  doc.text("SIGNATURE", pageWidth / 2, yPos, { align: "center" });

  yPos += 15;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text("IN WITNESS WHEREOF, the undersigned has executed this Operating Agreement.", margin, yPos);

  yPos += 20;

  // Member box
  doc.setFillColor(250, 250, 250);
  doc.rect(margin, yPos, contentWidth, 55, "F");
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(margin, yPos, contentWidth, 55, "S");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text("MEMBER", margin + 5, yPos + 8);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(black[0], black[1], black[2]);
  doc.text(llc.ownerFullName, margin + 5, yPos + 20);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text(`${llc.ownerIdType}: ${llc.ownerIdNumber}`, margin + 5, yPos + 28);
  doc.text(`Email: ${llc.ownerEmail}`, margin + 5, yPos + 36);
  doc.text(`Phone: ${formData.memberPhone}`, margin + 5, yPos + 44);

  yPos += 70;

  // Electronic signature
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos, contentWidth, 30, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(black[0], black[1], black[2]);
  doc.text("ELECTRONICALLY SIGNED", margin + 5, yPos + 10);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text(`By: ${llc.ownerFullName}`, margin + 5, yPos + 18);
  doc.text(`Date: ${signatureDateTime}`, margin + 5, yPos + 25);

  doc.text(`Order ID: ${formData.orderId}`, pageWidth - margin - 5, yPos + 18, { align: "right" });

  addFooter();

  return Buffer.from(doc.output("arraybuffer"));
}

async function main() {
  console.log("=".repeat(60));
  console.log("OPERATING AGREEMENT - OPTIMIZED B&W VERSION");
  console.log("=".repeat(60));
  console.log();

  console.log("Test Data:");
  console.log(`  Company: ${testLLC.companyName} ${testLLC.designator}`);
  console.log(`  EIN: ${testLLC.ein}`);
  console.log(`  State: ${testLLC.state}`);
  console.log(`  Owner: ${testLLC.ownerFullName}`);
  console.log(`  Order ID: ${testFormData.orderId}`);
  console.log();

  const logoBase64 = loadLogoBase64();
  console.log(logoBase64 ? "Logo loaded" : "Logo not found");

  console.log("Generating PDF...");

  try {
    const pdfBuffer = generateOperatingAgreementPDF(testLLC, testFormData, logoBase64);
    const outputPath = path.join(__dirname, "operating-agreement-test.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✓ PDF: ${outputPath}`);
    console.log(`  Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
