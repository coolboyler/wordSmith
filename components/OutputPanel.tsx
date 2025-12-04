import React, { useState } from 'react';
import { WordIcon, CopyIcon, CheckIcon } from '../icons';
import { copyHtmlToClipboard } from '../utils/clipboardUtils';
import { ConversionStatus } from '../types';

interface OutputPanelProps {
  htmlContent: string;
  status: ConversionStatus;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ htmlContent, status }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!htmlContent) return;
    try {
      await copyHtmlToClipboard(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const isEmpty = !htmlContent && status !== ConversionStatus.PROCESSING;

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Word Preview</h2>
        {!isEmpty && (
          <button
            onClick={handleCopy}
            disabled={status === ConversionStatus.PROCESSING}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              copied
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20'
            }`}
          >
            {copied ? <CheckIcon /> : <WordIcon />}
            {copied ? 'Copied!' : 'Copy for Word'}
          </button>
        )}
      </div>

      <div className="flex-1 relative overflow-hidden bg-white">
        {status === ConversionStatus.PROCESSING ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Converting formatting & LaTeX...</p>
          </div>
        ) : isEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <WordIcon />
            <p className="mt-4 text-sm max-w-xs">
              Converted content will appear here. The result is optimized for pasting directly into Microsoft Word documents.
            </p>
          </div>
        ) : (
          <div 
            className="w-full h-full p-8 overflow-y-auto prose prose-blue max-w-none prose-headings:font-semibold prose-p:text-gray-800 prose-li:text-gray-800"
            // We use standard HTML rendering here. The CSS for 'math' tags in index.html handles the equation sizing.
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
};