import { LeaseFullAnalysis, LeaseAnalysisResponse } from './types/lease';
import { analyzeLease as coreAnalyzeLease } from './core/analyzeLease';
import { createLeaseAnalysisPrompt } from './utils/prompts';

// Export types for backward compatibility
export type { LeaseFullAnalysis, LeaseAnalysisResponse };

// ============================================================================
// FALLBACK LOGIC: Legacy function for backward compatibility
// ============================================================================
export async function analyzeLease(pdfText: string): Promise<LeaseFullAnalysis> {
  try {
    // Use default jurisdiction (India) for backward compatibility
    const prompt = await createLeaseAnalysisPrompt(pdfText, 'in');
    const response = await coreAnalyzeLease(prompt);
    
    // Convert new response format to legacy format
    return convertToLegacyFormat(response);
  } catch (error) {
    console.error('Error in legacy analyzeLease:', error);
    throw new Error('Failed to analyze lease with AI');
  }
}

// ============================================================================
// MAIN LOGIC: New jurisdiction-aware function
// ============================================================================
export async function analyzeLeaseWithJurisdiction(
  pdfText: string,
  countryCode: string,
  stateCode?: string
): Promise<LeaseAnalysisResponse> {
  try {
    const prompt = await createLeaseAnalysisPrompt(pdfText, countryCode, stateCode);
    return await coreAnalyzeLease(prompt);
  } catch (error) {
    console.error('Error in jurisdiction-aware analyzeLease:', error);
    throw new Error('Failed to analyze lease with AI');
  }
}

// ============================================================================
// FALLBACK LOGIC: Helper function to convert new format to legacy format
// ============================================================================
function convertToLegacyFormat(response: LeaseAnalysisResponse): LeaseFullAnalysis {
  return {
    facts: {
      partiesInvolved: response.metadata.partiesInvolved,
      rentAndPaymentTerms: response.metadata.rentAndPaymentTerms,
      securityDeposit: response.metadata.securityDeposit
    },
    advice: {
      missingClauses: response.missingClauses.map(clause => clause.title),
      riskyClauses: response.clauses
        .filter(clause => clause.riskLevel === 'high' || clause.riskLevel === 'medium')
        .map(clause => clause.title),
      suggestedClauses: response.missingClauses.map(clause => ({
        title: clause.title,
        draft: clause.draft
      })),
      legalReferences: response.clauses.map(clause => clause.legalBasis)
    }
  };
} 