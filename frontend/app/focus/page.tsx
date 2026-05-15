'use client';

import { useState, useEffect } from 'react';

export default function FocusModePage() {
    const [task, setTask] = useState('');
    const [active, setActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [sessions, setSessions] = useState<{ task: string; duration: number; date: string }[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('lf-focus-sessions');
        if (saved) setSessions(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (!active) return;
        const id = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(id);
    }, [active]);

    const start = () => {
        if (!task.trim()) return;
        setActive(true);
        setSeconds(0);
    };

    const stop = () => {
        setActive(false);
        const session = { task, duration: seconds, date: new Date().toISOString() };
        const updated = [session, ...sessions].slice(0, 20);
        setSessions(updated);
        localStorage.setItem('lf-focus-sessions', JSON.stringify(updated));
        setTask('');
        setSeconds(0);
    };

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (active) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center"
                style={{ background: 'var(--bg-primary)' }}>
                <div className="text-center slide-in">
                    {/* Breathing circle */}
                    <div className="relative mx-auto mb-8" style={{ width: '200px', height: '200px' }}>
                        <div className="absolute inset-0 rounded-full opacity-20"
                            style={{ background: '#6366f1', animation: 'pulse-dot 4s ease-in-out infinite' }} />
                        <div className="absolute inset-4 rounded-full opacity-30"
                            style={{ background: '#6366f1', animation: 'pulse-dot 4s ease-in-out infinite 0.5s' }} />
                        <div className="absolute inset-8 rounded-full flex items-center justify-center"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '2px solid rgba(99,102,241,0.3)' }}>
                            <div>
                                <div className="text-3xl font-mono font-bold" style={{ color: '#6366f1' }}>
                                    {hrs > 0 && `${hrs}:`}{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-1">🎯 Focused on:</h2>
                    <p className="text-lg mb-8" style={{ color: '#6366f1' }}>{task}</p>

                    <button onClick={stop}
                        className="px-8 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                        style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid #ef444444' }}>
                        ⏹ End Focus Session
                    </button>

                    <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>Stay focused. Breathe. You got this. 💪</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #6366f1, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">🎯 Focus Mode</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Eliminate distractions and study with intention</p>
                </div>
            </div>

            {/* Start session */}
            <div className="glass p-6 rounded-xl space-y-4" style={{ borderLeft: '3px solid #6366f1' }}>
                <h3 className="font-semibold text-sm">What are you going to study?</h3>
                <input value={task} onChange={e => setTask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && start()}
                    placeholder="e.g., Calculus — Integration by parts"
                    className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                <button onClick={start} disabled={!task.trim()}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-40"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                    🚀 Start Focus Session
                </button>
            </div>

            {/* Past sessions */}
            {sessions.length > 0 && (
                <div>
                    <h3 className="font-semibold text-sm mb-3">Recent Sessions</h3>
                    <div className="space-y-2">
                        {sessions.slice(0, 10).map((s, i) => {
                            const m = Math.floor(s.duration / 60);
                            const sc = s.duration % 60;
                            return (
                                <div key={i} className="glass p-3 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium">{s.task}</div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(s.date).toLocaleDateString()}</div>
                                    </div>
                                    <span className="text-sm font-bold" style={{ color: '#6366f1' }}>{m}m {sc}s</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
