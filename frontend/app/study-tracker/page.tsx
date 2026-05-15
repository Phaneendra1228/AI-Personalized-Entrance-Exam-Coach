'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General'];

interface Session { date: string; subject: string; minutes: number; }

export default function StudyTrackerPage() {
    const [running, setRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [subject, setSubject] = useState('General');
    const [sessions, setSessions] = useState<Session[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('lf-study-sessions');
        if (saved) setSessions(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running]);

    const saveSession = useCallback(() => {
        if (seconds < 60) return; // min 1 minute
        const today = new Date().toISOString().slice(0, 10);
        const mins = Math.round(seconds / 60);
        const updated = [...sessions, { date: today, subject, minutes: mins }];
        setSessions(updated);
        localStorage.setItem('lf-study-sessions', JSON.stringify(updated));
        setSeconds(0);
        setRunning(false);
    }, [seconds, subject, sessions]);

    const fmt = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    // Weekly heatmap (last 7 days)
    const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        const key = d.toISOString().slice(0, 10);
        const dayMins = sessions.filter(s => s.date === key).reduce((sum, s) => sum + s.minutes, 0);
        return { key, day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()], mins: dayMins };
    });

    const todayTotal = last7[6]?.mins || 0;
    const weekTotal = last7.reduce((s, d) => s + d.mins, 0);
    const bestDay = Math.max(...last7.map(d => d.mins), 0);

    // Subject breakdown (all time)
    const subjectBreakdown = SUBJECTS.map(s => ({
        subject: s,
        mins: sessions.filter(sess => sess.subject === s).reduce((sum, sess) => sum + sess.minutes, 0),
    })).filter(s => s.mins > 0).sort((a, b) => b.mins - a.mins);

    const totalAllTime = sessions.reduce((s, sess) => s + sess.minutes, 0);

    const heatColor = (mins: number) => {
        if (mins === 0) return 'var(--bg-primary)';
        if (mins < 30) return '#6366f144';
        if (mins < 60) return '#6366f188';
        if (mins < 120) return '#6366f1bb';
        return '#6366f1';
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #22d3ee, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">⏱️ Study Session Tracker</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Track your study time and build consistency</p>
                </div>
            </div>

            {/* Live Timer */}
            <div className="glass p-6 rounded-xl text-center" style={{ borderLeft: '3px solid #22d3ee' }}>
                <div className="text-5xl font-bold font-mono mb-4" style={{ color: running ? '#22d3ee' : 'var(--text-primary)' }}>
                    {fmt(seconds)}
                </div>

                <div className="flex justify-center gap-2 mb-4">
                    {SUBJECTS.map(s => (
                        <button key={s} onClick={() => !running && setSubject(s)}
                            className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                            style={{
                                background: subject === s ? 'rgba(34,211,238,0.2)' : 'var(--bg-primary)',
                                color: subject === s ? '#22d3ee' : 'var(--text-muted)',
                                border: `1px solid ${subject === s ? '#22d3ee44' : 'var(--border)'}`,
                                opacity: running && subject !== s ? 0.3 : 1,
                            }}>{s}</button>
                    ))}
                </div>

                <div className="flex justify-center gap-3">
                    <button onClick={() => setRunning(!running)}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                        style={{
                            background: running ? 'rgba(239,68,68,0.2)' : 'linear-gradient(135deg, #22d3ee, #6366f1)',
                            color: running ? '#ef4444' : 'white',
                            border: running ? '1px solid #ef444444' : 'none',
                        }}>{running ? '⏸ Pause' : '▶ Start Studying'}</button>
                    {seconds > 60 && (
                        <button onClick={saveSession}
                            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                            style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid #22c55e44' }}>
                            ✓ Save Session ({Math.round(seconds / 60)}m)
                        </button>
                    )}
                    {seconds > 0 && !running && (
                        <button onClick={() => setSeconds(0)}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>↻ Reset</button>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Today', value: `${todayTotal}m`, color: '#22d3ee', icon: '📅' },
                    { label: 'This Week', value: `${weekTotal}m`, color: '#6366f1', icon: '📊' },
                    { label: 'All Time', value: totalAllTime >= 60 ? `${Math.floor(totalAllTime / 60)}h ${totalAllTime % 60}m` : `${totalAllTime}m`, color: '#f59e0b', icon: '⏳' },
                ].map(s => (
                    <div key={s.label} className="glass p-4 text-center rounded-xl">
                        <div className="text-xl mb-1">{s.icon}</div>
                        <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Weekly Heatmap */}
            <div className="glass p-5 rounded-xl">
                <h3 className="font-semibold text-sm mb-4">🗓️ This Week</h3>
                <div className="grid grid-cols-7 gap-2">
                    {last7.map(d => (
                        <div key={d.key} className="text-center">
                            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{d.day}</div>
                            <div className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                                style={{ background: heatColor(d.mins), color: d.mins > 0 ? '#fff' : 'var(--text-muted)' }}>
                                {d.mins > 0 ? `${d.mins}m` : '—'}
                            </div>
                        </div>
                    ))}
                </div>
                {bestDay > 0 && (
                    <div className="text-xs mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                        🏆 Best day this week: <strong style={{ color: '#f59e0b' }}>{bestDay} min</strong>
                    </div>
                )}
            </div>

            {/* Subject Breakdown */}
            {subjectBreakdown.length > 0 && (
                <div className="glass p-5 rounded-xl">
                    <h3 className="font-semibold text-sm mb-3">📚 Subject-wise Time</h3>
                    <div className="space-y-3">
                        {subjectBreakdown.map((s, i) => {
                            const pct = totalAllTime ? (s.mins / totalAllTime) * 100 : 0;
                            const colors = ['#6366f1', '#22d3ee', '#f59e0b', '#22c55e', '#ef4444'];
                            const color = colors[i % colors.length];
                            return (
                                <div key={s.subject}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>{s.subject}</span>
                                        <span style={{ color }}>{s.mins >= 60 ? `${Math.floor(s.mins / 60)}h ${s.mins % 60}m` : `${s.mins}m`} ({Math.round(pct)}%)</span>
                                    </div>
                                    <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                                        <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
