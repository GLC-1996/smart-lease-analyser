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