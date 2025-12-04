// src/components/DeveloperForm.jsx
import React, { useState } from 'react';
import { createDeveloper } from '../api';

export default function DeveloperForm({ onAdded, showToast }) {
  const [form, setForm] = useState({
    name: '',
    role: 'Frontend',
    experience: '',
    techStack: '',
    description: '',
    joiningDate: '',
    photo: ''
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const reset = () => {
    setForm({
      name: '',
      role: 'Frontend',
      experience: '',
      techStack: '',
      description: '',
      joiningDate: '',
      photo: ''
    });
    setServerError(null);
  };

  function validate() {
    const errors = [];
    if (!form.name || form.name.trim().length < 2) errors.push('Name must be at least 2 characters.');
    const exp = Number(form.experience);
    if (form.experience !== '' && (isNaN(exp) || exp < 0)) errors.push('Experience must be a non-negative number.');
    const techs = form.techStack.split(',').map(s => s.trim()).filter(Boolean);
    if (!techs.length) errors.push('At least one tech is required in tech stack.');
    if (form.joiningDate) {
      const d = new Date(form.joiningDate);
      if (Number.isNaN(d.getTime())) errors.push('Joining date is not valid.');
    }
    return errors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const errors = validate();
    if (errors.length) {
      const msg = errors.join(' ');
      setServerError(msg);
      if (showToast) showToast('error', msg);
      return;
    }

    const payload = {
      name: form.name.trim(),
      role: form.role,
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
      experience: form.experience === '' ? 0 : Number(form.experience),
      description: form.description?.trim() || '',
      joiningDate: form.joiningDate ? new Date(form.joiningDate).toISOString() : undefined,
      photo: form.photo?.trim() || ''
    };

    try {
      setLoading(true);
      const created = await createDeveloper(payload);
      if (showToast) showToast('success', 'Developer added');
      reset();
      if (typeof onAdded === 'function') onAdded(created);
    } catch (err) {
      console.error('Create developer error (full):', err);
      const message = (err && err.message) ? err.message : 'Server error';
      setServerError(message);
      if (showToast) showToast('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm block mb-1 dark:text-slate-300">Name</label>
          <input
            className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Name"
            required
          />
        </div>

        <div>
          <label className="text-sm block mb-1 dark:text-slate-300">Role</label>
          <select
            className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full-Stack">Full-Stack</option>
          </select>
        </div>

        <div className="md:col-span-1">
          <label className="text-sm block mb-1 dark:text-slate-300">Experience (years)</label>
          <input
            type="number"
            min="0"
            max="50"
            className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            value={form.experience}
            onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
            placeholder="0"
          />
        </div>

        <div className="md:col-span-3">
          <label className="text-sm block mb-1 dark:text-slate-300">Tech Stack (comma-separated)</label>
          <input
            className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            value={form.techStack}
            onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))}
            placeholder="react, node, tailwind"
          />
        </div>

        <div className="md:col-span-3">
          <label className="text-sm block mb-1 dark:text-slate-300">Description</label>
          <textarea
            className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Short bio or about section (optional)"
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm block mb-1 dark:text-slate-300">Joining Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            value={form.joiningDate}
            onChange={e => setForm(f => ({ ...f, joiningDate: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-sm block mb-1 dark:text-slate-300">Photo URL (optional)</label>
          <input
            className="w-full px-3 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            value={form.photo}
            onChange={e => setForm(f => ({ ...f, photo: e.target.value }))}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-sm disabled:opacity-60 transition-colors"
        >
          {loading ? 'Adding...' : 'Add Developer'}
        </button>

        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 border dark:border-slate-600 rounded dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          Reset
        </button>

        {serverError && (
          <div className="text-sm text-red-600 dark:text-red-400 ml-4">
            {serverError}
          </div>
        )}
      </div>
    </form>
  );
}