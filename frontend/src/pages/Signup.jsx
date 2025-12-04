import React, { useState, useContext } from 'react';
import { signup } from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signup(form);
      signIn(res);
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded shadow max-w-md mx-auto transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Signup</h2>
      <form onSubmit={handle} className="space-y-3">
        <input 
          name="name" 
          value={form.name} 
          onChange={e => setForm({...form, name: e.target.value})}
          placeholder="Name" 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          required 
        />
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
          minLength={6} 
        />
        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  );
}