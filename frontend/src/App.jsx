// src/App.jsx
import React, { useEffect, useState } from 'react';
import { fetchDevelopers, createDeveloper } from './api';
import DeveloperForm from './components/DeveloperForm';
import DeveloperList from './components/DeveloperList';
import Toast from './components/Toast';


function techStackToString(ts) {
  if (!ts && ts !== 0) return '';
  if (Array.isArray(ts)) return ts.map((t) => String(t).trim()).filter(Boolean).join(', ');
  if (typeof ts === 'object') {
    
    try {
      if (ts instanceof Set) return Array.from(ts).join(', ');
      
      return String(ts).split(',').map((s) => s.trim()).filter(Boolean).join(', ');
    } catch {
      return '';
    }
  }
  return String(ts).trim();
}

export default function App() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // filters
  const [filterRole, setFilterRole] = useState('All');
  const [searchTech, setSearchTech] = useState('');

  useEffect(() => {
    loadDevelopers();
    
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const loadDevelopers = async () => {
    try {
      setLoading(true);
      const data = await fetchDevelopers();
      
     

      
      const normalized = (data || []).map((d) => ({
        ...d,
        techStack: techStackToString(d.techStack),
      }));

      setDevelopers(normalized);
    } catch (err) {
      console.error(err);
      showToast('error', 'Failed to load developers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeveloper = async (payload) => {
    try {
      const created = await createDeveloper(payload);

      const normalized = {
        ...created,
        techStack: techStackToString(created.techStack || payload.techStack),
      };

      setDevelopers((prev) => [normalized, ...prev]);

      return normalized;
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-5xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Developer Directory
              </h1>
              <p className="text-slate-500 text-sm">
                Add and search developers for Talrn internship task
              </p>
            </div>

            <div className="text-xs text-slate-500">React + Vite + Tailwind</div>
          </header>

          <div className="grid md:grid-cols-[1.1fr,1.4fr] gap-6 md:gap-8">
            <DeveloperForm onAdded={handleAddDeveloper} showToast={showToast} />

            <DeveloperList
              developers={developers}
              loading={loading}
              filterRole={filterRole}
              setFilterRole={setFilterRole}
              searchTech={searchTech}
              setSearchTech={setSearchTech}
            />
          </div>

          <footer className="text-[12px] text-slate-400 text-center">
            Built with React, Vite, Tailwind, Node.js and MongoDB.
          </footer>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
