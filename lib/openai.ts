import OpenAI from 'openai';
import { LeaseFullAnalysis } from './types/lease';
import { createLeaseAnalysisPrompt, parseOpenAIResponse } from './utils/prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type { LeaseFullAnalysis };

export async function analyzeLease(pdfText: string): Promise<LeaseFullAnalysis> {
  try {
    const messages = createLeaseAnalysisPrompt(pdfText);

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }
    
    console.log("raw output", response);
    return parseOpenAIResponse(response);
    
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to analyze lease with AI');
  }
} 