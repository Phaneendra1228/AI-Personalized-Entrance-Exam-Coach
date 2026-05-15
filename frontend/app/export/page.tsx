'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

const DATA_KEYS = [
    { key: 'lf-profile', label: 'Profile Settings', icon: '👤' },
    { key: 'lf-notes', label: 'Notes', icon: '📝' },
    { key: 'lf-sticky-notes', label: 'Sticky Notes', icon: '📌' },
    { key: 'lf-bookmarks', label: 'Bookmarked Questions', icon: '🔖' },
    { key: 'lf-goals', label: 'Goals', icon: '🎯' },
    { key: 'lf-streak', label: 'Study Streak', icon: '🔥' },
    { key: 'lf-xp', label: 'XP & Level', icon: '⭐' },
    { key: 'lf-badges', label: 'Badges', icon: '🏅' },
    { key: 'lf-reminders', label: 'Reminders', icon: '🔔' },
    { key: 'lf-chatrooms', label: 'Chat History', icon: '💬' },
    { key: 'lf-forum', label: 'Forum Posts', icon: '🗣️' },
    { key: 'lf-challenges', label: 'Challenge History', icon: '⚔️' },
    { key: 'lf-focus-sessions', label: 'Focus Sessions', icon: '🎯' },
    { key: 'lf-exam-date', label: 'Exam Date', icon: '📅' },
    { key: 'lf-theme', label: 'Theme Preference', icon: '🎨' },
    { key: 'lf-auth', label: 'Auth Data', icon: '🔒' },
];

export default function ExportPage() {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<Set<string>>(new Set(DATA_KEYS.map(d => d.key)));
    const [exported, setExported] = useState(false);

    const toggleAll = () => {
        if (selected.size === DATA_KEYS.length) setSelected(new Set());
        else setSelected(new Set(DATA_KEYS.map(d => d.key)));
    };

    const toggle = (key: string) => {
        const s = new Set(selected);
        s.has(key) ? s.delete(key) : s.add(key);
        setSelected(s);
    };

    const exportData = () => {
        const data: Record<string, unknown> = {};
        const sessionKeys = new Set(['lf-auth', 'lf-profile']);
        selected.forEach(key => {
            const val = sessionKeys.has(key) ? sessionStorage.getItem(key) : localStorage.getItem(key);
            if (val) {
                try { data[key] = JSON.parse(val); } catch { data[key] = val; }
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `learnflow-export-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setExported(true);
        setTimeout(() => setExported(false), 3000);
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result as string);
                const sessionKeys = new Set(['lf-auth', 'lf-profile']);
                Object.entries(data).forEach(([key, value]) => {
                    const store = sessionKeys.has(key) ? sessionStorage : localStorage;
                    store.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
                });
                alert('✅ Data imported successfully! Refresh the page to see changes.');
            } catch {
                alert('❌ Invalid file format');
            }
        };
        reader.readAsText(file);
    };

    const getSize = (key: string) => {
        const sessionKeys = new Set(['lf-auth', 'lf-profile']);
        const val = sessionKeys.has(key) ? sessionStorage.getItem(key) : localStorage.getItem(key);
        if (!val) return '—';
        const bytes = new Blob([val]).size;
        return bytes > 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${bytes} B`;
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #22c55e, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">💾 Export & Import Data</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Download your data as JSON or import from a backup</p>
                </div>
            </div>

            {/* Select all */}
            <div className="flex items-center justify-between">
                <button onClick={toggleAll} className="text-xs font-semibold hover:underline" style={{ color: '#6366f1' }}>
                    {selected.size === DATA_KEYS.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{selected.size}/{DATA_KEYS.length} selected</span>
            </div>

            {/* Data items */}
            <div className="space-y-1.5">
                {DATA_KEYS.map(d => {
                    const sessionKeys = new Set(['lf-auth', 'lf-profile']);
                    const hasData = !!(sessionKeys.has(d.key) ? sessionStorage.getItem(d.key) : localStorage.getItem(d.key));
                    return (
                        <button key={d.key} onClick={() => toggle(d.key)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/5"
                            style={{
                                background: selected.has(d.key) ? 'rgba(99,102,241,0.08)' : 'transparent',
                                border: `1px solid ${selected.has(d.key) ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                                opacity: hasData ? 1 : 0.4,
                            }}>
                            <div className="w-5 h-5 rounded border-2 flex items-center justify-center text-xs shrink-0"
                                style={{ borderColor: selected.has(d.key) ? '#6366f1' : 'var(--border)', background: selected.has(d.key) ? '#6366f1' : 'transparent', color: 'white' }}>
                                {selected.has(d.key) ? '✓' : ''}
                            </div>
                            <span className="text-base">{d.icon}</span>
                            <span className="text-sm flex-1">{d.label}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{getSize(d.key)}</span>
                        </button>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button onClick={exportData} disabled={selected.size === 0}
                    className="py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-40"
                    style={{
                        background: exported ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #6366f1, #22d3ee)',
                        color: exported ? '#22c55e' : 'white',
                        border: exported ? '1px solid #22c55e44' : 'none',
                    }}>
                    {exported ? '✓ Downloaded!' : '📥 Export JSON'}
                </button>
                <label className="py-3 rounded-xl text-sm font-semibold text-center cursor-pointer transition-all hover:scale-[1.02]"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                    📤 Import JSON
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
            </div>
        </div>
    );
}
