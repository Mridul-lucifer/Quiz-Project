import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function PhotoToQuestions() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [questions, setQuestions] = useState([]);

  const handleProcessImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setQuestions([]); // Clear previous results
    const baseUrl = import.meta.env.VITE_API_URL; 

    try {
      // Step 1: Extract Text locally
      setProgress("Reading image text...");
      const { data: { text } } = await Tesseract.recognize(file, 'eng');
      
      if (!text.trim()) {
        alert("No text found in image.");
        setLoading(false);
        return;
      }

      // Step 2: Send to your Backend
      setProgress("Generating questions with AI...");
      const response = await fetch(`${baseUrl}/page`, { // Update URL to your backend port
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageText: text }),
      });

      if (!response.ok) throw new Error("Backend failed to respond");

      const data = await response.json();
      setQuestions(data); // Expecting [{question: "...", answer: "..."}]

    } catch (error) {
      console.error("Process Error:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">AI Study Guide</h1>
          <p className="text-slate-500">Upload a textbook photo to generate a Q&A list</p>
        </header>

        {/* Upload Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <label className="flex flex-col items-center p-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
            <span className="text-slate-600 font-medium">
              {loading ? "🔄 Processing..." : "📸 Select Image to Begin"}
            </span>
            <input type="file" className="hidden" onChange={handleProcessImage} disabled={loading} accept="image/*" />
          </label>
          
          {loading && (
            <p className="text-center mt-4 text-blue-600 font-semibold animate-pulse">
              {progress}
            </p>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {questions.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
              <p className="font-bold text-slate-800 mb-2">Q: {item.question}</p>
              <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-400 mr-2">A:</span> 
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}