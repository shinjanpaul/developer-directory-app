import React, { useMemo } from 'react';

function normalizeTechStack(techStack) {
  if (!techStack) return [];
  if (Array.isArray(techStack)) return techStack.map(t => String(t).trim()).filter(Boolean);
  if (typeof techStack === 'object') {
    try {
      return String(techStack).split(',').map(t => t.trim()).filter(Boolean);
    } catch {
      return [];
    }
  }
  return String(techStack).split(',').map(t => t.trim()).filter(Boolean);
}

export default function DeveloperList({ developers, loading, filterRole, setFilterRole, searchTech, setSearchTech }) {
  const filtered = useMemo(() => {
    return developers.filter((dev) => {
      const matchesRole = filterRole === 'All' || dev.role === filterRole;

      const techArray = normalizeTechStack(dev.techStack);
      const techString = techArray.join(' ').toLowerCase(); 

      const matchesTech = !searchTech.trim() || techString.includes(searchTech.trim().toLowerCase());

      return matchesRole && matchesTech;
    });
  }, [developers, filterRole, searchTech]);

  return (
    <section className="border border-slate-200 rounded-2xl p-4 md:p-5 bg-white">
      <div className="flex items-start md:items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold">Developers ({filtered.length})</h2>
          <p className="text-xs text-slate-400">Filter and search developers</p>
        </div>

        <div className="flex gap-2 items-center">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
                  className="rounded-xl border px-3 py-1.5 text-sm focus:outline-none">
            <option value="All">All Roles</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Full-Stack">Full-Stack</option>
          </select>

          <input value={searchTech} onChange={(e) => setSearchTech(e.target.value)} placeholder="Search tech e.g. React"
                 className="rounded-xl border px-3 py-1.5 text-sm focus:outline-none" />
        </div>
      </div>

      <div className="h-[1px] bg-slate-100 mb-3" />

      <div className="space-y-3 max-h-[56vh] overflow-y-auto pr-1">
        {loading && <p className="text-sm text-slate-500">Loading developers...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-slate-500">No developers found. Add one.</p>
        )}

        {filtered.map((dev) => {
          const techArray = normalizeTechStack(dev.techStack);

          return (
            <article key={dev._id || `${dev.name}-${dev.role}-${dev.experience}`}
                     className="border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h3 className="text-sm md:text-base font-semibold">{dev.name}</h3>
                <p className="text-xs md:text-sm text-slate-500">{dev.role} • {dev.experience} yrs</p>
                {techArray.length > 0 && <p className="text-xs text-slate-600 mt-1">{techArray.join(', ')}</p>}
              </div>
              <div className="flex flex-wrap gap-1">
                {techArray.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border text-[11px]">{t}</span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
