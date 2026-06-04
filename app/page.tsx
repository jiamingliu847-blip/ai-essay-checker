"use client";

import { useState } from "react";

export default function Home() {
  const [essay, setEssay] = useState("");
  const [analysis, setAnalysis] = useState<{
    wordCount: number;
    charCount: number;
    sentenceCount: number;
    issues: string[];
  } | null>(null);

  const analyzeEssay = () => {
    if (!essay.trim()) {
      setAnalysis(null);
      return;
    }

    // 字数统计（按空格分割）
    const words = essay.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 字符数统计
    const charCount = essay.length;

    // 句子数统计（按 . ! ? 分割）
    const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // 语法问题检测
    const issues: string[] = [];

    // 常见问题检测
    if (wordCount < 50) {
      issues.push("✏️ Your essay is quite short. Consider adding more details.");
    }

    if (sentenceCount > 0) {
      const avgWordsPerSentence = wordCount / sentenceCount;
      if (avgWordsPerSentence > 25) {
        issues.push("📖 Some sentences are very long. Try breaking them into shorter sentences.");
      }
      if (avgWordsPerSentence < 5) {
        issues.push("⚠️ Many very short sentences. Try combining some for better flow.");
      }
    }

    // 检查重复词（简单版本）
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      wordFrequency[lowerWord] = (wordFrequency[lowerWord] || 0) + 1;
    });

    const repeatedWords = Object.entries(wordFrequency)
      .filter(([_, count]) => count > 5)
      .map(([word]) => word);

    if (repeatedWords.length > 0) {
      issues.push(`🔄 You've used "${repeatedWords[0]}" many times. Try using synonyms.`);
    }

    // 检查常见文章结构
    if (!essay.toLowerCase().includes("first") && !essay.toLowerCase().includes("finally") && wordCount > 100) {
      issues.push("💡 Consider using transition words like 'first', 'next', 'finally' to improve structure.");
    }

    if (issues.length === 0) {
      issues.push("✅ Great job! Your essay looks well-written.");
    }

    setAnalysis({
      wordCount,
      charCount,
      sentenceCount,
      issues,
    });
  };

  const clearEssay = () => {
    setEssay("");
    setAnalysis(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
            AI Essay Checker
          </h1>
          <p className="text-slate-500 text-lg">
            Check your essay for length, structure, and writing tips
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {/* Textarea */}
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Essay
            </label>
            <textarea
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Write or paste your essay here...&#10;&#10;Example:&#10;Education is the most powerful tool for changing the world. It opens doors to opportunities and helps people grow. Every child deserves access to quality education because it builds a better future for everyone."
              className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none text-slate-700 placeholder-slate-400 bg-slate-50"
            />
          </div>

          {/* Buttons */}
          <div className="px-6 pb-4 flex gap-3">
            <button
              onClick={analyzeEssay}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-md"
            >
              🔍 Analyze Essay
            </button>
            <button
              onClick={clearEssay}
              className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 rounded-xl transition-all duration-200"
            >
              Clear
            </button>
          </div>

          {/* Stats Cards */}
          {analysis && (
            <div className="border-t border-slate-100">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">{analysis.wordCount}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">{analysis.charCount}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-700">{analysis.sentenceCount}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Sentences</div>
                </div>
              </div>

              {/* Issues List */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Analysis & Suggestions
                </h3>
                <div className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        issue.startsWith("✅")
                          ? "bg-emerald-50 text-emerald-700"
                          : issue.startsWith("⚠️") || issue.startsWith("🔄")
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {issue}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!analysis && essay.trim() === "" && (
            <div className="border-t border-slate-100 p-6 text-center text-slate-400">
              ✍️ Write your essay above and click "Analyze Essay" to get feedback
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-slate-400">
          <p>AI Essay Checker — Get instant feedback on your writing</p>
        </div>
      </div>
    </main>
  );
}