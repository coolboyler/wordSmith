import { GoogleGenAI } from "@google/genai";
import { ConvertResponse } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a professional typesetter and document formatting expert specialized in formatting text for Microsoft Word.
Your task is to convert raw text (often from LLMs like ChatGPT) containing Markdown and LaTeX into HTML that pastes PERFECTLY into MS Word.

### CRITICAL RULES:

1. **MATH FORMULAS (Highest Priority):**
   - Identify ALL LaTeX content (inline $...$ or block $$...$$).
   - Convert to **Standard Presentation MathML**.
   - **Constraints:**
     - Do NOT use <semantics>, <annotation>, or <annotation-xml>. These often break Word's importer. Use PURE Presentation MathML elements (mi, mo, mn, msup, mfrac, etc.).
     - Ensure the root <math> tag has \`xmlns="http://www.w3.org/1998/Math/MathML"\`.
     - For block math ($$...$$ or \\[...\\]), use \`<math display="block">\`.
     - For inline math ($...$), use \`<math display="inline">\`.

2. **TYPOGRAPHY & SPACING (Pan-Gu Rule):**
   - **Spacing:** You MUST insert a single space between Chinese/CJK characters and English words/Numbers.
     - Bad: "GPT-4发布了新功能"
     - Good: "GPT-4 发布了新功能"
     - Bad: "价格是$50美元"
     - Good: "价格是 $50 美元"
   - **Punctuation:** Normalize based on the sentence language.
     - If the sentence is Chinese, use Full-Width Punctuation (，。：；？！（）).
     - If the sentence is English, use Half-Width Punctuation.
     - Fix common LLM errors like using English commas (,) in Chinese text.

3. **DOCUMENT STRUCTURE:**
   - Use \`<h1>\`, \`<h2>\`, \`<h3>\` for headers.
   - Use \`<p>\` for paragraphs.
   - Use \`<ul>\`, \`<ol>\`, \`<li>\` for lists.
   - Use \`<b>\` (bold) and \`<i>\` (italic) as they map reliably to Word styles.
   - Use \`<pre><code>\` for code blocks, but wrap them in a table or styled div if possible for better visibility.
   - Return ONLY the HTML body content.

### EXAMPLE:

Input: 
"According to relativity,energy is defined as $E=mc^2$.所以说爱因斯坦great。"

Output:
<p>According to relativity, energy is defined as <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline"><mrow><mi>E</mi><mo>=</mo><mi>m</mi><msup><mi>c</mi><mn>2</mn></msup></mrow></math>. 所以说爱因斯坦 great。</p>
`;

export const convertToWordFormat = async (inputText: string): Promise<ConvertResponse> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing API Key");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: inputText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, 
      }
    });

    const cleanHtml = response.text || '';
    
    // Minimal wrapper for preview
    const html = `
      <div class="word-preview-content">
        ${cleanHtml}
      </div>
    `;

    return {
      html: cleanHtml,
      wordReadyHtml: cleanHtml
    };

  } catch (error) {
    console.error("Gemini conversion failed:", error);
    throw error;
  }
};