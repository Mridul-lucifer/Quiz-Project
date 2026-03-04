import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import ResultSection from '../components/ResultSection'

export default function PhotoToQuestions() {
  const topic = "Image";
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
      const userData = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`${baseUrl}/page`, { // Update URL to your backend port
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pageText: text ,
          userId: userData.id
        }),
      });

      // This triggers first to save email, topic, and time
      await fetch(`${baseUrl}/log-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: userData.email, 
          topic: "Image text" 
        }),
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
        <main className="max-w-5xl mx-auto py-12 px-6">
          <ResultSection loading={loading} items={questions} topic={topic} />
        </main>
      </div>
    </div>
  );
}