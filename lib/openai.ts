import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface LeaseAnalysis {
  partiesInvolved: string;
  leaseDuration: string;
  rentAndPaymentTerms: string;
  terminationClause: string;
  securityDeposit: string;
  risksAndRedFlags: string;
}

export async function analyzeLease(pdfText: string): Promise<LeaseAnalysis> {
  try {
    const prompt = `You're a legal assistant. Given the content of a lease agreement, extract and summarize the following information in a structured format:

Lease content:
${pdfText}

Please provide a JSON response with the following structure:
{
  "partiesInvolved": "Description of landlord and tenant",
  "leaseDuration": "Start date, end date, and renewal terms",
  "rentAndPaymentTerms": "Monthly rent amount, due date, late fees, and payment methods",
  "terminationClause": "Conditions for early termination, notice requirements",
  "securityDeposit": "Amount, conditions for return, deductions",
  "risksAndRedFlags": "Any concerning clauses, unusual terms, or potential issues"
}

Focus on extracting factual information and identifying any potential red flags or unusual terms.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant specializing in lease agreement analysis. Provide clear, structured responses in JSON format."
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

    // Try to parse the response as JSON
    try {
      return JSON.parse(response) as LeaseAnalysis;
    } catch (parseError) {
      // If JSON parsing fails, return a structured response
      return {
        partiesInvolved: "Unable to extract parties information",
        leaseDuration: "Unable to extract lease duration",
        rentAndPaymentTerms: "Unable to extract rent and payment terms",
        terminationClause: "Unable to extract termination clause",
        securityDeposit: "Unable to extract security deposit information",
        risksAndRedFlags: "Unable to analyze risks and red flags"
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to analyze lease with AI');
  }
} 