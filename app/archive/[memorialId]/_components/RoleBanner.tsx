'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, Shield } from 'lucide-react';

export default function RoleBanner() {
  const [changeInfo, setChangeInfo] = useState<{ newRole: string } | null>(null);

  useEffect(() => {
    const handleRoleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ newRole: string }>).detail;
      setChangeInfo({ newRole: detail.newRole });
    };

    window.addEventListener('ulumae:role-changed', handleRoleChange);
    return () => window.removeEventListener('ulumae:role-changed', handleRoleChange);
  }, []);

  if (!changeInfo) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[100] animate-fadeIn">
      <div className="bg-warm-dark text-surface-low px-6 py-3 shadow-2xl flex items-center justify-between border-b border-olive/30 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-olive/20 rounded-full flex items-center justify-center shrink-0">
            <Shield size={18} className="text-olive" />
          </div>
          <div>
            <p className="font-medium text-sm">
              Your role was updated. You now have <span className="capitalize text-olive">{changeInfo.newRole.replace('_', ' ')}</span> access.
            </p>
            <p className="text-xs text-surface-low/60">
              This page is still open, but a refresh keeps every visible action aligned with your new permissions.
            </p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-olive hover:bg-olive/90 text-surface-low rounded-lg text-sm font-medium transition-all shadow-md active:scale-95"
        >
          <RefreshCw size={16} />
          Refresh now
        </button>
      </div>
    </div>
  );
}
