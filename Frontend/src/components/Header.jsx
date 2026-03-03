import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear(); // Clears token, user info, and profile
    navigate('/login');
  };

  const isActive = (path) => 
    location.pathname === path 
      ? "bg-blue-600 text-white" 
      : "text-slate-600 hover:bg-slate-100";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">StudyAI</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/myquestions" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/myquestions')}`}>
                Question Bank
              </Link>
              <Link to="/valueInput" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/valueInput')}`}>
                Topic Search
              </Link>
              <Link to="/imageInput" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/imageInput')}`}>
                Image OCR
              </Link>
              <Link to="/profile-setup" className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive('/profile-setup')}`}>
                Profile
              </Link>
              <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-md">
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}