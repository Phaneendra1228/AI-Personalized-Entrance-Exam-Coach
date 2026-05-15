'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/api';
import type { Analytics } from '@/lib/types';

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

export default function HistoryPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalytics(STUDENT_ID)
            .then(setAnalytics)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const attempts = analytics?.recent_attempts || [];
    const maxScore = Math.max(...attempts.map(a => a.percentage), 100);

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #22d3ee, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">📜 Test History</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                        Track your progress over time with detailed attempt analysis
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-xl shimmer" />)}
                </div>
            ) : attempts.length === 0 ? (
                <div className="glass p-10 text-center rounded-2xl">
                    <div className="text-5xl mb-3">📝</div>
                    <p style={{ color: 'var(--text-muted)' }}>No test attempts yet. Take a mock test to see your history here!</p>
                </div>
            ) : (
                <>
                    {/* Accuracy Trend Chart (CSS-only) */}
                    <div className="glass p-5 rounded-xl">
                        <h3 className="font-semibold text-sm mb-4">📈 Accuracy Trend</h3>
                        <div className="flex items-end gap-2 h-40">
                            {attempts.slice().reverse().map((a, i) => {
                                const h = (a.percentage / maxScore) * 100;
                                const color = a.percentage >= 70 ? '#22c55e' : a.percentage >= 50 ? '#f59e0b' : '#ef4444';
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs font-bold" style={{ color }}>{a.percentage}%</span>
                                        <div className="w-full rounded-t-lg transition-all duration-700"
                                            style={{ height: `${h}%`, background: `linear-gradient(to top, ${color}44, ${color})`, minHeight: '8px' }} />
                                        <span className="text-xs truncate w-full text-center" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>
                                            {new Date(a.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Total Tests', value: analytics?.total_tests_taken ?? 0, color: '#6366f1', icon: '📝' },
                            { label: 'Avg Accuracy', value: `${analytics?.overall_accuracy ?? 0}%`, color: '#22d3ee', icon: '🎯' },
                            { label: 'Best Score', value: `${Math.max(...attempts.map(a => a.percentage))}%`, color: '#22c55e', icon: '🏆' },
                        ].map(s => (
                            <div key={s.label} className="glass p-4 text-center rounded-xl">
                                <div className="text-xl mb-1">{s.icon}</div>
                                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Detailed attempt list */}
                    <div>
                        <h3 className="font-semibold text-sm mb-3">All Attempts</h3>
                        <div className="space-y-3">
                            {attempts.map((a) => {
                                const color = a.percentage >= 70 ? '#22c55e' : a.percentage >= 50 ? '#f59e0b' : '#ef4444';
                                return (
                                    <div key={a.attempt_id} className="glass p-4 rounded-xl" style={{ borderLeft: `3px solid ${color}` }}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-sm">{a.test_name}</div>
                                                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                                    {new Date(a.created_at).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold">{a.score}/{a.total}</div>
                                                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}22`, color }}>
                                                    {a.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                        {/* Score bar */}
                                        <div className="mt-3 h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                                            <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${a.percentage}%`, background: color }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
