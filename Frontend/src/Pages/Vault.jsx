import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Vault() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null); // Tracks which card is "open"
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!userData) return navigate('/login');
    fetchVault();
  }, []);

  const fetchVault = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vault/${userData.id}`);
      const data = await response.json();
      setCards(data);
    } catch (err) {
      console.error("Vault error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (e, id) => {
    e.stopPropagation(); // Don't open the card when clicking delete
    if (!window.confirm("Remove this card from your vault?")) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/vault/${id}`, { method: 'DELETE' });
      setCards(cards.filter(card => card.id !== id));
      if (expandedCard?.id === id) setExpandedCard(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Opening the vault...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 relative">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Your Study Vault</h1>
            <p className="text-slate-500 font-medium">Review your {cards.length} saved masterpieces.</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
          >
            + New Session
          </button>
        </header>

        {cards.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-slate-400 font-medium italic text-lg">Your vault is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div 
                key={card.id} 
                onClick={() => setExpandedCard(card)}
                className="group cursor-pointer bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all flex flex-col h-64"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded">Question</span>
                  <button onClick={(e) => deleteCard(e, card.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Question Preview */}
                <h3 className="text-lg font-bold text-slate-800 line-clamp-3 mb-4 flex-grow">
                  {card.question}
                </h3>

                <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-indigo-600 font-bold text-sm">
                  <span>View Full Answer</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- EXPANDED CARD MODAL --- */}
      {expandedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
              <h2 className="font-bold text-lg uppercase tracking-wide">Full Card View</h2>
              <button 
                onClick={() => setExpandedCard(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              <div>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block mb-2">The Question</span>
                <p className="text-2xl font-bold text-slate-800 leading-tight">
                  {expandedCard.question}
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest block mb-2">The Answer</span>
                <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {expandedCard.answer}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 text-center">
              <button 
                onClick={() => setExpandedCard(null)}
                className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}