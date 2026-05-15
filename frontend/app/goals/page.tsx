'use client';

import { useState, useEffect, useCallback } from 'react';

interface Goal { id: string; title: string; target: string; category: string; progress: number; total: number; createdAt: string; completed: boolean; }

const CATEGORIES = ['Academics', 'Practice', 'Revision', 'Reading', 'Custom'];
const PRESETS = [
    { title: 'Master Calculus', target: 'Complete 50 problems', category: 'Academics', total: 50 },
    { title: 'Daily Quiz Streak', target: '7-day quiz streak', category: 'Practice', total: 7 },
    { title: 'Revise All Chapters', target: 'Cover 20 chapters', category: 'Revision', total: 20 },
    { title: 'Read NCERT', target: 'Read 30 chapters', category: 'Reading', total: 30 },
];

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState('');
    const [category, setCategory] = useState('Academics');
    const [total, setTotal] = useState(10);

    useEffect(() => {
        const saved = localStorage.getItem('lf-goals');
        if (saved) setGoals(JSON.parse(saved));
    }, []);

    const save = useCallback((g: Goal[]) => { setGoals(g); localStorage.setItem('lf-goals', JSON.stringify(g)); }, []);

    const addGoal = (preset?: typeof PRESETS[0]) => {
        const g: Goal = {
            id: Date.now().toString(),
            title: preset?.title || title,
            target: preset?.target || target,
            category: preset?.category || category,
            progress: 0,
            total: preset?.total || total,
            createdAt: new Date().toISOString(),
            completed: false,
        };
        save([g, ...goals]);
        setTitle(''); setTarget(''); setShowForm(false);
    };

    const increment = (id: string) => {
        save(goals.map(g => {
            if (g.id !== id) return g;
            const p = Math.min(g.progress + 1, g.total);
            return { ...g, progress: p, completed: p >= g.total };
        }));
    };

    const remove = (id: string) => save(goals.filter(g => g.id !== id));

    const activeGoals = goals.filter(g => !g.completed);
    const completedGoals = goals.filter(g => g.completed);

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #22c55e, transparent 60%)' }} />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">🎯 Goal Tracker</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Set targets and track your progress</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>+ New Goal</button>
                </div>
            </div>

            {/* Quick presets */}
            <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((p, i) => (
                    <button key={i} onClick={() => addGoal(p)}
                        className="glass p-3 rounded-xl text-left hover:scale-[1.01] transition-all text-xs"
                        style={{ borderLeft: '2px solid #6366f1' }}>
                        <div className="font-semibold">{p.title}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{p.target}</div>
                    </button>
                ))}
            </div>

            {/* Custom form */}
            {showForm && (
                <div className="glass p-5 rounded-xl space-y-3" style={{ borderLeft: '3px solid #22c55e' }}>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Goal title..."
                        className="w-full px-3 py-2 rounded-lg text-sm bg-transparent outline-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <input value={target} onChange={e => setTarget(e.target.value)} placeholder="Target description..."
                        className="w-full px-3 py-2 rounded-lg text-sm bg-transparent outline-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <div className="flex gap-3">
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg text-sm bg-transparent outline-none" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="number" value={total} onChange={e => setTotal(Number(e.target.value))} min={1} max={1000}
                            className="w-20 px-3 py-2 rounded-lg text-sm bg-transparent outline-none text-center" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <button onClick={() => addGoal()} className="w-full py-2 rounded-lg text-sm font-semibold" style={{ background: '#22c55e', color: 'white' }}>Add Goal</button>
                </div>
            )}

            {/* Active goals */}
            {activeGoals.length > 0 && (
                <div>
                    <h3 className="font-semibold text-sm mb-3">🏃 Active Goals ({activeGoals.length})</h3>
                    <div className="space-y-3">
                        {activeGoals.map(g => {
                            const pct = (g.progress / g.total) * 100;
                            return (
                                <div key={g.id} className="glass p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <div className="text-sm font-semibold">{g.title}</div>
                                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{g.target}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => increment(g.id)} className="px-3 py-1 rounded-lg text-xs font-semibold hover:scale-105 transition-all"
                                                style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e44' }}>+1</button>
                                            <button onClick={() => remove(g.id)} className="text-xs opacity-50 hover:opacity-100" style={{ color: '#ef4444' }}>🗑</button>
                                        </div>
                                    </div>
                                    <div className="h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                                        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct >= 100 ? '#22c55e' : '#6366f1' }} />
                                    </div>
                                    <div className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{g.progress}/{g.total}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Completed */}
            {completedGoals.length > 0 && (
                <div>
                    <h3 className="font-semibold text-sm mb-3">✅ Completed ({completedGoals.length})</h3>
                    <div className="space-y-2">
                        {completedGoals.map(g => (
                            <div key={g.id} className="glass p-3 rounded-xl flex items-center justify-between" style={{ opacity: 0.7 }}>
                                <div className="text-sm"><span style={{ color: '#22c55e' }}>✓</span> {g.title}</div>
                                <button onClick={() => remove(g.id)} className="text-xs opacity-50 hover:opacity-100" style={{ color: '#ef4444' }}>🗑</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
