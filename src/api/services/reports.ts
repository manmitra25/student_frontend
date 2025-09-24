export async function downloadCounselorPdf(params?: {
  counselor_id?: string;
  start_date?: string; // ISO string
  end_date?: string;   // ISO string
}) {
  const base = (import.meta as any).env?.VITE_BESTIE_API_URL || 'http://localhost:8000';
  const url = `${base.replace(/\/$/, '')}/api/counselor/analytics/pdf`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params || {}),
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to generate PDF (${res.status})`);
  }
  const { filename, pdf_base64 } = await res.json();

  // Convert base64 to Blob
  const byteChars = atob(pdf_base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  // Trigger download
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename || 'counselor_report.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}
