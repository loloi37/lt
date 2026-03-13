// lib/certificate/generator.ts - Certificate of Digital Permanence
// Generates a PDF certificate using pdf-lib confirming that a memorial
// has been permanently preserved on the Arweave blockchain.
//
// TODO: Install dependency: npm install pdf-lib

interface CertificateData {
  deceasedName: string;
  preservedDate: string;
  arweaveTxId: string;
  ownerName: string;
  memorialId: string;
}

/**
 * Generate a "Certificate of Digital Permanence" PDF.
 * This serves as a luxury receipt and proof of permanent preservation.
 *
 * TODO: Replace placeholder with actual pdf-lib implementation when dependency is installed.
 */
export async function generateCertificate(data: CertificateData): Promise<Uint8Array> {
  // TODO: Uncomment when pdf-lib is installed:
  // const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  //
  // const pdfDoc = await PDFDocument.create();
  // const page = pdfDoc.addPage([612, 792]); // Letter size
  //
  // const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  // const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
  // const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  //
  // const charcoal = rgb(0.35, 0.42, 0.47); // #5a6b78
  // const terracotta = rgb(0.83, 0.58, 0.54); // #d4958a
  // const ivory = rgb(0.99, 0.96, 0.94); // #fdf6f0
  //
  // // Background
  // page.drawRectangle({
  //   x: 0, y: 0,
  //   width: 612, height: 792,
  //   color: ivory,
  // });
  //
  // // Decorative border
  // page.drawRectangle({
  //   x: 30, y: 30,
  //   width: 552, height: 732,
  //   borderColor: charcoal,
  //   borderWidth: 2,
  // });
  //
  // page.drawRectangle({
  //   x: 36, y: 36,
  //   width: 540, height: 720,
  //   borderColor: terracotta,
  //   borderWidth: 0.5,
  // });
  //
  // // Title
  // const title = 'Certificate of Digital Permanence';
  // const titleWidth = timesBold.widthOfTextAtSize(title, 24);
  // page.drawText(title, {
  //   x: (612 - titleWidth) / 2,
  //   y: 680,
  //   size: 24,
  //   font: timesBold,
  //   color: charcoal,
  // });
  //
  // // Decorative line
  // page.drawLine({
  //   start: { x: 150, y: 665 },
  //   end: { x: 462, y: 665 },
  //   thickness: 1,
  //   color: terracotta,
  // });
  //
  // // Certificate body
  // const bodyY = 610;
  // const lineHeight = 28;
  //
  // page.drawText('This document certifies that the memorial archive of', {
  //   x: 100, y: bodyY, size: 14, font: timesRoman, color: charcoal,
  // });
  //
  // const nameWidth = timesBold.widthOfTextAtSize(data.deceasedName, 22);
  // page.drawText(data.deceasedName, {
  //   x: (612 - nameWidth) / 2,
  //   y: bodyY - lineHeight * 2,
  //   size: 22,
  //   font: timesBold,
  //   color: charcoal,
  // });
  //
  // page.drawText('has been permanently preserved on the Arweave blockchain', {
  //   x: 100, y: bodyY - lineHeight * 4, size: 14, font: timesRoman, color: charcoal,
  // });
  //
  // page.drawText('and will persist for a minimum of 200 years.', {
  //   x: 100, y: bodyY - lineHeight * 5, size: 14, font: timesRoman, color: charcoal,
  // });
  //
  // // Transaction details
  // const detailsY = bodyY - lineHeight * 8;
  // page.drawText('Preservation Details', {
  //   x: 100, y: detailsY, size: 16, font: timesBold, color: charcoal,
  // });
  //
  // page.drawText(`Date of Preservation: ${data.preservedDate}`, {
  //   x: 100, y: detailsY - lineHeight, size: 12, font: timesRoman, color: charcoal,
  // });
  //
  // page.drawText(`Transaction ID: ${data.arweaveTxId}`, {
  //   x: 100, y: detailsY - lineHeight * 2, size: 10, font: timesRoman, color: charcoal,
  // });
  //
  // page.drawText(`Verified by: Legacy Vault`, {
  //   x: 100, y: detailsY - lineHeight * 3, size: 12, font: timesRoman, color: charcoal,
  // });
  //
  // // Footer
  // page.drawText('This archive is immutable and cannot be altered or deleted.', {
  //   x: 100, y: 120, size: 11, font: timesItalic, color: terracotta,
  // });
  //
  // page.drawText(`Verification: https://arweave.net/${data.arweaveTxId}`, {
  //   x: 100, y: 80, size: 9, font: timesRoman, color: charcoal,
  // });
  //
  // return await pdfDoc.save();

  // Placeholder: return a minimal PDF-like buffer
  throw new Error('pdf-lib not installed. Run: npm install pdf-lib');
}

/**
 * Format a date for display on the certificate.
 */
export function formatCertificateDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
