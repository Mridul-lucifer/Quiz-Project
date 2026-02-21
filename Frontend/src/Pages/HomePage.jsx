import React, { useState } from 'react';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!topic) return;

    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL; 
    try {
      const response = await fetch(`${baseUrl}/search/${topic}`, {
        method: 'POST',
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
        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-slate-500 font-medium">Building your study guide for "{topic}"...</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {materials.map((item, i) => (
              <section key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                <h2 className="text-xl font-bold text-indigo-700 mb-4 flex items-start">
                  <span className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3 flex-shrink-0">
                    {i + 1}
                  </span>
                  {item.question}
                </h2>
                <div className="pl-11 text-slate-600 leading-relaxed text-lg border-l-2 border-slate-100">
                  {item.answer}
                </div>
              </section>
            ))}
          </div>
        )}
        
        {!loading && materials.length === 0 && (
          <div className="text-center text-slate-400 py-20">
            Enter a topic above to start your journey.
          </div>
        )}
      </main>
    </div>
  );
}