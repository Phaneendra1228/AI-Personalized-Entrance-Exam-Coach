'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/api';
import type { Analytics } from '@/lib/types';

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

// Simulated class data
const CLASS_AVG: Record<string, number> = {
    Physics: 58, Chemistry: 62, Mathematics: 52, Biology: 65,
    Mechanics: 55, Optics: 60, 'Organic Chemistry': 48, Calculus: 45,
    Thermodynamics: 50, Electrostatics: 57, Algebra: 63, Genetics: 68,
};
const TOPPER: Record<string, number> = {
    Physics: 92, Chemistry: 88, Mathematics: 95, Biology: 90,
    Mechanics: 94, Optics: 91, 'Organic Chemistry': 87, Calculus: 96,
    Thermodynamics: 89, Electrostatics: 93, Algebra: 97, Genetics: 92,
};

export default function ComparePage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAnalytics(STUDENT_ID)
            .then(setAnalytics)
            .catch(() => null)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 rounded-xl shimmer" />)}
            </div>
        );
    }

    const topics = analytics?.topic_performance || [];
    const yourAccuracy = analytics?.overall_accuracy ?? 0;
    const classAvg = 58;
    const topperAvg = 92;

    const percentile = Math.min(99, Math.max(1, Math.round(
        (yourAccuracy / topperAvg) * 85 + (analytics?.total_tests_taken ?? 0) * 0.5
    )));

    const trend = topics.length >= 2
        ? topics.slice(0, Math.ceil(topics.length / 2)).reduce((s, t) => s + t.accuracy, 0) / Math.ceil(topics.length / 2) >
            topics.slice(Math.ceil(topics.length / 2)).reduce((s, t) => s + t.accuracy, 0) / Math.floor(topics.length / 2)
            ? 'improving' : 'declining'
        : 'neutral';

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #8b5cf6, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">📊 Performance Comparison</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>See how you stack up against peers and toppers</p>
                </div>
            </div>

            {!analytics ? (
                <div className="glass p-8 rounded-xl text-center">
                    <div className="text-4xl mb-3">📝</div>
                    <h2 className="text-lg font-bold mb-2">No Data Yet</h2>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Take some tests first to see your comparison!</p>
                </div>
            ) : (
                <>
                    {/* Overall Comparison */}
                    <div className="glass p-5 rounded-xl">
                        <h3 className="font-semibold text-sm mb-4">🎯 Overall Accuracy Comparison</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'You', value: yourAccuracy, color: '#6366f1', icon: '👤' },
                                { label: 'Class Average', value: classAvg, color: '#f59e0b', icon: '👥' },
                                { label: 'Topper', value: topperAvg, color: '#22c55e', icon: '🏆' },
                            ].map(item => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="flex items-center gap-1.5"><span>{item.icon}</span> {item.label}</span>
                                        <span className="font-bold" style={{ color: item.color }}>{item.value}%</span>
                                    </div>
                                    <div className="h-4 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                                        <div className="h-4 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                                            style={{ width: `${item.value}%`, background: `linear-gradient(90deg, ${item.color}88, ${item.color})` }}>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Percentile & Trend */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass p-5 rounded-xl text-center">
                            <div className="text-3xl mb-2">📈</div>
                            <div className="text-3xl font-bold" style={{ color: '#6366f1' }}>{percentile}<sup className="text-sm">th</sup></div>
                            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Estimated Percentile</div>
                            <div className="mt-2 px-2 py-1 rounded-full text-xs inline-block" style={{
                                background: percentile >= 80 ? 'rgba(34,197,94,0.15)' : percentile >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                color: percentile >= 80 ? '#22c55e' : percentile >= 50 ? '#f59e0b' : '#ef4444',
                            }}>{percentile >= 80 ? 'Excellent' : percentile >= 50 ? 'Good' : 'Needs Work'}</div>
                        </div>

                        <div className="glass p-5 rounded-xl text-center">
                            <div className="text-3xl mb-2">{trend === 'improving' ? '📈' : trend === 'declining' ? '📉' : '➡️'}</div>
                            <div className="text-lg font-bold capitalize" style={{
                                color: trend === 'improving' ? '#22c55e' : trend === 'declining' ? '#ef4444' : '#f59e0b'
                            }}>{trend}</div>
                            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Performance Trend</div>
                            <div className="mt-2 px-2 py-1 rounded-full text-xs inline-block" style={{
                                background: trend === 'improving' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
                                color: trend === 'improving' ? '#22c55e' : '#f59e0b',
                            }}>{trend === 'improving' ? 'Keep it up!' : 'Focus more!'}</div>
                        </div>
                    </div>

                    {/* Topic-wise Comparison */}
                    <div className="glass p-5 rounded-xl">
                        <h3 className="font-semibold text-sm mb-4">📚 Topic-wise Comparison</h3>
                        <div className="space-y-4">
                            {topics.slice(0, 8).map(tp => {
                                const avg = CLASS_AVG[tp.topic] || 55;
                                const top = TOPPER[tp.topic] || 90;
                                return (
                                    <div key={tp.topic} className="p-3 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
                                        <div className="text-xs font-semibold mb-2">{tp.topic}</div>
                                        <div className="space-y-1.5">
                                            {[
                                                { label: 'You', val: tp.accuracy, color: '#6366f1' },
                                                { label: 'Avg', val: avg, color: '#f59e0b' },
                                                { label: 'Top', val: top, color: '#22c55e' },
                                            ].map(row => (
                                                <div key={row.label} className="flex items-center gap-2">
                                                    <span className="text-xs w-8 shrink-0" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                                                    <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                                                        <div className="h-2 rounded-full" style={{ width: `${row.val}%`, background: row.color }} />
                                                    </div>
                                                    <span className="text-xs w-10 text-right font-bold" style={{ color: row.color }}>{row.val}%</span>
                                                </div>
                                            ))}
                                        </div>
                                        {tp.accuracy < avg && (
                                            <div className="mt-2 text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                                💡 Below average — Focus on this topic!
                                            </div>
                                        )}
                                        {tp.accuracy >= top * 0.9 && (
                                            <div className="mt-2 text-xs px-2 py-1 rounded" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                                                🌟 Near topper level — Great work!
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Improvement Suggestions */}
                    <div className="glass p-5 rounded-xl" style={{ borderLeft: '3px solid #8b5cf6' }}>
                        <h3 className="font-semibold text-sm mb-3">💡 How to Improve</h3>
                        <div className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                            {topics.filter(t => t.accuracy < 60).slice(0, 3).map(t => (
                                <div key={t.topic} className="flex items-start gap-2">
                                    <span className="text-sm shrink-0">📌</span>
                                    <span><strong style={{ color: 'var(--text-primary)' }}>{t.topic}</strong> ({t.accuracy}%) — Practice more problems and review concepts. Aim for {Math.min(t.accuracy + 20, 100)}%.</span>
                                </div>
                            ))}
                            {topics.filter(t => t.accuracy >= 60 && t.accuracy < 80).slice(0, 2).map(t => (
                                <div key={t.topic} className="flex items-start gap-2">
                                    <span className="text-sm shrink-0">📗</span>
                                    <span><strong style={{ color: 'var(--text-primary)' }}>{t.topic}</strong> ({t.accuracy}%) — Good progress! Focus on advanced problems to push to 90%+.</span>
                                </div>
                            ))}
                            {yourAccuracy < 50 && (
                                <div className="flex items-start gap-2 mt-2 p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)' }}>
                                    <span>⚠️</span>
                                    <span>Your overall accuracy is below 50%. Consider revising fundamentals and taking topic-wise tests.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
