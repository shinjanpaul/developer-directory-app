import React, { useState } from 'react';

export default function DeveloperForm({ onAdded, showToast }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Frontend');
  const [techStack, setTechStack] = useState('');
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName('');
    setRole('Frontend');
    setTechStack('');
    setExperience('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim() || !techStack.trim() || experience === '') {
      showToast('error', 'Please fill all fields');
      return;
    }
    const expNum = Number(experience);
    if (Number.isNaN(expNum) || expNum < 0) {
      showToast('error', 'Experience must be a non-negative number');
      return;
    }

    const payload = { name: name.trim(), role, techStack: techStack.trim(), experience: expNum };

    try {
      setSubmitting(true);
      await onAdded(payload);
      showToast('success', 'Developer added');
      reset();
    } catch (err) {
      console.error(err);
      showToast('error', err.message || 'Error adding developer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border border-slate-200 rounded-2xl p-4 md:p-5 space-y-4 bg-white">
      <h2 className="text-lg font-semibold">Add Developer</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                 className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>

        <div>
          <label className="block text-sm font-medium">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
            <option>Frontend</option>
            <option>Backend</option>
            <option>Full-Stack</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Tech Stack (comma-separated)</label>
          <input value={techStack} onChange={(e) => setTechStack(e.target.value)} placeholder="React, Node.js, MongoDB"
                 className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>

        <div>
          <label className="block text-sm font-medium">Experience (years)</label>
          <input type="number" min="0" step="0.5" value={experience} onChange={(e) => setExperience(e.target.value)}
                 placeholder="1.5" className="w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>

        <button type="submit" disabled={submitting}
                className="w-full rounded-xl bg-sky-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-60">
          {submitting ? 'Saving...' : 'Add Developer'}
        </button>
      </form>
    </section>
  );
}
