import OpenAI from 'openai';
import { LeaseFullAnalysis } from '../types/lease';

export function createLeaseAnalysisPrompt(pdfText: string): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  return [
    {
      role: "system",
      content: `You are a legal assistant specializing in lease agreement analysis. Always reply with ONLY the valid JSON object. Do not include any explanation or extra commentary.`,
    },
    {
      role: "user",
      content: `Given the content of a lease agreement, extract factual information and provide legal advice in JSON format.`,
    },
    {
      role: "user",
      content: `Here is the required JSON schema (use this format in your response):

{
  "facts": {
    "partiesInvolved": "Description of landlord and tenant",
    "rentAndPaymentTerms": {
      "monthlyRentAmount": "Monthly rent amount",
      "dueDate": "When rent is due",
      "paymentMethods": "Accepted payment methods"
    },
    "securityDeposit": {
      "amount": "Security deposit amount",
      "conditionsForReturn": "Conditions for returning deposit"
    }
  },
  "advice": {
    "missingClauses": ["List of important clauses that are missing"],
    "riskyClauses": ["List of clauses that pose legal risks"],
    "suggestedClauses": [
      {
        "title": "Clause title",
        "draft": "Suggested clause text"
      }
    ],
    "legalReferences": ["Relevant legal acts, judgments, or references"]
  }
}`,
    },
    {
      role: "user",
      content: `Lease content:\n${pdfText}`,
    }
  ];
}

export function createFallbackAnalysis(): LeaseFullAnalysis {
  return {
    facts: {
      partiesInvolved: "Unable to extract parties information",
      rentAndPaymentTerms: {
        monthlyRentAmount: "Unable to extract rent amount",
        dueDate: "Unable to extract due date",
        paymentMethods: "Unable to extract payment methods"
      },
      securityDeposit: {
        amount: "Unable to extract deposit amount",
        conditionsForReturn: "Unable to extract return conditions"
      }
    },
    advice: {
      missingClauses: ["Unable to analyze missing clauses"],
      riskyClauses: ["Unable to analyze risky clauses"],
      suggestedClauses: [
        {
          title: "Unable to suggest clauses",
          draft: "Unable to draft clause text"
        }
      ],
      legalReferences: ["Unable to provide legal references"]
    }
  };
}

export function parseOpenAIResponse(response: string): LeaseFullAnalysis {
  try {
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}");
    const jsonString = response.substring(jsonStart, jsonEnd + 1);
    
    return JSON.parse(jsonString) as LeaseFullAnalysis;
  } catch (parseError) {
    console.warn("Failed to parse JSON from response:", response);
    return createFallbackAnalysis();
  }
} 