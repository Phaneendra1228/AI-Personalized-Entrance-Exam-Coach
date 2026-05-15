'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
    { title: 'Welcome to LearnFlow! 🎓', desc: 'Your AI-powered adaptive learning platform. Let us show you around!', icon: '🚀', color: '#6366f1' },
    { title: 'Smart Dashboard ⚡', desc: 'Your dashboard has Pomodoro timer, exam countdown, study streak, sticky notes, and daily quotes — all in one place.', icon: '📊', color: '#22d3ee' },
    { title: 'AI Coach 🤖', desc: 'Ask LearnBot anything — concepts, study plans, or motivation. It even supports voice input!', icon: '🎤', color: '#22c55e' },
    { title: 'Flashcards & Quizzes 🃏', desc: 'Study with flashcards across subjects, and take daily quiz challenges to test yourself.', icon: '⚡', color: '#f59e0b' },
    { title: 'Track Progress 📈', desc: 'View analytics, test history, predicted scores, and compete on the leaderboard.', icon: '🏆', color: '#ef4444' },
    { title: 'Social Learning 💬', desc: 'Join study rooms, post in forums, challenge friends, and earn badges & XP!', icon: '🎖️', color: '#8b5cf6' },
    { title: 'You\'re All Set! 🎉', desc: 'Start exploring and make every study session count. Press ? anytime for keyboard shortcuts.', icon: '✨', color: '#6366f1' },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(0);
    const router = useRouter();
    const s = STEPS[step];

    const finish = () => {
        localStorage.setItem('lf-onboarded', 'true');
        router.push('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-700"
                    style={{ background: s.color, top: '20%', left: '30%' }} />
            </div>

            <div className="relative w-full max-w-lg text-center slide-in" key={step}>
                {/* Progress */}
                <div className="flex gap-1.5 justify-center mb-8">
                    {STEPS.map((_, i) => (
                        <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                            style={{ width: i === step ? '32px' : '12px', background: i <= step ? s.color : 'var(--border)' }} />
                    ))}
                </div>

                {/* Icon */}
                <div className="text-7xl mb-6" style={{ filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))' }}>{s.icon}</div>

                {/* Content */}
                <h1 className="text-3xl font-bold mb-3">{s.title}</h1>
                <p className="text-base mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-3">
                    {step > 0 && (
                        <button onClick={() => setStep(step - 1)}
                            className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                            ← Back
                        </button>
                    )}
                    {step < STEPS.length - 1 ? (
                        <button onClick={() => setStep(step + 1)}
                            className="px-8 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${s.color}, #22d3ee)`, color: 'white' }}>
                            Next →
                        </button>
                    ) : (
                        <button onClick={finish}
                            className="px-8 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                            🚀 Get Started
                        </button>
                    )}
                </div>

                {step < STEPS.length - 1 && (
                    <button onClick={finish} className="mt-4 text-xs hover:underline" style={{ color: 'var(--text-muted)' }}>
                        Skip tour
                    </button>
                )}
            </div>
        </div>
    );
}
