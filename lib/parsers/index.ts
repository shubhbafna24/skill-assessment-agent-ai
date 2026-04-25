import { extractTextFromPDF } from './pdfParser';
import { extractTextFromDocx } from './docxParser';
import { extractTextFromTxt } from './textParser';

export async function parseDocument(file: File): Promise<string> {
  const fileType = file.type;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let rawText = '';

  if (fileType === 'application/pdf') {
    rawText = await extractTextFromPDF(buffer);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    rawText = await extractTextFromDocx(buffer);
  } else if (fileType === 'text/plain') {
    rawText = await extractTextFromTxt(buffer);
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  }

  return normalizeText(rawText);
}

function normalizeText(text: string): string {
  // Remove excessive whitespace, non-printable characters
  return text.replace(/\s+/g, ' ').replace(/[^\x20-\x7E]/g, '').trim();
}