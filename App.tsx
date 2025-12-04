import React, { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { Header } from './components/Header';
import { convertToWordFormat } from './services/geminiService';
import { ConversionStatus } from './types';
import { MagicIcon } from './icons';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputHtml, setOutputHtml] = useState<string>('');
  const [status, setStatus] = useState<ConversionStatus>(ConversionStatus.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!inputText.trim()) return;

    setStatus(ConversionStatus.PROCESSING);
    setErrorMsg(null);

    try {
      const result = await convertToWordFormat(inputText);
      setOutputHtml(result.wordReadyHtml);
      setStatus(ConversionStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(ConversionStatus.ERROR);
      setErrorMsg("Failed to convert text. Please check your API Key and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 h-screen flex flex-col">
        <Header />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 mb-6">
          {/* Input Section */}
          <div className="h-[400px] lg:h-auto flex flex-col">
            <InputPanel 
              value={inputText} 
              onChange={setInputText} 
              disabled={status === ConversionStatus.PROCESSING}
            />
          </div>

          {/* Action Button (Mobile Only - or Center Piece) */}
          <div className="lg:hidden flex justify-center">
            <button
              onClick={handleConvert}
              disabled={!inputText.trim() || status === ConversionStatus.PROCESSING}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            >
              <MagicIcon />
              Convert to Word Format
            </button>
          </div>

          {/* Output Section */}
          <div className="h-[400px] lg:h-auto flex flex-col">
            <OutputPanel 
              htmlContent={outputHtml} 
              status={status}
            />
          </div>
        </div>

        {/* Action Button (Desktop - Bottom or Sticky) */}
        <div className="hidden lg:flex justify-center pb-4">
           <button
              onClick={handleConvert}
              disabled={!inputText.trim() || status === ConversionStatus.PROCESSING}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-bold shadow-xl shadow-blue-500/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all duration-200"
            >
              <MagicIcon />
              {status === ConversionStatus.PROCESSING ? 'Processing...' : 'Process & Format for Word'}
            </button>
        </div>

        {errorMsg && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-200 text-red-700 px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-bounce">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;