'use client';

import { useState } from 'react';

interface UploadBoxProps {
  onUploadComplete: (file: File) => void;
  onUploadError: (error: string) => void;
}

export default function UploadBox({ onUploadComplete, onUploadError }: UploadBoxProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      onUploadError('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    try {
      onUploadComplete(file);
    } catch (error) {
      onUploadError('Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer block"
        >
          <div className="space-y-4">
            <div className="text-4xl">📄</div>
            <div className="text-lg font-medium text-gray-900">
              {isUploading ? 'Processing...' : 'Upload your lease agreement'}
            </div>
            <div className="text-sm text-gray-500">
              {isUploading ? 'Please wait while we process your PDF...' : 'Click to select a PDF file'}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
} 