// src/pages/DeveloperDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchDeveloperById } from '../api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export default function DeveloperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signOut } = useContext(AuthContext);
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const dev = await fetchDeveloperById(id);
        if (!mounted) return;
        setDeveloper(dev);
      } catch (err) {
        console.error('fetchDeveloperById error:', err);
        const msg = err?.message || String(err);
        if (msg.toLowerCase().includes('401') || msg.toLowerCase().includes('unauthorized')) {
          toast.info('Session expired. Please login again.');
          signOut();
          navigate('/login');
          return;
        }
        if (msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('404')) {
          toast.error('Developer not found');
          navigate('/');
          return;
        }
        toast.error(msg || 'Failed to fetch developer');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => { mounted = false; };
  }, [id, navigate, signOut]);

  if (loading) return <Loading />;

  if (!developer) {
    return (
      <div className="p-8 text-center">
        <div className="text-slate-600 dark:text-slate-400">Developer not found.</div>
        <div className="mt-4">
          <Link to="/" className="px-4 py-2 border dark:border-slate-600 rounded dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700">
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    role,
    experience,
    techStack = [],
    description,
    joiningDate,
    photo
  } = developer;

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 p-6 rounded shadow transition-colors duration-200">
      <div className="flex gap-4 items-start">
        <div>
          {photo ? (
            <img src={photo} alt={name} className="w-28 h-28 rounded-full object-cover border dark:border-slate-600" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
              No photo
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-semibold dark:text-white">{name}</h1>
          <div className="text-slate-600 dark:text-slate-400">{role} • {experience ?? 0} yrs</div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(techStack || []).map((t) => (
              <span key={t} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full border dark:border-slate-600 dark:text-slate-300">
                {t}
              </span>
            ))}
          </div>

          {description ? (
            <div className="mt-6">
              <h3 className="font-semibold dark:text-white">About</h3>
              <p className="mt-2 text-slate-700 dark:text-slate-300">{description}</p>
            </div>
          ) : (
            <div className="mt-6 text-slate-500 dark:text-slate-400">No description provided.</div>
          )}

          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Joined: {joiningDate ? new Date(joiningDate).toLocaleDateString() : '—'}
          </div>
        </div>

        <div className="ml-auto flex flex-col gap-2">
          <button 
            onClick={() => navigate(`/developers/${id}/edit`)} 
            className="px-3 py-1 border dark:border-slate-600 rounded dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Edit
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="px-3 py-1 border dark:border-slate-600 rounded dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}