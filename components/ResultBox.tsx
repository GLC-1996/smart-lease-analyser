'use client';

import { LeaseAnalysis } from '@/lib/openai';

interface ResultBoxProps {
  analysis: LeaseAnalysis | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultBox({ analysis, isLoading, error }: ResultBoxProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-red-600 text-2xl mr-3">⚠️</div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const renderContent = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (Array.isArray(content)) {
      return content.join('\n• ');
    }
    if (typeof content === 'object') {
      return Object.entries(content)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    }
    return String(content);
  };

  const sections = [
    { title: 'Parties Involved', content: analysis.partiesInvolved, icon: '👥' },
    { 
      title: 'Lease Duration', 
      content: `Start Date: ${analysis.leaseDuration.startDate}\nEnd Date: ${analysis.leaseDuration.endDate}\nRenewal Terms: ${analysis.leaseDuration.renewalTerms}`, 
      icon: '📅' 
    },
    { 
      title: 'Rent & Payment Terms', 
      content: `Monthly Rent: ${analysis.rentAndPaymentTerms.monthlyRentAmount}\nDue Date: ${analysis.rentAndPaymentTerms.dueDate}\nLate Fees: ${analysis.rentAndPaymentTerms.lateFees}\nPayment Methods: ${analysis.rentAndPaymentTerms.paymentMethods}`, 
      icon: '💰' 
    },
    { 
      title: 'Termination Clause', 
      content: `Conditions: ${analysis.terminationClause.conditionsForEarlyTermination}\nNotice Requirements: ${analysis.terminationClause.noticeRequirements}`, 
      icon: '🚪' 
    },
    { 
      title: 'Security Deposit', 
      content: `Amount: ${analysis.securityDeposit.amount}\nReturn Conditions: ${analysis.securityDeposit.conditionsForReturn}\nDeductions: ${analysis.securityDeposit.deductions}`, 
      icon: '🔒' 
    },
    { 
      title: 'Risks & Red Flags', 
      content: `Concerning Clauses:\n• ${analysis.risksAndRedFlags.concerningClauses.join('\n• ')}\n\nUnusual Terms:\n• ${analysis.risksAndRedFlags.unusualTerms.join('\n• ')}\n\nPotential Issues:\n• ${analysis.risksAndRedFlags.potentialIssues.join('\n• ')}`, 
      icon: '⚠️' 
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lease Analysis Results</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{section.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 