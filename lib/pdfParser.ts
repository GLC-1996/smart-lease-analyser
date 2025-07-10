export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Import directly from the specific file to avoid test file issues
    const pdf = (await import('pdf-parse/lib/pdf-parse.js')).default as any;
    const data = await pdf(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
} 