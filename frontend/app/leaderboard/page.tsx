'use client';

import { useEffect, useState } from 'react';
import { getAnalytics } from '@/lib/api';
import type { Analytics } from '@/lib/types';

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

// Simulated competitors
const MOCK_STUDENTS = [
    { name: 'Arjun K.', score: 92, avatar: '🧑‍🎓', trend: '+3' },
    { name: 'Priya S.', score: 88, avatar: '👩‍🎓', trend: '+1' },
    { name: 'Rahul M.', score: 85, avatar: '🧑‍💻', trend: '+5' },
    { name: 'Sneha D.', score: 82, avatar: '👩‍🔬', trend: '-2' },
    { name: 'Vikram R.', score: 78, avatar: '🧑‍🏫', trend: '+2' },
    { name: 'Ananya P.', score: 75, avatar: '👩‍💼', trend: '0' },
    { name: 'Karthik B.', score: 72, avatar: '🧑‍🔧', trend: '-1' },
    { name: 'Meera L.', score: 68, avatar: '👩‍⚕️', trend: '+4' },
];

export default function LeaderboardPage() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);

    useEffect(() => {
        getAnalytics(STUDENT_ID).then(setAnalytics).catch(console.error);
    }, []);

    const myScore = analytics?.overall_accuracy ?? 70;
    const allStudents = [
        ...MOCK_STUDENTS,
        { name: 'You', score: myScore, avatar: '⭐', trend: '+2' },
    ].sort((a, b) => b.score - a.score);

    const myRank = allStudents.findIndex(s => s.name === 'You') + 1;

    const medalEmoji = (rank: number) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #f59e0b, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">🏆 Leaderboard</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>See how you stack up against other students</p>
                </div>
            </div>

            {/* Your rank card */}
            <div className="glass p-6 rounded-xl text-center" style={{ borderLeft: '3px solid #6366f1' }}>
                <div className="text-lg font-bold mb-1">Your Rank: #{myRank}</div>
                <div className="text-3xl font-bold" style={{ color: '#6366f1' }}>{myScore}%</div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Overall Accuracy</p>
            </div>

            {/* Leaderboard list */}
            <div className="glass overflow-hidden rounded-xl">
                {allStudents.map((student, i) => {
                    const rank = i + 1;
                    const isMe = student.name === 'You';
                    return (
                        <div key={student.name}
                            className="flex items-center gap-4 px-5 py-4 transition-all hover:bg-white/5"
                            style={{
                                borderBottom: '1px solid var(--border)',
                                background: isMe ? 'rgba(99,102,241,0.08)' : 'transparent',
                            }}>
                            {/* Rank */}
                            <div className="w-8 text-center">
                                {rank <= 3 ? (
                                    <span className="text-xl">{medalEmoji(rank)}</span>
                                ) : (
                                    <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>#{rank}</span>
                                )}
                            </div>
                            {/* Avatar */}
                            <div className="text-2xl">{student.avatar}</div>
                            {/* Name */}
                            <div className="flex-1">
                                <div className={`text-sm font-semibold ${isMe ? 'gradient-text' : ''}`}>
                                    {student.name} {isMe && '(You)'}
                                </div>
                            </div>
                            {/* Score bar */}
                            <div className="w-32 hidden sm:block">
                                <div className="h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                                    <div className="h-2 rounded-full transition-all duration-700"
                                        style={{ width: `${student.score}%`, background: isMe ? '#6366f1' : rank <= 3 ? '#f59e0b' : 'var(--text-muted)' }} />
                                </div>
                            </div>
                            {/* Score */}
                            <div className="text-right">
                                <div className="text-sm font-bold" style={{ color: isMe ? '#6366f1' : 'var(--text-primary)' }}>
                                    {student.score}%
                                </div>
                                <div className="text-xs" style={{ color: student.trend.startsWith('+') ? '#22c55e' : student.trend.startsWith('-') ? '#ef4444' : 'var(--text-muted)' }}>
                                    {student.trend}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Disclaimer */}
            <div className="glass p-3 rounded-xl text-center" style={{ border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>⚠️ Leaderboard includes simulated data for demonstration purposes</p>
            </div>
        </div>
    );
}
