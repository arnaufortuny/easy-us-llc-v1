import { generateCustomInvoicePdf } from "../server/lib/pdf-generator";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("=".repeat(60));
  console.log("CUSTOM INVOICE - TEST PDF (B&W PROFESSIONAL)");
  console.log("=".repeat(60));

  const pdfBuffer = await generateCustomInvoicePdf({
    invoiceNumber: "CUSTOM-2026-015",
    date: new Date("2026-02-07").toISOString(),
    customer: {
      name: "María López García",
      email: "maria.lopez@email.com",
      phone: "+34 622 987 654",
    },
    concept: "Annual Maintenance - DIGITAL VENTURES LLC",
    description: "Annual registered agent renewal, compliance filing, and annual report for the State of New Mexico for fiscal year 2026.",
    amount: 29900,
    currency: "EUR",
    status: "pending",
    notes: "Payment is due within 30 days of invoice date. Please include invoice number as reference.",
  });

  const outputPath = path.join(__dirname, "custom-invoice-test.pdf");
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log("PDF generado:", outputPath);
  const stats = fs.statSync(outputPath);
  console.log("Tamaño:", (stats.size / 1024).toFixed(1), "KB");
  console.log("=".repeat(60));
}
main();
