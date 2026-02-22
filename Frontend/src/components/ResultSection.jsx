import React, { useState } from 'react';

export default function ResultSection({ loading, items, topic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-bounce text-6xl mb-4">🧠</div>
        <p className="text-xl text-slate-500 font-medium animate-pulse">
          Crafting personalized cards {topic ? `for "${topic}"` : "from image"}...
        </p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center text-slate-400 py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl mt-8">
        No cards generated yet. Start above!
      </div>
    );
  }

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 perspective-1000">
      {/* Card Container */}
      <div 
        className={`relative w-full h-80 transition-transform duration-500 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Face (Question) */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
          <span className="text-indigo-500 font-bold text-sm uppercase tracking-widest mb-4">Question {currentIndex + 1} of {items.length}</span>
          <h2 className="text-lg md:text-3xl font-bold text-slate-800 leading-tight">
            {items[currentIndex].question}
          </h2>
          <p className="absolute bottom-6 text-slate-400 text-sm font-medium italic">Click card to reveal answer</p>
        </div>

        {/* Back Face (Answer) */}
        <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center rotate-y-180 text-white">
          <span className="text-indigo-200 font-bold text-sm uppercase tracking-widest mb-4">Answer</span>
          <div className="overflow-y-auto max-h-full scrollbar-hide">
            <p className="text-lg md:text-xl leading-relaxed">
              {items[currentIndex].answer}
            </p>
          </div>
          <p className="absolute bottom-6 text-indigo-200 text-sm font-medium italic">Click card to see question</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-8 px-4">
        <button 
          onClick={handlePrev}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition active:scale-95 shadow-sm"
        >
          ← Prev
        </button>
        
        <div className="text-slate-400 font-mono font-bold">
          {currentIndex + 1} / {items.length}
        </div>

        <button 
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition active:scale-95 shadow-md"
        >
          Next →
        </button>
      </div>
    </div>
  );
}