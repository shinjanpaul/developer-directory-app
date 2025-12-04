// src/components/Loading.jsx
import React from 'react';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="p-8 text-center">
      <div className="inline-flex items-center gap-3">
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
          <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span className="text-sm text-slate-600">{message}</span>
      </div>
    </div>
  );
}
