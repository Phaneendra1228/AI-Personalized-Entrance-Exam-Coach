'use client';

import { useState, useEffect, useCallback } from 'react';

interface Bookmark { id: string; question: string; correctAnswer: string; yourAnswer: string; topic: string; date: string; notes: string; }

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const saved = localStorage.getItem('lf-bookmarks');
        if (saved) setBookmarks(JSON.parse(saved));
        else {
            // Seed with example bookmarks
            const seeds: Bookmark[] = [
                { id: '1', question: 'What is the derivative of ln(x)?', correctAnswer: '1/x', yourAnswer: 'x', topic: 'Calculus', date: new Date().toISOString(), notes: 'Remember: d/dx ln(x) = 1/x, not x!' },
                { id: '2', question: 'Which law relates F, m, and a?', correctAnswer: "Newton's Second Law", yourAnswer: "Newton's Third Law", topic: 'Mechanics', date: new Date().toISOString(), notes: 'F = ma is the Second Law, not the Third.' },
                { id: '3', question: 'What is the pH of a neutral solution?', correctAnswer: '7', yourAnswer: '0', topic: 'Chemistry', date: new Date().toISOString(), notes: 'pH 0 is extremely acidic, pH 7 is neutral.' },
            ];
            setBookmarks(seeds);
            localStorage.setItem('lf-bookmarks', JSON.stringify(seeds));
        }
    }, []);

    const save = useCallback((b: Bookmark[]) => {
        setBookmarks(b);
        localStorage.setItem('lf-bookmarks', JSON.stringify(b));
    }, []);

    const remove = (id: string) => save(bookmarks.filter(b => b.id !== id));

    const updateNotes = (id: string, notes: string) => {
        save(bookmarks.map(b => b.id === id ? { ...b, notes } : b));
    };

    const topics = ['All', ...Array.from(new Set(bookmarks.map(b => b.topic)))];
    const filtered = filter === 'All' ? bookmarks : bookmarks.filter(b => b.topic === filter);

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #ef4444, transparent 60%)' }} />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">🔖 Bookmarked Questions</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Questions you got wrong — review and master them!</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                        {bookmarks.length} saved
                    </span>
                </div>
            </div>

            {/* Topic filter */}
            <div className="flex flex-wrap gap-2">
                {topics.map(t => (
                    <button key={t} onClick={() => setFilter(t)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                            background: filter === t ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)',
                            border: filter === t ? '1px solid #6366f1' : '1px solid var(--border)',
                            color: filter === t ? '#6366f1' : 'var(--text-muted)',
                        }}>{t}</button>
                ))}
            </div>

            {/* Bookmarked questions */}
            {filtered.length === 0 ? (
                <div className="glass p-10 text-center rounded-2xl">
                    <div className="text-5xl mb-3">🔖</div>
                    <p style={{ color: 'var(--text-muted)' }}>No bookmarked questions yet. Wrong answers will appear here automatically!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(b => (
                        <div key={b.id} className="glass p-5 rounded-xl" style={{ borderLeft: '3px solid #ef4444' }}>
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>{b.topic}</span>
                                <button onClick={() => remove(b.id)} className="text-xs opacity-50 hover:opacity-100" style={{ color: '#ef4444' }}>🗑 Remove</button>
                            </div>
                            <div className="font-medium text-sm mb-3">{b.question}</div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="p-2 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.1)', borderLeft: '2px solid #ef4444' }}>
                                    <div className="font-semibold" style={{ color: '#ef4444' }}>Your answer</div>
                                    <div>{b.yourAnswer}</div>
                                </div>
                                <div className="p-2 rounded-lg text-xs" style={{ background: 'rgba(34,197,94,0.1)', borderLeft: '2px solid #22c55e' }}>
                                    <div className="font-semibold" style={{ color: '#22c55e' }}>Correct answer</div>
                                    <div>{b.correctAnswer}</div>
                                </div>
                            </div>
                            <textarea value={b.notes} onChange={e => updateNotes(b.id, e.target.value)}
                                placeholder="Add personal notes..."
                                rows={2} className="w-full px-3 py-2 rounded-lg text-xs bg-transparent resize-none outline-none"
                                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
