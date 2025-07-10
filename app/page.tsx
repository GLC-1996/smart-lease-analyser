'use client';

import { useState } from 'react';
import UploadBox from '@/components/UploadBox';
import ResultBox from '@/components/ResultBox';
import { LeaseAnalysis } from '@/lib/openai';

export default function Home() {
  const [analysis, setAnalysis] = useState<LeaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (fileUrl: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Send the file URL to our analyze API
      const analyzeResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl }),
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Lease Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your rental agreement PDF and get an AI-powered analysis of key clauses, 
            terms, and potential red flags.
          </p>
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