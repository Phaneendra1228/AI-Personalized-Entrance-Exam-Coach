'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SHORTCUTS = [
    { key: 'D', label: 'Dashboard', path: '/' },
    { key: 'A', label: 'Analytics', path: '/analytics' },
    { key: 'C', label: 'AI Coach', path: '/coach' },
    { key: 'P', label: 'Revision Planner', path: '/planner' },
    { key: 'F', label: 'Flashcards', path: '/flashcards' },
    { key: 'Q', label: 'Daily Quiz', path: '/quiz' },
    { key: 'N', label: 'Notes', path: '/notes' },
    { key: 'L', label: 'Leaderboard', path: '/leaderboard' },
    { key: 'B', label: 'Bookmarks', path: '/bookmarks' },
    { key: 'R', label: 'Reminders', path: '/reminders' },
    { key: 'S', label: 'Study Rooms', path: '/study-rooms' },
    { key: 'H', label: 'Test History', path: '/history' },
];

export default function KeyboardShortcuts() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Don't trigger if typing in input/textarea
            const tag = (e.target as HTMLElement).tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
                e.preventDefault();
                setOpen(o => !o);
                return;
            }

            if (e.key === 'Escape') {
                setOpen(false);
                return;
            }

            // Only handle shortcuts when modal is closed (avoid conflicts)
            if (!open) {
                const shortcut = SHORTCUTS.find(s => s.key.toLowerCase() === e.key.toLowerCase());
                if (shortcut && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    router.push(shortcut.path);
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, router]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setOpen(false)}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <div className="relative glass p-6 rounded-2xl w-full max-w-md mx-4 slide-in"
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">⌨️ Keyboard Shortcuts</h2>
                    <button onClick={() => setOpen(false)} className="text-sm opacity-50 hover:opacity-100">✕</button>
                </div>
                <div className="space-y-1.5">
                    {SHORTCUTS.map(s => (
                        <div key={s.key} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-white/5">
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                            <kbd className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: '#6366f1' }}>
                                {s.key}
                            </kbd>
                        </div>
                    ))}
                    <div className="pt-2 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-center justify-between py-1.5 px-2">
                            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Toggle this panel</span>
                            <kbd className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: '#6366f1' }}>?</kbd>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
