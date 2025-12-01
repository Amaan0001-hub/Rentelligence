

"use client";

import React, { useState, useCallback } from "react";
import { Loader, Code, Eye, Zap, CheckCircle, Clipboard } from "lucide-react";

// --- Utility to extract code blocks ---
const extractCode = (rawText) => {
  const codeMatch = rawText.match(/```(\w+)\n([\s\S]*?)```/);
  if (codeMatch && codeMatch.length >= 3) {
    return {
      language: codeMatch[1].toLowerCase(),
      content: codeMatch[2].trim(),
    };
  }
  return {
    language: "markdown",
    content: rawText.trim(),
  };
};

// --- Exponential backoff for API retries ---
const withExponentialBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      console.warn(`Retrying in ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
};

// --- Code Display Component ---
const CodeDisplay = ({ codeContent, language, onToggleView }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800">
        <span className="text-sm font-mono text-indigo-400 uppercase">{language}</span>
        <div className="flex space-x-2">
          {language === "html" && (
            <button
              onClick={() => onToggleView("preview")}
              className="flex items-center text-sm px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Eye className="w-4 h-4 mr-1" /> Live Preview
            </button>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center text-sm px-3 py-1 rounded-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" /> Copied!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4 mr-1" /> Copy Code
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-50 max-h-[600px] overflow-y-auto">
        <code>{codeContent}</code>
      </pre>
    </div>
  );
};

// --- Live Preview Component ---
const LivePreview = ({ htmlContent, onToggleView }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
    <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border-b">
      <button
        onClick={() => onToggleView("code")}
        className="flex items-center text-sm px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        <Code className="w-4 h-4 mr-1" /> View Code
      </button>
    </div>
    <iframe
      title="Live Code Preview"
      srcDoc={htmlContent}
      sandbox="allow-scripts allow-forms allow-modals allow-popups allow-pointer-lock allow-same-origin"
      className="w-full h-[600px] border-none rounded-lg"
    ></iframe>
  </div>
);

// --- Main Code Generator Sandbox ---
const CodeGenerationSandbox = () => {
  const [prompt, setPrompt] = useState(
    ""
  );
  const [extractedCode, setExtractedCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("code");

  const apiKey = "AIzaSyAr25va8SEja7BZd5FmrnhUlxrruVmBhOY";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const handleToggleView = useCallback((mode) => setViewMode(mode), []);

  const callGeminiApi = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setExtractedCode(null);
    setError(null);

    const systemPrompt =
      "You are a code generator. Only output one Markdown code block containing complete, runnable code. Default to HTML with Tailwind CSS.";

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
      const response = await withExponentialBackoff(async () => {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorBody = await res.json();
          throw new Error(errorBody.error?.message || "API Error");
        }
        return res.json();
      });

      const candidate = response.candidates?.[0];
      const rawText = candidate?.content?.parts?.[0]?.text;
      if (rawText) {
        const extracted = extractCode(rawText);
        setExtractedCode(extracted);
        setViewMode(extracted.language === "html" ? "preview" : "code");
      } else {
        setError("Unexpected empty response.");
      }
    } catch (err) {
      setError(`Failed to fetch AI response: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  return (
    <section id="coder" className="py-16 sm:py-24 bg-indigo-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Input Area */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <textarea
            className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-md resize-none"
            rows="3"
            placeholder="e.g., Create a pricing page in HTML with Tailwind CSS."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
          <button
            onClick={callGeminiApi}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" /> Send
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="mt-10">
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl mb-4">
              <p className="font-medium">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center p-10 bg-white rounded-2xl shadow-lg border border-gray-200">
              <Loader className="w-8 h-8 mr-3 text-indigo-600 animate-spin" />
              <p className="text-lg text-gray-600">AI is writing </p>
            </div>
          )}

          {extractedCode && !isLoading && (
            <>
              {extractedCode.language === "html" && (
                <div className="mb-4 flex space-x-3">
                  <button
                    onClick={() => setViewMode("code")}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      viewMode === "code"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Code className="w-4 h-4 mr-2 inline-block" /> Code View
                  </button>
                  <button
                    onClick={() => setViewMode("preview")}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      viewMode === "preview"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <Eye className="w-4 h-4 mr-2 inline-block" /> Live Preview
                  </button>
                </div>
              )}

              {viewMode === "code" && (
                <CodeDisplay
                  codeContent={extractedCode.content}
                  language={extractedCode.language}
                  onToggleView={handleToggleView}
                />
              )}
              {viewMode === "preview" && extractedCode.language === "html" && (
                <LivePreview
                  htmlContent={extractedCode.content}
                  onToggleView={handleToggleView}
                />
              )}
            </>
          )}

          {!isLoading && !extractedCode && !error && (
            <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
              <p className="text-gray-500 italic">
              Result
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CodeGenerationSandbox;
