'use client';

import { useState } from 'react';
import { LeaseAnalysisResponse } from '@/lib/openai';
import Accordion from './Accordion';
import Modal from './Modal';

interface ResultBoxProps {
  analysis: LeaseAnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultBox({ analysis, isLoading, error }: ResultBoxProps) {
  const [selectedClause, setSelectedClause] = useState<{ title: string; draft: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8">
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
      <div className="w-full max-w-6xl mx-auto mt-8">
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

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  };

  const handleClauseClick = (clause: { title: string; draft: string }) => {
    setSelectedClause(clause);
    setIsModalOpen(true);
  };

  const metadataSections = [
    { title: 'Parties Involved', content: analysis.metadata.partiesInvolved, icon: '👥' },
    { 
      title: 'Rent & Payment Terms', 
      content: `Monthly Rent: ${analysis.metadata.rentAndPaymentTerms.monthlyRentAmount}\nDue Date: ${analysis.metadata.rentAndPaymentTerms.dueDate}\nPayment Methods: ${analysis.metadata.rentAndPaymentTerms.paymentMethods}`, 
      icon: '💰' 
    },
    { 
      title: 'Security Deposit', 
      content: `Amount: ${analysis.metadata.securityDeposit.amount}\nReturn Conditions: ${analysis.metadata.securityDeposit.conditionsForReturn}`, 
      icon: '🔒' 
    },
    { 
      title: 'Lease Duration', 
      content: `Start Date: ${analysis.metadata.leaseDuration.startDate}\nEnd Date: ${analysis.metadata.leaseDuration.endDate}\nRenewal Terms: ${analysis.metadata.leaseDuration.renewalTerms}`, 
      icon: '📅' 
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lease Analysis Results</h2>
        
        {/* Metadata Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📋 Key Facts</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {metadataSections.map((section, index) => (
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

        {/* Clauses Analysis Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">📄 Clause Analysis</h3>
          <div className="space-y-4">
            {analysis.clauses.map((clause, index) => (
              <Accordion
                key={index}
                title={clause.title}
                icon={getRiskLevelIcon(clause.riskLevel)}
                badge={{
                  text: `${clause.riskLevel.toUpperCase()} RISK`,
                  color: getRiskLevelColor(clause.riskLevel)
                }}
                defaultOpen={clause.riskLevel === 'high'}
              >
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Clause Text:</h5>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{clause.text}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Legal Basis:</h5>
                    <p className="text-gray-600 text-sm">{clause.legalBasis}</p>
                  </div>
                  {clause.suggestions.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Suggestions:</h5>
                      <ul className="text-gray-600 text-sm space-y-1">
                        {clause.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Missing Clauses Section */}
        {analysis.missingClauses.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">📝 Missing Clauses</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.missingClauses.map((clause, index) => (
                <div key={index} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{clause.title}</h4>
                    <button
                      onClick={() => handleClauseClick(clause)}
                      className="text-2xl hover:scale-110 transition-transform"
                      title="View suggested draft"
                    >
                      ✨
                    </button>
                  </div>
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Legal Basis:</h5>
                    <p className="text-gray-600 text-sm">{clause.legalBasis}</p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Reasoning:</h5>
                    <p className="text-gray-600 text-sm">{clause.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for displaying clause drafts */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClause(null);
          }}
          title={selectedClause?.title || 'Clause Draft'}
        >
          {selectedClause && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Suggested Draft</h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-gray-700 text-sm whitespace-pre-wrap font-sans">
                    {selectedClause.draft}
                  </pre>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>💡 <strong>Tip:</strong> This is an AI-generated draft. Please review and modify it according to your specific needs and local legal requirements.</p>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
} 