// src/pages/DeveloperEdit.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeveloperById, updateDeveloper } from '../api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export default function DeveloperEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: '',
    role: 'Frontend',
    techStack: '',
    experience: '',
    description: '',
    joiningDate: '',
    photo: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const dev = await fetchDeveloperById(id);
        if (!mounted) return;
        setForm({
          name: dev.name || '',
          role: dev.role || 'Frontend',
          techStack: Array.isArray(dev.techStack) ? dev.techStack.join(', ') : (dev.techStack || ''),
          experience: dev.experience ?? '',
          description: dev.description || '',
          joiningDate: dev.joiningDate ? new Date(dev.joiningDate).toISOString().slice(0, 10) : '',
          photo: dev.photo || ''
        });
      } catch (err) {
        console.error('fetchDeveloperById error:', err);
        const msg = err?.message || String(err);
        if (msg.toLowerCase().includes('401') || msg.toLowerCase().includes('unauthorized')) {
          toast.info('Session expired. Please login again.');
          signOut();
          navigate('/login');
          return;
        }
        if (msg.toLowerCase().includes('404') || msg.toLowerCase().includes('not found')) {
          toast.error('Developer not found');
          navigate('/');
          return;
        }
        toast.error(msg || 'Failed to load developer');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id, navigate, signOut]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.name || form.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    const techs = form.techStack.split(',').map(s => s.trim()).filter(Boolean);
    if (!techs.length) {
      toast.error('Provide at least one tech in tech stack');
      return;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role,
      techStack: techs,
      experience: form.experience === '' ? 0 : Number(form.experience),
      description: form.description?.trim() || '',
      joiningDate: form.joiningDate ? new Date(form.joiningDate).toISOString() : undefined,
      photo: form.photo?.trim() || ''
    };

    try {
      setSaving(true);
      await updateDeveloper(id, payload);
      toast.success('Developer updated');
      navigate(`/developers/${id}`);
    } catch (err) {
      console.error('updateDeveloper error:', err);
      const msg = (err && err.message) ? err.message : 'Failed to update developer';
      if (msg.toLowerCase().includes('401') || msg.toLowerCase().includes('unauthorized')) {
        toast.info('Session expired. Please login again.');
        signOut();
        navigate('/login');
        return;
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading message="Loading developer..." />;

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Edit Developer</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <input 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          value={form.name} 
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          placeholder="Name" 
        />

        <select 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          value={form.role} 
          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
        >
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Full-Stack">Full-Stack</option>
        </select>

        <input 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          value={form.techStack} 
          onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))} 
          placeholder="react, node" 
        />

        <input 
          type="number" 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          value={form.experience} 
          onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} 
          placeholder="Experience in years" 
        />

        <textarea 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          value={form.description} 
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
          rows={4} 
          placeholder="Description" 
        />

        <input 
          type="date" 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          value={form.joiningDate} 
          onChange={e => setForm(f => ({ ...f, joiningDate: e.target.value }))} 
        />

        <input 
          className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white" 
          value={form.photo} 
          onChange={e => setForm(f => ({ ...f, photo: e.target.value }))} 
          placeholder="Photo URL (optional)" 
        />

        <div className="flex gap-3">
          <button 
            disabled={saving} 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 border dark:border-slate-600 rounded dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}