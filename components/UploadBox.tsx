'use client';

import { useState } from 'react';
import { UploadDropzone } from '@/utils/uploadthing';
import { useRouter } from 'next/navigation';

interface UploadBoxProps {
  onUploadComplete: (fileUrl: string) => void;
  onUploadError: (error: string) => void;
}

export default function UploadBox({ onUploadComplete, onUploadError }: UploadBoxProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = async (res: any) => {
    setIsUploading(false);
    if (res && res[0] && res[0].url) {
      onUploadComplete(res[0].url);
    }
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    onUploadError(error.message);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <UploadDropzone
        endpoint="pdfUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={handleUploadError}
        onUploadBegin={() => setIsUploading(true)}
        config={{
          mode: "auto",
        }}
        appearance={{
          container: "border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors",
          allowedContent: "text-sm text-gray-500",
          button: "hidden",
        }}
      />
      {isUploading && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500">Processing your PDF...</div>
        </div>
      )}
    </div>
  );
} 