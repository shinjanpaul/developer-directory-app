import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login(form);
      signIn(res);
      toast.success('Logged in');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded shadow max-w-md mx-auto transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Login</h2>
      <form onSubmit={handle} className="space-y-3">
        <input 
          name="email" 
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})}
          placeholder="Email" 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          required 
        />
        <input 
          name="password" 
          type="password" 
          value={form.password} 
          onChange={e => setForm({...form, password: e.target.value})}
          placeholder="Password" 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          required 
        />
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <Link to="/signup" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}