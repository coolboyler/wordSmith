import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
        <span className="text-blue-600">Word</span>Smith AI
      </h1>
      <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto">
        Convert GPT/LLM text and LaTeX formulas into perfectly formatted Word documents. 
        Preserves headers, lists, and converts <span className="font-mono bg-gray-200 px-1 rounded text-xs">$E=mc^2$</span> to native Office Math.
      </p>
    </header>
  );
};