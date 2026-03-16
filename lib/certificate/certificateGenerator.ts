// lib/certificate/certificateGenerator.ts
// Client-side Certificate of Permanence PDF generator

export interface CertificateData {
  fullName: string;
  birthDate: string;
  deathDate: string | null;
  preservationDate: string;
  transactionId: string;
  nodeCount: number;
  endowmentYears: number;
  gatewayUrls: string[];
  memorialId: string;
  planType: string;
}

export function generateCertificateCanvas(data: CertificateData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2480;  // A4 at 300 DPI
  canvas.height = 3508;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = '#111318';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 4;
  ctx.strokeRect(80, 80, canvas.width - 160, canvas.height - 160);

  // Inner border
  ctx.strokeStyle = '#2a2d35';
  ctx.lineWidth = 1;
  ctx.strokeRect(120, 120, canvas.width - 240, canvas.height - 240);

  // Title
  ctx.fillStyle = '#c9a84c';
  ctx.font = '700 72px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICATE OF PERMANENCE', canvas.width / 2, 350);

  // Divider
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 300, 420);
  ctx.lineTo(canvas.width / 2 + 300, 420);
  ctx.stroke();

  // "This certifies that..."
  ctx.fillStyle = '#c8ccd4';
  ctx.font = '300 36px Georgia, serif';
  ctx.fillText('This certifies that the memorial of', canvas.width / 2, 560);

  // Name
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 64px Georgia, serif';
  ctx.fillText(data.fullName, canvas.width / 2, 680);

  // Dates
  const dateRange = data.deathDate
    ? `${data.birthDate} — ${data.deathDate}`
    : `Born ${data.birthDate}`;
  ctx.fillStyle = '#6b7280';
  ctx.font = '400 32px Georgia, serif';
  ctx.fillText(dateRange, canvas.width / 2, 760);

  // Preservation info
  ctx.fillStyle = '#c8ccd4';
  ctx.font = '300 32px Georgia, serif';
  ctx.fillText('has been permanently preserved on the Arweave network', canvas.width / 2, 920);
  ctx.fillText(`on ${new Date(data.preservationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, canvas.width / 2, 980);

  // Transaction ID
  ctx.fillStyle = '#c9a84c';
  ctx.font = '400 28px monospace';
  ctx.fillText(`Transaction ID: ${data.transactionId}`, canvas.width / 2, 1120);

  // Stats
  const stats = [
    `Replicated across ${data.nodeCount} nodes worldwide`,
    `Endowment period: ${data.endowmentYears}+ years`,
    `Accessible via ${data.gatewayUrls.length} independent gateways`,
  ];
  ctx.fillStyle = '#6b7280';
  ctx.font = '300 28px Georgia, serif';
  stats.forEach((stat, i) => {
    ctx.fillText(stat, canvas.width / 2, 1280 + i * 60);
  });

  // Verification section
  ctx.fillStyle = '#2a2d35';
  ctx.fillRect(300, 1580, canvas.width - 600, 200);
  ctx.fillStyle = '#c8ccd4';
  ctx.font = '300 24px Georgia, serif';
  ctx.fillText('Verify this certificate:', canvas.width / 2, 1650);
  ctx.fillStyle = '#c9a84c';
  ctx.font = '400 22px monospace';
  ctx.fillText(`https://viewblock.io/arweave/tx/${data.transactionId}`, canvas.width / 2, 1720);

  // Footer
  ctx.fillStyle = '#3a3d45';
  ctx.font = '300 22px Georgia, serif';
  ctx.fillText('Legacy Vault — Permanent Digital Preservation', canvas.width / 2, canvas.height - 250);
  ctx.font = '300 18px Georgia, serif';
  ctx.fillStyle = '#4a4d55';
  ctx.fillText(`Memorial ID: ${data.memorialId}`, canvas.width / 2, canvas.height - 200);

  return canvas;
}

export function downloadCertificate(data: CertificateData): void {
  const canvas = generateCertificateCanvas(data);
  const link = document.createElement('a');
  link.download = `certificate-of-permanence-${data.fullName.toLowerCase().replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
