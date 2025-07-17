'use client';

import { LeaseFullAnalysis } from '@/lib/openai';

interface ResultBoxProps {
  analysis: LeaseFullAnalysis | null;
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

  const factsSections = [
    { title: 'Parties Involved', content: analysis.facts.partiesInvolved, icon: '👥' },
    { 
      title: 'Rent & Payment Terms', 
      content: `Monthly Rent: ${analysis.facts.rentAndPaymentTerms.monthlyRentAmount}\nDue Date: ${analysis.facts.rentAndPaymentTerms.dueDate}\nPayment Methods: ${analysis.facts.rentAndPaymentTerms.paymentMethods}`, 
      icon: '💰' 
    },
    { 
      title: 'Security Deposit', 
      content: `Amount: ${analysis.facts.securityDeposit.amount}\nReturn Conditions: ${analysis.facts.securityDeposit.conditionsForReturn}`, 
      icon: '🔒' 
    },
  ];

  const adviceSections = [
    { 
      title: 'Missing Clauses', 
      content: analysis.advice.missingClauses.length > 0 ? `• ${analysis.advice.missingClauses.join('\n• ')}` : 'No missing clauses identified', 
      icon: '📝' 
    },
    { 
      title: 'Risky Clauses', 
      content: analysis.advice.riskyClauses.length > 0 ? `• ${analysis.advice.riskyClauses.join('\n• ')}` : 'No risky clauses identified', 
      icon: '⚠️' 
    },
    { 
      title: 'Suggested Clauses', 
      content: analysis.advice.suggestedClauses.length > 0 
        ? analysis.advice.suggestedClauses.map(clause => `${clause.title}:\n${clause.draft}`).join('\n\n')
        : 'No suggested clauses', 
      icon: '💡' 
    },
    { 
      title: 'Legal References', 
      content: analysis.advice.legalReferences.length > 0 ? `• ${analysis.advice.legalReferences.join('\n• ')}` : 'No legal references provided', 
      icon: '⚖️' 
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lease Analysis Results</h2>
        
        {/* Facts Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Key Facts</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {factsSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">{section.icon}</span>
                  <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Advice Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💼 Legal Advice</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {adviceSections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">{section.icon}</span>
                  <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                </div>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 