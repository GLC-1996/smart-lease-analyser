import OpenAI from 'openai';
import { LeaseAnalysisResponse } from '../types/lease';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeLease(prompt: string): Promise<LeaseAnalysisResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant specializing in lease agreement analysis. Always reply with ONLY the valid JSON object. Do not include any explanation or extra commentary.",
        },
        {
          role: "user",
          content: prompt,
        }
      ],
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

function parseOpenAIResponse(response: string): LeaseAnalysisResponse {
  try {
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}");
    const jsonString = response.substring(jsonStart, jsonEnd + 1);
    
    return JSON.parse(jsonString) as LeaseAnalysisResponse;
  } catch (parseError) {
    console.warn("Failed to parse JSON from response:", response);
    return createFallbackAnalysis();
  }
}

function createFallbackAnalysis(): LeaseAnalysisResponse {
  return {
    clauses: [
      {
        title: "Unable to analyze clauses",
        text: "Analysis failed",
        riskLevel: "medium",
        suggestions: ["Unable to provide suggestions"],
        legalBasis: "Unable to determine legal basis"
      }
    ],
    missingClauses: [
      {
        title: "Unable to identify missing clauses",
        draft: "Unable to draft clause text",
        legalBasis: "Unable to determine legal basis",
        reasoning: "Analysis failed"
      }
    ],
    metadata: {
      partiesInvolved: "Unable to extract parties information",
      rentAndPaymentTerms: {
        monthlyRentAmount: "Unable to extract rent amount",
        dueDate: "Unable to extract due date",
        paymentMethods: "Unable to extract payment methods"
      },
      securityDeposit: {
        amount: "Unable to extract deposit amount",
        conditionsForReturn: "Unable to extract return conditions"
      },
      leaseDuration: {
        startDate: "Unable to extract start date",
        endDate: "Unable to extract end date",
        renewalTerms: "Unable to extract renewal terms"
      }
    }
  };
} 