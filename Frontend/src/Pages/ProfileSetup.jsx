import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    degree: '',
    difficulty: 'intermediate',
    question_level: 'conceptual',
    goal: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    
    // Optional: Pre-fill form if user data exists in localStorage
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (savedUser.age) {
        setProfile(prev => ({...prev, ...savedUser}));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const apiUrl = import.meta.env.VITE_API_URL;

    // Filter out empty strings so we only update what the user typed
    const payload = Object.fromEntries(
        Object.entries(profile).filter(([_, value]) => value !== '')
    );

    try {
      const response = await fetch(`${apiUrl}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...payload, 
          userId: user.id 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Profile Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-slate-100">
        <div className="mb-10 text-center">
          <div className="inline-block p-4 bg-indigo-50 rounded-2xl mb-4 text-3xl">🤖</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Refine Your AI Tutor</h2>
          <p className="text-slate-500 font-medium">All fields are optional. Fill what you want, skip the rest.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Current Age</label>
              <input 
                type="number" 
                value={profile.age}
                placeholder="e.g. 20"
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all"
                onChange={(e) => setProfile({...profile, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Gender</label>
              <select 
                value={profile.gender}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                onChange={(e) => setProfile({...profile, gender: e.target.value})}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Degree / Major</label>
              <input 
                type="text" 
                value={profile.degree}
                placeholder="e.g. Computer Science"
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all"
                onChange={(e) => setProfile({...profile, degree: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Question Style</label>
              <select 
                value={profile.question_level}
                className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                onChange={(e) => setProfile({...profile, question_level: e.target.value})}
              >
                <option value="conceptual">Conceptual (Why?)</option>
                <option value="analytical">Analytical (How?)</option>
                <option value="factual">Factual (What?)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 space-y-4">
            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Personalizing..." : "Save Preferences"}
            </button>
            
            <button 
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-2 text-slate-400 font-bold hover:text-indigo-600 transition-colors text-sm"
            >
              Skip and go to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}