import React from 'react';
import { Link } from 'react-router-dom';

export default function DeveloperList({ developers = [] }) {
  if (!developers.length) {
    return (
      <div className="text-center p-6 text-slate-600 dark:text-slate-400">
        No developers found.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {developers.map(dev => (
        <div 
          key={dev._id || `${dev.name}-${dev.role}-${dev.experience}`} 
          className="bg-white dark:bg-slate-700 p-4 rounded shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between transition-colors duration-200"
        >
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{dev.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {dev.role} • {dev.experience} yr{dev.experience !== 1 ? 's' : ''}
            </p>
            <p className="text-sm mt-1 text-slate-700 dark:text-slate-300">
              {Array.isArray(dev.techStack) ? dev.techStack.join(', ') : dev.techStack}
            </p>
          </div>
          <div className="mt-3 sm:mt-0 flex gap-2">
            <Link 
              to={`/developers/${dev._id}`} 
              className="px-3 py-1 border dark:border-slate-600 rounded text-sm dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              View
            </Link>
            <Link 
              to={`/developers/${dev._id}/edit`} 
              className="px-3 py-1 border dark:border-slate-600 rounded text-sm dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}