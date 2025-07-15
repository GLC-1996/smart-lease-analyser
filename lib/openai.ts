import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LeaseAnalysis {
  partiesInvolved: string;
  leaseDuration: {
    startDate: string;
    endDate: string;
    renewalTerms: string;
  };
  rentAndPaymentTerms: {
    monthlyRentAmount: string;
    dueDate: string;
    lateFees: string;
    paymentMethods: string;
  };
  terminationClause: {
    conditionsForEarlyTermination: string;
    noticeRequirements: string;
  };
  securityDeposit: {
    amount: string;
    conditionsForReturn: string;
    deductions: string;
  };
  risksAndRedFlags: {
    concerningClauses: string[];
    unusualTerms: string[];
    potentialIssues: string[];
  };
}

export async function analyzeLease(pdfText: string): Promise<LeaseAnalysis> {
  try {
    const prompt = `You're a legal assistant. Given the content of a lease agreement, extract and summarize the following information in a structured format:

Lease content:
${pdfText}

Please provide a JSON response with the following structure:
{
  "partiesInvolved": "Description of landlord and tenant",
  "leaseDuration": {
    "startDate": "Lease start date",
    "endDate": "Lease end date", 
    "renewalTerms": "Renewal terms and conditions"
  },
  "rentAndPaymentTerms": {
    "monthlyRentAmount": "Monthly rent amount",
    "dueDate": "When rent is due",
    "lateFees": "Late payment fees",
    "paymentMethods": "Accepted payment methods"
  },
  "terminationClause": {
    "conditionsForEarlyTermination": "Conditions for early termination",
    "noticeRequirements": "Notice period requirements"
  },
  "securityDeposit": {
    "amount": "Security deposit amount",
    "conditionsForReturn": "Conditions for returning deposit",
    "deductions": "What can be deducted from deposit"
  },
  "risksAndRedFlags": {
    "concerningClauses": ["List of concerning clauses"],
    "unusualTerms": ["List of unusual terms"],
    "potentialIssues": ["List of potential issues"]
  }
}

Focus on extracting factual information and identifying any potential red flags or unusual terms.

Only respond with the JSON object. Do not include any explanation or extra text.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant specializing in lease agreement analysis. Only respond with the JSON object. Do not include any explanation or extra text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }
    console.log("raw output", response);

    // Try to parse the response as JSON
    try {
      const jsonStart = response.indexOf("{");
      const jsonEnd = response.lastIndexOf("}");
      const jsonString = response.substring(jsonStart, jsonEnd + 1);
    
      return JSON.parse(jsonString) as LeaseAnalysis;
    } catch (parseError) {
      console.warn("Failed to parse JSON from response:", response);
      return {
        partiesInvolved: "Unable to extract parties information",
        leaseDuration: {
          startDate: "Unable to extract start date",
          endDate: "Unable to extract end date",
          renewalTerms: "Unable to extract renewal terms"
        },
        rentAndPaymentTerms: {
          monthlyRentAmount: "Unable to extract rent amount",
          dueDate: "Unable to extract due date",
          lateFees: "Unable to extract late fees",
          paymentMethods: "Unable to extract payment methods"
        },
        terminationClause: {
          conditionsForEarlyTermination: "Unable to extract termination conditions",
          noticeRequirements: "Unable to extract notice requirements"
        },
        securityDeposit: {
          amount: "Unable to extract deposit amount",
          conditionsForReturn: "Unable to extract return conditions",
          deductions: "Unable to extract deduction terms"
        },
        risksAndRedFlags: {
          concerningClauses: ["Unable to analyze concerning clauses"],
          unusualTerms: ["Unable to analyze unusual terms"],
          potentialIssues: ["Unable to analyze potential issues"]
        }
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to analyze lease with AI');
  }
} 