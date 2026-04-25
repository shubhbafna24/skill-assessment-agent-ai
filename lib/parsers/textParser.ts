export async function extractTextFromTxt(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8');
}
