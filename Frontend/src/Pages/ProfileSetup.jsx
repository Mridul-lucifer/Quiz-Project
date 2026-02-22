import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: '',
    degree: '',
    difficulty: 'intermediate',
    goal: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${apiUrl}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...profile, 
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

  const handleSkip = () => {
    // Navigate without saving anything to the DB
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Personalize Your AI</h2>
          <p className="text-slate-500">Tailor the complexity of your study material.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Current Age</label>
              <input 
                type="number" placeholder="Optional"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setProfile({...profile, age: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Degree / Major</label>
              <input 
                type="text" placeholder="Optional"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setProfile({...profile, degree: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level</label>
            <select 
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setProfile({...profile, difficulty: e.target.value})}
              value={profile.difficulty}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save and Continue"}
            </button>
            
            <button 
              type="button"
              onClick={handleSkip}
              className="w-full bg-transparent text-slate-400 py-2 rounded-xl text-sm font-medium hover:text-slate-600 transition-all"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}