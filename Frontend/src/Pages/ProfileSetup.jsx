import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    age: '',
    gender: '', // New
    degree: '',
    difficulty: 'intermediate',
    question_level: 'conceptual', // New: conceptual, analytical, or factual
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Refine Your AI Tutor</h2>
          <p className="text-slate-500">The more details you provide, the better the study material.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Current Age</label>
              <input 
                type="number" placeholder="e.g. 20"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setProfile({...profile, age: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
              <select 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Degree / Major</label>
              <input 
                type="text" placeholder="e.g. Physics"
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setProfile({...profile, degree: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Question Type</label>
              <select 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setProfile({...profile, question_level: e.target.value})}
              >
                <option value="conceptual">Conceptual (Why it works)</option>
                <option value="analytical">Analytical (Problem Solving)</option>
                <option value="factual">Factual (Definitions/Dates)</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">
            {loading ? "Saving Profile..." : "Save and Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}