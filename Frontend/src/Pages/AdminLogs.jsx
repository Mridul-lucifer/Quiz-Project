import React, { useState, useEffect } from 'react';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/logs`);
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Error loading logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.email.toLowerCase().includes(filter.toLowerCase()) || 
    log.topic.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center text-slate-400 animate-pulse font-bold">Accessing Secure Logs...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="p-2 bg-indigo-600 rounded-lg text-white text-sm">ADMIN</span> 
              Search Activity Logs
            </h1>
            <p className="text-slate-500 text-sm mt-1">Real-time tracking of user searches and AI triggers.</p>
          </div>

          <input 
            type="text" 
            placeholder="Search by email or topic..."
            className="p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 ring-indigo-500 w-full md:w-64 shadow-sm text-sm"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">User Email</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Topic Searched</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Time (IST)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {log.email[0].toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-700">{log.email}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100">
                      {log.topic}
                    </span>
                  </td>
                  <td className="p-5 text-right text-slate-400 text-sm font-mono">
                    {new Date(log.search_time).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata', // Forces the display to IST
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true // Shows AM/PM
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="p-20 text-center text-slate-400 italic">No logs match your search.</div>
          )}
        </div>
      </div>
    </div>
  );
}