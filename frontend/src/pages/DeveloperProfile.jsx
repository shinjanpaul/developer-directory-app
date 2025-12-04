import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchDeveloperById, deleteDeveloper } from '../api';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';

export default function DeveloperProfile() {
  const { id } = useParams();
  const [dev, setDev] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetchDeveloperById(id);
        setDev(res.data || res);
      } catch (err) {
        toast.error(err.message || 'Failed to load developer');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Delete this developer?')) return;
    try {
      await deleteDeveloper(id);
      toast.success('Developer deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  if (loading) return <Loading />;
  if (!dev) return <div className="text-center p-6">Developer not found.</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 bg-slate-100 rounded flex items-center justify-center">
          {dev.photo ? <img src={dev.photo} alt={dev.name} className="w-24 h-24 object-cover rounded" /> : <span className="text-sm text-slate-500">No photo</span>}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{dev.name}</h2>
          <p className="text-sm text-slate-600">{dev.role} • {dev.experience} yrs</p>
          <div className="mt-2">
            {(dev.techStack || []).map((t, i) => <span key={i} className="inline-block mr-2 mb-2 px-2 py-1 bg-slate-100 rounded text-sm">{t}</span>)}
          </div>
          <p className="mt-4 text-slate-700">{dev.description || 'No description provided.'}</p>
          <p className="mt-3 text-xs text-slate-500">Joined: {new Date(dev.joiningDate || dev.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to={`/developers/${id}/edit`} className="px-3 py-1 border rounded text-sm">Edit</Link>
          <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}
