import React from 'react';
import { TrashIcon } from '../icons';

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Input Source</h2>
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
            title="Clear text"
          >
            <TrashIcon />
          </button>
        )}
      </div>
      <div className="flex-1 relative">
        <textarea
          className="w-full h-full p-4 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20 text-gray-800 font-mono text-sm leading-relaxed"
          placeholder="Paste your text from ChatGPT, text with Markdown, or LaTeX formulas here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
};