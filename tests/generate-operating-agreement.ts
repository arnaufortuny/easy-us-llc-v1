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
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function loadLogoBase64(): string | null {
  try {
    const logoPath = path.join(__dirname, "../client/src/assets/logo-icon.png");
    const logoBuffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    console.log("Logo not found, using text fallback");
    return null;
  }
}

function generateOperatingAgreementPDF(llc: TestLLCData, formData: FormData, logoBase64: string | null): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 25;
  const contentWidth = pageWidth - margin * 2;

  const accentColor: [number, number, number] = [34, 197, 94];
  const darkColor: [number, number, number] = [14, 18, 21];
  const grayColor: [number, number, number] = [107, 114, 128];
  const lightGray: [number, number, number] = [229, 231, 235];
  const lightGreen: [number, number, number] = [220, 252, 231];

  const companyFullName = `${llc.companyName} ${llc.designator}`;

  let pageNumber = 1;

  const addPageFooter = () => {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 18, pageWidth, 18, "F");

    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

    doc.setFontSize(7);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text("Operating Agreement - www.easyusllc.com", margin, pageHeight - 8);
    doc.text(`${pageNumber}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  };

  const addPageHeader = () => {
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 0, pageWidth, 3, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(companyFullName, margin, 12);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text("OPERATING AGREEMENT", pageWidth - margin, 12, { align: "right" });

    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, 16, pageWidth - margin, 16);
  };

  let yPos = 0;

  const checkNewPage = (requiredSpace: number): number => {
    if (yPos + requiredSpace > pageHeight - 25) {
      addPageFooter();
      doc.addPage();
      pageNumber++;
      addPageHeader();
      return 22;
    }
    return yPos;
  };

  // ===== COVER PAGE =====
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 0, pageWidth, 6, "F");

  // Logo
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", pageWidth / 2 - 20, 20, 40, 40);
    } catch {
      doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
      doc.circle(pageWidth / 2, 40, 18, "F");
      doc.setFontSize(14);
      doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.setFont("helvetica", "bold");
      doc.text("EU", pageWidth / 2, 44, { align: "center" });
    }
  } else {
    doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
    doc.circle(pageWidth / 2, 40, 18, "F");
    doc.setFontSize(14);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("EU", pageWidth / 2, 44, { align: "center" });
  }

  yPos = 75;

  // Title
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("OPERATING", pageWidth / 2, yPos, { align: "center" });
  yPos += 12;
  doc.text("AGREEMENT", pageWidth / 2, yPos, { align: "center" });

  yPos += 18;
  doc.setFontSize(12);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text("of", pageWidth / 2, yPos, { align: "center" });

  yPos += 14;
  doc.setFontSize(20);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(companyFullName, pageWidth / 2, yPos, { align: "center" });

  yPos += 20;
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(2);
  doc.line(pageWidth / 2 - 50, yPos, pageWidth / 2 + 50, yPos);

  yPos += 25;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const introText = `This Operating Agreement governs the operations and management of ${companyFullName}, a Limited Liability Company organized under the laws of the State of ${llc.state}.`;
  const introLines = doc.splitTextToSize(introText, contentWidth - 20);
  doc.text(introLines, pageWidth / 2, yPos, { align: "center" });

  yPos += introLines.length * 5 + 25;

  // Effective Date Box
  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
  doc.roundedRect(margin + 30, yPos, contentWidth - 60, 35, 5, 5, "F");

  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("EFFECTIVE DATE", pageWidth / 2, yPos + 12, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(formatDate(formData.effectiveDate), pageWidth / 2, yPos + 26, { align: "center" });

  // Company Info Box
  yPos += 55;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + 20, yPos, contentWidth - 40, 50, 5, 5, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("STATE OF FORMATION", margin + 35, yPos + 15);
  doc.text("EIN", pageWidth / 2 + 20, yPos + 15);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(llc.state, margin + 35, yPos + 28);
  doc.text(llc.ein, pageWidth / 2 + 20, yPos + 28);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("FORMATION DATE", margin + 35, yPos + 40);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(formatDate(llc.llcCreatedDate), margin + 35, yPos + 48);

  addPageFooter();

  // ===== CONTENT PAGES =====
  doc.addPage();
  pageNumber++;
  addPageHeader();
  yPos = 22;

  const addSectionTitle = (num: number, title: string) => {
    yPos = checkNewPage(18);

    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(margin, yPos, 7, 7, 1.5, 1.5, "F");

    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(String(num), margin + 3.5, yPos + 5, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(title, margin + 11, yPos + 5.5);

    yPos += 12;
  };

  const addParagraph = (text: string, indent: boolean = false) => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);

    const xStart = indent ? margin + 6 : margin;
    const width = indent ? contentWidth - 6 : contentWidth;
    const lines = doc.splitTextToSize(text, width);

    yPos = checkNewPage(lines.length * 4.5 + 4);
    doc.text(lines, xStart, yPos);
    yPos += lines.length * 4.5 + 5;
  };

  const addLabelValue = (label: string, value: string) => {
    yPos = checkNewPage(10);

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(label, margin + 6, yPos);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(value, margin + 6 + doc.getTextWidth(label) + 2, yPos);

    yPos += 5;
  };

  // SECTION 1: FORMATION
  addSectionTitle(1, "FORMATION OF THE COMPANY");
  addParagraph(
    `${companyFullName} (the "Company") is a Limited Liability Company formed under the laws of the State of ${llc.state}. The Company was formed on ${formatDate(llc.llcCreatedDate)}.`,
    true
  );
  addLabelValue("EIN: ", llc.ein);
  addLabelValue("State of Formation: ", llc.state);

  // SECTION 2: NAME AND ADDRESS
  addSectionTitle(2, "NAME AND PRINCIPAL PLACE OF BUSINESS");
  addParagraph(
    `The name of the Company is ${companyFullName}. The principal place of business shall be located at such place as the Members may determine from time to time.`,
    true
  );

  // SECTION 3: PURPOSE
  addSectionTitle(3, "PURPOSE");
  addParagraph(
    "The purpose of the Company is to engage in any lawful business activity for which a Limited Liability Company may be organized under the laws of the State of " +
      llc.state +
      ", including but not limited to consulting services, digital services, e-commerce, and related activities.",
    true
  );

  // SECTION 4: MEMBERS
  addSectionTitle(4, "MEMBERS AND MEMBERSHIP INTERESTS");
  addParagraph("The initial Member(s) of the Company and their respective ownership interests are as follows:", true);
  yPos += 3;

  doc.setFillColor(lightGreen[0], lightGreen[1], lightGreen[2]);
  doc.roundedRect(margin + 6, yPos, contentWidth - 12, 32, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(llc.ownerFullName, margin + 14, yPos + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`${llc.ownerIdType}: ${llc.ownerIdNumber}`, margin + 14, yPos + 18);
  
  doc.setFont("helvetica", "bold");
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.text("Ownership: 100%", margin + 14, yPos + 26);

  yPos += 40;

  // SECTION 5: CAPITAL CONTRIBUTIONS
  addSectionTitle(5, "CAPITAL CONTRIBUTIONS");
  addParagraph(
    `The initial capital contribution to the Company is $${formData.capitalContribution} USD. Additional capital contributions may be made as agreed upon by the Members.`,
    true
  );

  // SECTION 6: MANAGEMENT
  addSectionTitle(6, "MANAGEMENT");
  addParagraph(
    "The Company shall be managed by its Members. Each Member shall have the authority to bind the Company in the ordinary course of business. Major decisions affecting the Company shall require the consent of Members holding a majority of the membership interests.",
    true
  );

  // SECTION 7: DISTRIBUTIONS
  addSectionTitle(7, "DISTRIBUTIONS");
  addParagraph(
    "Distributions of available cash or other assets shall be made to the Members in proportion to their respective membership interests, at such times and in such amounts as determined by the Members.",
    true
  );

  // SECTION 8: TAXATION
  addSectionTitle(8, "TAX ELECTIONS");
  addParagraph(
    "For U.S. federal income tax purposes, the Company shall be classified as a disregarded entity (if single-member) or partnership (if multi-member), unless the Members elect otherwise. As a non-resident owned LLC, the Company is subject to specific IRS reporting requirements.",
    true
  );

  // SECTION 9: RECORDS
  addSectionTitle(9, "BOOKS AND RECORDS");
  addParagraph(
    "The Company shall maintain complete and accurate books of account and records of all Company transactions at its principal place of business. All Members shall have the right to inspect and copy such records during normal business hours.",
    true
  );

  // SECTION 10: AMENDMENTS
  addSectionTitle(10, "AMENDMENTS");
  addParagraph(
    "This Operating Agreement may be amended only by a written instrument signed by all Members. Any amendment shall be effective as of the date specified therein or, if no date is specified, as of the date of execution.",
    true
  );

  // SECTION 11: DISSOLUTION
  addSectionTitle(11, "DISSOLUTION");
  addParagraph(
    "The Company shall be dissolved upon the occurrence of any of the following events: (a) the written consent of all Members; (b) the entry of a decree of judicial dissolution; or (c) any other event causing dissolution under applicable law.",
    true
  );

  // SECTION 12: GOVERNING LAW
  addSectionTitle(12, "GOVERNING LAW");
  addParagraph(
    `This Operating Agreement shall be governed by and construed in accordance with the laws of the State of ${llc.state}, without regard to its conflicts of law principles.`,
    true
  );

  // SIGNATURE PAGE
  doc.addPage();
  pageNumber++;
  addPageHeader();
  yPos = 35;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("SIGNATURES", pageWidth / 2, yPos, { align: "center" });

  yPos += 8;
  doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setLineWidth(2);
  doc.line(pageWidth / 2 - 30, yPos, pageWidth / 2 + 30, yPos);

  yPos += 18;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const witnessText = "IN WITNESS WHEREOF, the undersigned has executed this Operating Agreement as of the Effective Date stated above.";
  const witnessLines = doc.splitTextToSize(witnessText, contentWidth);
  doc.text(witnessLines, margin, yPos);

  yPos += 35;

  // Member Signature Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, yPos, contentWidth, 90, 5, 5, "F");

  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.roundedRect(margin, yPos, contentWidth, 12, 5, 5, "F");
  doc.rect(margin, yPos + 6, contentWidth, 6, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("MEMBER", margin + 10, yPos + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text(llc.ownerFullName, margin + 10, yPos + 28);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text(`${llc.ownerIdType}: ${llc.ownerIdNumber}`, margin + 10, yPos + 38);
  
  const addressLines = doc.splitTextToSize(`Address: ${formData.memberAddress}`, contentWidth - 20);
  doc.text(addressLines, margin + 10, yPos + 48);
  
  doc.text(`Phone: ${formData.memberPhone}`, margin + 10, yPos + 58 + (addressLines.length - 1) * 4);
  doc.text(`Email: ${llc.ownerEmail}`, margin + 10, yPos + 66 + (addressLines.length - 1) * 4);

  yPos += 105;

  // Signature Lines
  doc.setDrawColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, margin + 80, yPos);
  doc.line(pageWidth - margin - 60, yPos, pageWidth - margin, yPos);

  doc.setFontSize(8);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text("Signature", margin, yPos + 8);
  doc.text("Date", pageWidth - margin - 60, yPos + 8);

  addPageFooter();

  return Buffer.from(doc.output("arraybuffer"));
}

async function main() {
  console.log("=".repeat(60));
  console.log("OPERATING AGREEMENT GENERATOR - TEST");
  console.log("=".repeat(60));
  console.log();

  console.log("Test Data:");
  console.log("-".repeat(40));
  console.log(`Company Name: ${testLLC.companyName} ${testLLC.designator}`);
  console.log(`EIN: ${testLLC.ein}`);
  console.log(`State: ${testLLC.state}`);
  console.log(`Owner: ${testLLC.ownerFullName}`);
  console.log(`Email: ${testLLC.ownerEmail}`);
  console.log(`Phone: ${testLLC.ownerPhone}`);
  console.log(`ID: ${testLLC.ownerIdType} ${testLLC.ownerIdNumber}`);
  console.log(`Address: ${testFormData.memberAddress}`);
  console.log(`Capital Contribution: $${testFormData.capitalContribution} USD`);
  console.log(`Effective Date: ${formatDate(testFormData.effectiveDate)}`);
  console.log();

  console.log("Loading logo...");
  const logoBase64 = loadLogoBase64();
  if (logoBase64) {
    console.log("✓ Logo loaded successfully");
  } else {
    console.log("⚠ Using text fallback for logo");
  }
  console.log();

  console.log("Generating Operating Agreement PDF...");

  try {
    const pdfBuffer = generateOperatingAgreementPDF(testLLC, testFormData, logoBase64);

    const outputPath = path.join(__dirname, "operating-agreement-test.pdf");
    fs.writeFileSync(outputPath, pdfBuffer);

    console.log(`✓ PDF generated successfully!`);
    console.log(`  File: ${outputPath}`);
    console.log(`  Size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);
    console.log();

    console.log("=".repeat(60));
    console.log("TEST COMPLETED SUCCESSFULLY");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("✗ Error generating PDF:", error);
    process.exit(1);
  }
}

main();
