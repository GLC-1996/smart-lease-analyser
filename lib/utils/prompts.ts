import { LegalSchema } from '../types/lease';

// Import schemas statically
import indianSchema from '../../schemas/in/national.json';
import usSchema from '../../schemas/us/national.json';
import auSchema from '../../schemas/au/national.json';

const schemas: Record<string, LegalSchema> = {
  'in': indianSchema as LegalSchema,
  'us': usSchema as LegalSchema,
  'au': auSchema as LegalSchema,
};

// ============================================================================
// MAIN LOGIC: Primary prompt generation with jurisdiction-aware analysis
// ============================================================================
export async function createLeaseAnalysisPrompt(
  leaseText: string,
  countryCode: string,
  stateCode?: string
): Promise<string> {
  try {
    // Load the appropriate schema
    const schema = loadLegalSchema(countryCode, stateCode);
    
    // Build the required clauses section
    const requiredClausesSection = schema.requiredClauses
      .map(clause => {
        return `- Title: ${clause.title}
  Legal Basis: ${clause.legalBasis}
  Risk Indicators: ${clause.riskIndicators.join(", ")}
  Drafting Guidelines: ${clause.draftingHints}`;
      })
      .join('\n\n');

    // Compose the dynamic prompt
    const prompt = `You are a legal assistant trained in ${schema.lawSummary}.

Evaluate the following lease text against these required clauses:

Required Clauses:
${requiredClausesSection}

Lease Content:
${leaseText}

Analyze each required clause and provide:
1. Whether the clause exists in the lease
2. The actual text if found
3. Risk level (low/medium/high) based on compliance with legal requirements
4. Specific suggestions for improvement
5. Missing clauses that should be added
6. For existing clauses with medium or high risk levels, provide an improved draft version

Respond in JSON format:
{
  "clauses": [
    {
      "title": "Clause title",
      "text": "Actual clause text from lease",
      "riskLevel": "low|medium|high",
      "suggestions": ["suggestion1", "suggestion2"],
      "legalBasis": "Legal basis for this clause",
      "draft": "AI-generated improved version of the clause (only if risk level is medium or high)"
    }
  ],
  "missingClauses": [
    {
      "title": "Missing clause title",
      "draft": "AI-generated draft text for the missing clause",
      "legalBasis": "Legal basis for requiring this clause",
      "reasoning": "Why this clause is important"
    }
  ],
  "metadata": {
    "partiesInvolved": "Description of landlord and tenant",
    "rentAndPaymentTerms": {
      "monthlyRentAmount": "Monthly rent amount",
      "dueDate": "When rent is due",
      "paymentMethods": "Accepted payment methods"
    },
    "securityDeposit": {
      "amount": "Security deposit amount",
      "conditionsForReturn": "Conditions for returning deposit"
    },
    "leaseDuration": {
      "startDate": "Lease start date",
      "endDate": "Lease end date",
      "renewalTerms": "Renewal terms and conditions"
    }
  }
}`;

    return prompt;
  } catch (error) {
    console.error('Error creating lease analysis prompt:', error);
    // FALLBACK: Use generic prompt if schema loading fails
    return createGenericPrompt(leaseText);
  }
}

// ============================================================================
// MAIN LOGIC: Schema loading with jurisdiction support
// ============================================================================
function loadLegalSchema(countryCode: string, stateCode?: string): LegalSchema {
  try {
    // For now, we only have national schemas
    // In the future, we can add state-specific schemas
    const schema = schemas[countryCode];
    
    if (!schema) {
      console.warn(`No schema found for ${countryCode}, using default`);
      // FALLBACK: Return default schema if country not found
      return getDefaultSchema();
    }
    
    return schema;
  } catch (error) {
    console.error(`Failed to load schema for ${countryCode}, using default`);
    // FALLBACK: Return default schema if loading fails
    return getDefaultSchema();
  }
}

// ============================================================================
// FALLBACK LOGIC: Default schema when jurisdiction-specific schema is unavailable
// ============================================================================
function getDefaultSchema(): LegalSchema {
  return {
    lawSummary: "General contract law principles apply to lease agreements. Key considerations include fairness, clarity, and compliance with local regulations.",
    requiredClauses: [
      {
        title: "Termination Clause",
        legalBasis: "Contract Law Principle",
        riskIndicators: ["unilateral termination", "no notice period"],
        draftingHints: "Both parties should be allowed to terminate with reasonable notice."
      },
      {
        title: "Security Deposit",
        legalBasis: "Contract Law Principle",
        riskIndicators: ["excessive deposit", "no return timeline"],
        draftingHints: "Deposit should be reasonable with clear return conditions."
      }
    ]
  };
}

// ============================================================================
// FALLBACK LOGIC: Generic prompt when jurisdiction-aware prompt fails
// ============================================================================
function createGenericPrompt(leaseText: string): string {
  return `You are a legal assistant specializing in lease agreement analysis.

Analyze the following lease agreement and provide a comprehensive review:

Lease Content:
${leaseText}

Please provide a JSON response with the following structure:
{
  "clauses": [
    {
      "title": "Clause title",
      "text": "Actual clause text",
      "riskLevel": "low|medium|high",
      "suggestions": ["suggestion1", "suggestion2"],
      "legalBasis": "Legal basis",
      "draft": "AI-generated improved version of the clause (only if risk level is medium or high)"
    }
  ],
  "missingClauses": [
    {
      "title": "Missing clause title",
      "draft": "Suggested clause text",
      "legalBasis": "Legal basis",
      "reasoning": "Why this clause is important"
    }
  ],
  "metadata": {
    "partiesInvolved": "Description of parties",
    "rentAndPaymentTerms": {
      "monthlyRentAmount": "Rent amount",
      "dueDate": "Due date",
      "paymentMethods": "Payment methods"
    },
    "securityDeposit": {
      "amount": "Deposit amount",
      "conditionsForReturn": "Return conditions"
    },
    "leaseDuration": {
      "startDate": "Start date",
      "endDate": "End date",
      "renewalTerms": "Renewal terms"
    }
  }
}`;
}

// ============================================================================
// FALLBACK LOGIC: Legacy functions for backward compatibility
// ============================================================================
export function createFallbackAnalysis() {
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

// ============================================================================
// FALLBACK LOGIC: JSON parsing with error handling
// ============================================================================
export function parseOpenAIResponse(response: string) {
  try {
    const jsonStart = response.indexOf("{");
    const jsonEnd = response.lastIndexOf("}");
    const jsonString = response.substring(jsonStart, jsonEnd + 1);
    
    return JSON.parse(jsonString);
  } catch (parseError) {
    console.warn("Failed to parse JSON from response:", response);
    // FALLBACK: Return fallback analysis if JSON parsing fails
    return createFallbackAnalysis();
  }
}