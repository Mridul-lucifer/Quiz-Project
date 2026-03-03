import React, { useState } from 'react';
import ResultSection from '../components/ResultSection';

export default function ValueToQuestions() {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5); // Default to 5
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic) return;

    // Validation for Free Tier
    if (count > 20) {
      alert("⚠️ Free Tier Limit: Please request 20 or fewer questions.");
      setCount(20);
      return;
    }

    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('user'));
    const baseUrl = import.meta.env.VITE_API_URL; 

    try {
      const response = await fetch(`${baseUrl}/search/${topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userData.id,
          count: count // Sending the requested count to backend
        }),
      });
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      console.error("Error fetching study materials:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-indigo-700 py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">AI Study Assistant</h1>
        <p className="text-indigo-100 mb-8 max-w-xl mx-auto text-lg">
          Generate a custom study guide with a specific number of questions.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter Topic (e.g. Photosynthesis)"
            className="flex-grow p-4 rounded-xl text-slate-900 outline-none focus:bg-slate-50 transition"
          />
          
          <div className="flex items-center px-4 border-l border-slate-100">
            <label className="text-slate-400 text-sm font-bold mr-3 uppercase">Count:</label>
            <input 
              type="number"
              value={count}
              min="1"
              max="20"
              onChange={(e) => setCount(e.target.value)}
              className="w-16 p-2 bg-slate-100 rounded-lg text-center font-bold text-indigo-700 outline-none"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-xl transition transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Learn'}
          </button>
        </form>
        {count > 20 && <p className="text-amber-300 text-sm mt-3 font-medium">⚠️ Max 20 questions for Free Tier</p>}
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <ResultSection loading={loading} items={materials} topic={topic} />
      </main>
    </div>
  );
} 