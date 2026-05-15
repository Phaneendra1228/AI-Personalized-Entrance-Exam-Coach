'use client';

import { useState, useEffect } from 'react';

interface Badge { id: string; name: string; icon: string; desc: string; requirement: number; type: string; }
const BADGES: Badge[] = [
    { id: 'first_test', name: 'First Steps', icon: '🌱', desc: 'Take your first test', requirement: 1, type: 'tests' },
    { id: 'five_tests', name: 'Getting Started', icon: '📝', desc: 'Complete 5 tests', requirement: 5, type: 'tests' },
    { id: 'ten_tests', name: 'Test Warrior', icon: '⚔️', desc: 'Complete 10 tests', requirement: 10, type: 'tests' },
    { id: 'streak_3', name: 'On Fire', icon: '🔥', desc: '3-day study streak', requirement: 3, type: 'streak' },
    { id: 'streak_7', name: 'Unstoppable', icon: '💪', desc: '7-day study streak', requirement: 7, type: 'streak' },
    { id: 'streak_30', name: 'Legend', icon: '👑', desc: '30-day study streak', requirement: 30, type: 'streak' },
    { id: 'acc_70', name: 'Sharp Mind', icon: '🧠', desc: 'Reach 70% accuracy', requirement: 70, type: 'accuracy' },
    { id: 'acc_90', name: 'Genius', icon: '🎓', desc: 'Reach 90% accuracy', requirement: 90, type: 'accuracy' },
    { id: 'acc_100', name: 'Perfection', icon: '💎', desc: 'Score 100% on a test', requirement: 100, type: 'perfect' },
    { id: 'notes_5', name: 'Note Taker', icon: '📒', desc: 'Write 5 notes', requirement: 5, type: 'notes' },
    { id: 'flashcards', name: 'Card Master', icon: '🃏', desc: 'Study 20 flashcards', requirement: 20, type: 'flashcards' },
    { id: 'social', name: 'Social Butterfly', icon: '🦋', desc: 'Post in the forum', requirement: 1, type: 'forum' },
];

const XP_PER_LEVEL = 500;
const XP_ACTIONS: Record<string, number> = {
    test_complete: 100,
    perfect_score: 250,
    daily_quiz: 50,
    flashcard_session: 30,
    forum_post: 20,
    study_streak: 40,
    challenge_win: 75,
};

export default function AchievementsPage() {
    const [xp, setXp] = useState(0);
    const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set());

    useEffect(() => {
        const savedXp = localStorage.getItem('lf-xp');
        const savedBadges = localStorage.getItem('lf-badges');
        if (savedXp) setXp(parseInt(savedXp));
        if (savedBadges) setUnlockedBadges(new Set(JSON.parse(savedBadges)));

        // Auto-calculate some badges from localStorage data
        const auto = new Set<string>();
        const streak = localStorage.getItem('lf-streak');
        if (streak) {
            const data = JSON.parse(streak);
            const days = Object.keys(data).length;
            if (days >= 1) auto.add('first_test');
            if (days >= 3) auto.add('streak_3');
            if (days >= 7) auto.add('streak_7');
        }
        const notes = localStorage.getItem('lf-notes');
        if (notes && JSON.parse(notes).length >= 5) auto.add('notes_5');
        const forum = localStorage.getItem('lf-forum');
        if (forum) {
            const posts = JSON.parse(forum);
            if (posts.some((p: { user: string }) => p.user === 'You')) auto.add('social');
        }

        if (auto.size > 0) {
            setUnlockedBadges(prev => {
                const merged = new Set([...prev, ...auto]);
                localStorage.setItem('lf-badges', JSON.stringify([...merged]));
                return merged;
            });
            // Award XP for newly unlocked badges
            const newXp = auto.size * 50;
            setXp(prev => {
                const total = prev + newXp;
                localStorage.setItem('lf-xp', total.toString());
                return total;
            });
        }
    }, []);

    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const xpInLevel = xp % XP_PER_LEVEL;
    const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #f59e0b, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">🎖️ Achievements & XP</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Earn badges and level up by studying!</p>
                </div>
            </div>

            {/* XP & Level Card */}
            <div className="glass p-6 rounded-xl" style={{ borderLeft: '3px solid #f59e0b' }}>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white' }}>
                        {level}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-bold">Level {level}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{xpInLevel}/{XP_PER_LEVEL} XP</span>
                        </div>
                        <div className="h-3 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                            <div className="h-3 rounded-full transition-all duration-700"
                                style={{ width: `${xpProgress}%`, background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }} />
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                            Total XP: {xp} · {XP_PER_LEVEL - xpInLevel} XP to next level
                        </div>
                    </div>
                </div>
            </div>

            {/* XP actions guide */}
            <div className="glass p-4 rounded-xl">
                <h3 className="font-semibold text-sm mb-2">✨ How to earn XP</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(XP_ACTIONS).map(([action, points]) => (
                        <div key={action} className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-primary)' }}>
                            <div className="text-sm font-bold" style={{ color: '#f59e0b' }}>+{points}</div>
                            <div className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{action.replace(/_/g, ' ')}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Badges Grid */}
            <div>
                <h3 className="font-semibold text-sm mb-3">🏅 Badges ({unlockedBadges.size}/{BADGES.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {BADGES.map(badge => {
                        const unlocked = unlockedBadges.has(badge.id);
                        return (
                            <div key={badge.id} className="glass p-4 rounded-xl text-center transition-all hover:scale-105"
                                style={{ opacity: unlocked ? 1 : 0.4, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                                <div className="text-3xl mb-2">{badge.icon}</div>
                                <div className="text-xs font-bold mb-0.5">{badge.name}</div>
                                <div className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{badge.desc}</div>
                                {unlocked && <div className="text-xs mt-1" style={{ color: '#22c55e' }}>✓ Unlocked</div>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
