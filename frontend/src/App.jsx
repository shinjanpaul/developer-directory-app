// src/App.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DeveloperDetail from './pages/DeveloperDetail';
import EditDeveloper from './pages/EditDeveloper';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { user, signOut } = useContext(AuthContext);
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <ToastContainer position="top-right" theme={darkMode ? 'dark' : 'light'} />
      
      <header className="bg-white dark:bg-slate-800 shadow-sm transition-colors duration-200">
        <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
          <Link to="/" className="font-bold text-lg dark:text-white">Developer Directory</Link>
          
          <nav className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border dark:border-slate-600"
              type="button"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-300">{user.name}</span>
                <button onClick={signOut} className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded text-sm dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1 text-sm dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Login</Link>
                <Link to="/signup" className="px-3 py-1 text-sm dark:text-white hover:text-blue-600 dark:hover:text-blue-400">Signup</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/developers/:id" element={<ProtectedRoute><DeveloperDetail /></ProtectedRoute>} />
            <Route path="/developers/:id/edit" element={<ProtectedRoute><EditDeveloper /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}