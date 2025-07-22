'use client';

import { useState } from 'react';
import UploadBox from '@/components/UploadBox';
import ResultBox from '@/components/ResultBox';
import { LeaseAnalysisResponse } from '@/lib/openai';

export default function Home() {
  const [analysis, setAnalysis] = useState<LeaseAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jurisdiction, setJurisdiction] = useState({ country: 'in', state: '' });

  const handleUploadComplete = async (fileUrl: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Send the file URL and jurisdiction to our analyze API
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileUrl,
          country: jurisdiction.country,
          state: jurisdiction.state || undefined
        }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(errorData.error || 'Failed to analyze lease');
      }

      const result = await analyzeResponse.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleJurisdictionChange = (field: 'country' | 'state', value: string) => {
    setJurisdiction(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Lease Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your rental agreement PDF and get jurisdiction-aware legal analysis with detailed clause assessment and suggestions.
          </p>
        </div>

        {/* Jurisdiction Selection */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Jurisdiction</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  value={jurisdiction.country}
                  onChange={(e) => handleJurisdictionChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in">India</option>
                  <option value="us">United States</option>
                  <option value="au">Australia</option>
                </select>
              </div>
              {jurisdiction.country === 'us' && (
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State (Optional)
                  </label>
                  <select
                    id="state"
                    value={jurisdiction.state}
                    onChange={(e) => handleJurisdictionChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">National (Default)</option>
                    <option value="ca">California</option>
                    <option value="ny">New York</option>
                    <option value="tx">Texas</option>
                    <option value="fl">Florida</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <UploadBox 
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />
        </div>

        {/* Results Section */}
        <ResultBox 
          analysis={analysis}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
} 