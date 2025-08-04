// ============================================================================
// FALLBACK LOGIC: Legacy types for backward compatibility
// ============================================================================
export interface LeaseFullAnalysis {
  facts: {
    partiesInvolved: string;
    rentAndPaymentTerms: {
      monthlyRentAmount: string;
      dueDate: string;
      paymentMethods: string;
    };
    securityDeposit: {
      amount: string;
      conditionsForReturn: string;
    };
  };
  advice: {
    missingClauses: string[];
    riskyClauses: string[];
    suggestedClauses: { title: string; draft: string }[];
    legalReferences: string[]; // Optional – acts/judgments if you want
  };
}

// ============================================================================
// MAIN LOGIC: New jurisdiction-aware types for enhanced analysis
// ============================================================================
export interface ClauseWithAdvice {
  title: string;
  text: string;
  riskLevel: 'low' | 'medium' | 'high';
  suggestions: string[];
  legalBasis: string;
  draft?: string; // Suggested improved version of the clause
}

export interface SuggestedClause {
  title: string;
  draft: string;
  legalBasis: string;
  reasoning: string;
}

export interface LeaseMetadata {
  partiesInvolved: string;
  rentAndPaymentTerms: {
    monthlyRentAmount: string;
    dueDate: string;
    paymentMethods: string;
  };
  securityDeposit: {
    amount: string;
    conditionsForReturn: string;
  };
  leaseDuration: {
    startDate: string;
    endDate: string;
    renewalTerms: string;
  };
}

export interface LeaseAnalysisResponse {
  clauses: ClauseWithAdvice[];
  missingClauses: SuggestedClause[];
  metadata: LeaseMetadata;
}

// ============================================================================
// MAIN LOGIC: Schema types for jurisdiction-specific legal requirements
// ============================================================================
export interface RequiredClause {
  title: string;
  legalBasis: string;
  riskIndicators: string[];
  draftingHints: string;
}

export interface LegalSchema {
  lawSummary: string;
  requiredClauses: RequiredClause[];
} 