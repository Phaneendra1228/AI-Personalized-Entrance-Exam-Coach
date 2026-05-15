'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) return { showToast: () => { } }; // graceful fallback
    return ctx;
}

const ICONS: Record<ToastType, string> = {
    success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️',
};

const COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
    success: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e44', text: '#22c55e' },
    error: { bg: 'rgba(239,68,68,0.15)', border: '#ef444444', text: '#ef4444' },
    info: { bg: 'rgba(99,102,241,0.15)', border: '#6366f144', text: '#6366f1' },
    warning: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b44', text: '#f59e0b' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        setToasts(prev => [...prev.slice(-2), { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div style={{
                position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
                display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none',
            }}>
                {toasts.map((toast, i) => {
                    const c = COLORS[toast.type];
                    return (
                        <div
                            key={toast.id}
                            style={{
                                pointerEvents: 'auto',
                                background: c.bg,
                                backdropFilter: 'blur(16px)',
                                border: `1px solid ${c.border}`,
                                borderRadius: '12px',
                                padding: '12px 16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                minWidth: '280px',
                                maxWidth: '400px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                animation: 'toastSlideIn 0.3s ease-out',
                                opacity: 1,
                                transform: `translateY(${-i * 4}px)`,
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>{ICONS[toast.type]}</span>
                            <span style={{ color: c.text, fontSize: '13px', fontWeight: 500, flex: 1 }}>{toast.message}</span>
                            <button
                                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                                style={{ color: c.text, opacity: 0.6, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                            >✕</button>
                            {/* Progress bar */}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px',
                                borderRadius: '0 0 12px 12px', overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%', background: c.text, opacity: 0.4,
                                    animation: 'toastProgress 3.5s linear forwards',
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </ToastContext.Provider>
    );
}
