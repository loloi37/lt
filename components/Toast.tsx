'use client';

import { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export default function Toast({ message, visible, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onHide, duration);
    return () => clearTimeout(timer);
  }, [visible, onHide, duration]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-4 flex items-center gap-3 animate-fade-in-up shadow-lg">
      <CheckCircle size={16} className="text-olive flex-shrink-0" />
      <p className="text-sm text-warm-dark font-serif">{message}</p>
    </div>
  );
}
