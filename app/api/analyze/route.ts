import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/pdfParser';
import { analyzeLease } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileUrl } = body;
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'No file URL provided' },
        { status: 400 }
      );
    }

    // Fetch the PDF file from the UploadThing URL
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch PDF file' },
        { status: 400 }
      );
    }

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const pdfText = await extractTextFromPDF(buffer);

    if (!pdfText || pdfText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    // Analyze the lease with OpenAI
    const analysis = await analyzeLease(pdfText);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze lease agreement' },
      { status: 500 }
    );
  }
} 