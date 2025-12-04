// src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DeveloperForm from '../components/DeveloperForm';
import DeveloperList from '../components/DeveloperList';
import Loading from '../components/Loading';
import { fetchDevelopers, createDeveloper } from '../api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { token, lastSignInAt, signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [developers, setDevelopers] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState({
    search: '',
    role: '',
    page: 1,
    limit: 6,
    sort: 'experience',
    order: 'desc'
  });

  const nowMs = () => Date.now();

  const isAuthError = (err) => {
    if (!err) return false;
    const msg = String(err.message || '').toLowerCase();
    return (
      msg.includes('401') ||
      msg.includes('unauthorized') ||
      msg.includes('no authentication token') ||
      msg.includes('invalid token')
    );
  };

  const shouldForceSignOut = () => {
    try {
      if (!token && !localStorage.getItem('token')) return false;
      const last = Number(lastSignInAt) || Number(localStorage.getItem('lastSignInAt')) || 0;
      const age = nowMs() - last;
      const RACE_WINDOW_MS = 1200;
      return age > RACE_WINDOW_MS;
    } catch {
      return true;
    }
  };

  const loadDevelopers = useCallback(async () => {
    if (!token && !localStorage.getItem('token')) {
      setDevelopers([]);
      setMeta({ total: 0, page: 1, totalPages: 1 });
      return;
    }

    try {
      setLoading(true);
      const res = await fetchDevelopers({
        page: query.page,
        limit: query.limit,
        search: query.search,
        role: query.role,
        sort: query.sort,
        order: query.order
      });

      if (Array.isArray(res)) {
        setDevelopers(res);
        setMeta(prev => ({ ...prev, total: res.length, totalPages: 1 }));
      } else if (res && typeof res === 'object') {
        const data = res.data || res;
        if (Array.isArray(data)) {
          setDevelopers(data);
          setMeta({
            total: res.total ?? data.length,
            page: res.page ?? query.page,
            totalPages: res.totalPages ?? Math.ceil((res.total ?? data.length) / query.limit)
          });
        } else {
          setDevelopers(Array.isArray(res) ? res : []);
          setMeta(prev => ({ ...prev, total: Array.isArray(res) ? res.length : 0 }));
        }
      } else {
        setDevelopers([]);
        setMeta({ total: 0, page: 1, totalPages: 1 });
      }
    } catch (err) {
      console.error('Dashboard load error:', err);

      if (isAuthError(err)) {
        if (!shouldForceSignOut()) {
          console.warn('Auth 401 occurred within sign-in race window; will retry shortly.');
          setTimeout(() => {
            loadDevelopers().catch(() => {});
          }, 600);
          return;
        }

        toast.info('Session expired. Please login again.');
        signOut();
        navigate('/login');
        return;
      }

      toast.error(err.message || 'Failed to load developers');
    } finally {
      setLoading(false);
    }
  }, [token, query.page, query.limit, query.search, query.role, query.sort, query.order, signOut, navigate, lastSignInAt]);

  useEffect(() => {
    loadDevelopers();
  }, [loadDevelopers]);

  const handleAddDeveloper = async (payload) => {
    if (!token && !localStorage.getItem('token')) {
      toast.error('You must be logged in to add a developer');
      return;
    }

    try {
      setLoading(true);
      await createDeveloper(payload);
      toast.success('Developer added');
      setQuery(q => ({ ...q, page: 1 }));
      await loadDevelopers();
    } catch (err) {
      console.error('Add developer error:', err);
      if (isAuthError(err)) {
        if (!shouldForceSignOut()) {
          console.warn('Create 401 within sign-in window; retrying once.');
          setTimeout(async () => {
            try {
              await createDeveloper(payload);
              toast.success('Developer added (after retry)');
              await loadDevelopers();
            } catch (e) {
              if (isAuthError(e) && shouldForceSignOut()) {
                toast.info('Session expired. Please login again.');
                signOut();
                navigate('/login');
                return;
              }
              toast.error(e.message || 'Failed to add developer');
            }
          }, 600);
          return;
        }

        toast.info('Session expired. Please login again.');
        signOut();
        navigate('/login');
        return;
      }

      toast.error(err.message || 'Failed to add developer');
    } finally {
      setLoading(false);
    }
  };

  const goPrev = () => setQuery(q => ({ ...q, page: Math.max(1, q.page - 1) }));
  const goNext = () => setQuery(q => ({ ...q, page: Math.min(meta.totalPages || q.page + 1, q.page + 1) }));

  return (
    <div className="grid md:grid-cols-[1.1fr,1.4fr] gap-6">
      <div>
        <DeveloperForm onAdded={handleAddDeveloper} />
      </div>

      <div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow mb-4 transition-colors duration-200">
          <div className="flex gap-3 items-center">
            <input
              placeholder="Search name or tech"
              value={query.search}
              onChange={e => setQuery(q => ({ ...q, search: e.target.value, page: 1 }))}
              className="px-3 py-2 border dark:border-slate-600 rounded flex-1 dark:bg-slate-700 dark:text-white"
            />
            <select
              value={query.role}
              onChange={e => setQuery(q => ({ ...q, role: e.target.value, page: 1 }))}
              className="px-2 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full-Stack">Full-Stack</option>
            </select>

            <select
              value={query.order}
              onChange={e => setQuery(q => ({ ...q, order: e.target.value }))}
              className="px-2 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
            >
              <option value="desc">Experience: High → Low</option>
              <option value="asc">Experience: Low → High</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow transition-colors duration-200">
          {loading ? (
            <Loading />
          ) : (
            <>
              <DeveloperList developers={developers} onRefresh={loadDevelopers} />

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">Total: {meta.total ?? developers.length}</div>
                <div className="flex gap-2">
                  <button disabled={query.page <= 1} onClick={goPrev} className="px-3 py-1 border dark:border-slate-600 rounded dark:text-white disabled:opacity-50">Prev</button>
                  <div className="px-3 py-1 border dark:border-slate-600 rounded dark:text-white">{query.page} / {meta.totalPages || 1}</div>
                  <button disabled={query.page >= (meta.totalPages || 1)} onClick={goNext} className="px-3 py-1 border dark:border-slate-600 rounded dark:text-white disabled:opacity-50">Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}