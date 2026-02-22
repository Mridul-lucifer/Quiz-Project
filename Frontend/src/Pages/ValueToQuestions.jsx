import React, { useState } from 'react';
import ResultSection from '../components/ResultSection'

export default function ValueToQuestions() {
  const [topic, setTopic] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('user'));

    const baseUrl = import.meta.env.VITE_API_URL; 
    try {
      const response = await fetch(`${baseUrl}/search/${topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userData.id
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
      {/* Hero Header */}
      <header className="bg-indigo-700 py-16 px-4 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-4">AI Study Assistant</h1>
        <p className="text-indigo-100 mb-8">Type any topic to generate a custom study guide instantly.</p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. French Revolution, Cell Division, Python Loops..."
            className="flex-grow p-4 rounded-lg text-slate-900 shadow-lg outline-none focus:ring-4 ring-indigo-400"
          />
          <button 
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold px-8 rounded-lg transition transform active:scale-95 shadow-lg"
          >
            {loading ? 'Generating...' : 'Learn'}
          </button>
        </form>
      </header>

      {/* Results Section */}
      <main className="max-w-5xl mx-auto py-12 px-6">
        <ResultSection loading={loading} items={materials} topic={topic} />
      </main>
    </div>
  );
}