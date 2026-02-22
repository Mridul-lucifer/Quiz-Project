import React, { useState, useEffect } from 'react';

export default function ResultSection({ loading, items, topic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  if (loading) return (
    <div className="text-center py-20 animate-pulse">
      <div className="text-6xl mb-4">🧠</div>
      <p className="text-xl text-slate-500 font-medium">Generating your cards...</p>
    </div>
  );

  if (!items || items.length === 0) return null;

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 perspective-1000">
      {/* Card Container */}
      <div 
        className={`relative w-full h-[450px] transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        
        {/* FRONT FACE (Question) */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-xl p-8 flex flex-col">
          <span className="text-indigo-500 font-bold text-xs uppercase tracking-widest mb-4 text-center">
            Question {currentIndex + 1} of {items.length}
          </span>
          
          {/* Scrollable Content Area */}
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar flex items-center justify-center">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-center leading-tight">
              {items[currentIndex].question}
            </h2>
          </div>
          
          <p className="mt-4 text-slate-400 text-xs font-medium italic text-center">Click to see answer</p>
        </div>

        {/* BACK FACE (Answer) */}
        <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-3xl shadow-xl p-8 flex flex-col rotate-y-180 text-white">
          <span className="text-indigo-200 font-bold text-xs uppercase tracking-widest mb-4 text-center">
            Detailed Explanation
          </span>
          
          {/* Scrollable Content Area */}
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            <p className="text-lg md:text-xl leading-relaxed">
              {items[currentIndex].answer}
            </p>
          </div>
          
          <p className="mt-4 text-indigo-200 text-xs font-medium italic text-center">Click to see question</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold shadow-sm active:scale-95 transition">← Prev</button>
        <span className="text-slate-500 font-bold">{currentIndex + 1} / {items.length}</span>
        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-md active:scale-95 transition">Next →</button>
      </div>
    </div>
  );
}