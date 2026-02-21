import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Turn your Study Material into <br />
          <span className="text-blue-600">Smart Quizzes</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-10 leading-relaxed">
          Upload photos of your textbooks or paste your lecture notes. Our AI extracts the core concepts 
          and generates high-quality questions and answers instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/imageInput" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Try Image OCR
          </Link>
          <Link to="/valueInput" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
            Paste Text
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">How it Works</h2>
        
        

        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Capture</h3>
            <p className="text-slate-600">Snap a photo of your book or notes. We support JPG, PNG, and WebP formats.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Extract</h3>
            <p className="text-slate-600">Using Tesseract.js, we read the text locally in your browser for 100% privacy.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Generate</h3>
            <p className="text-slate-600">Our Gemini-powered AI analyzes the context to create 5 relevant Q&A pairs.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-900 py-20 px-6 text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Built for Modern Students</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <p><span className="font-bold">Privacy First:</span> Text extraction happens on your device, not our servers.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <p><span className="font-bold">AI Accuracy:</span> Powered by the latest Gemini 2.5 Flash model.</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 text-xl">✓</span>
                <p><span className="font-bold">Lightning Fast:</span> Get your study guide in under 10 seconds.</p>
              </li>
            </ul>
          </div>
          <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
            <pre className="text-blue-400 text-sm overflow-hidden">
              <code>
                {`// Your AI Prompt in Action
const prompt = "Generate a JSON array..."
const result = await model.generate(pageText);
return result.response.json();`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        © 2026 StudyAI Project • Built with React, Tesseract.js, and Gemini
      </footer>
    </div>
  );
}