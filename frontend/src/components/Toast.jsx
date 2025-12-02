
import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-md text-sm text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
      {toast.message}
    </div>
  );
}
