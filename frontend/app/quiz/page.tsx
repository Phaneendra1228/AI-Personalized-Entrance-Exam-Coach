'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';

const QUIZ_QUESTIONS = [
    { q: 'What is the derivative of ln(x)?', options: ['1/x', 'x', 'eˣ', 'ln(x)'], correct: 0 },
    { q: 'Which law states F = ma?', options: ['First Law', 'Second Law', 'Third Law', 'Gravity'], correct: 1 },
    { q: 'What is the pH of a neutral solution?', options: ['0', '7', '14', '1'], correct: 1 },
    { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi'], correct: 2 },
    { q: 'What is the SI unit of electric current?', options: ['Volt', 'Ohm', 'Watt', 'Ampere'], correct: 3 },
    { q: 'What is sin(90°)?', options: ['0', '0.5', '1', '√2'], correct: 2 },
    { q: 'Which gas is most abundant in atmosphere?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Argon'], correct: 2 },
    { q: 'What is the atomic number of Hydrogen?', options: ['0', '1', '2', '8'], correct: 1 },
    { q: 'What is acceleration due to gravity (g)?', options: ['9.8 m/s²', '10 m/s', '3×10⁸ m/s', '6.67×10⁻¹¹'], correct: 0 },
    { q: 'What is the chemical formula of salt?', options: ['NaOH', 'HCl', 'NaCl', 'KCl'], correct: 2 },
    { q: 'What is the integral of 1/x?', options: ['x²', 'eˣ', 'ln|x| + C', '1/x²'], correct: 2 },
    { q: 'What organelle performs photosynthesis?', options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Lysosome'], correct: 2 },
    { q: 'What is Ohm\'s Law?', options: ['V = IR', 'F = ma', 'E = mc²', 'PV = nRT'], correct: 0 },
    { q: 'What is the value of π (approx)?', options: ['2.718', '3.14159', '1.618', '1.414'], correct: 1 },
    { q: 'Which vitamin is produced by sunlight?', options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], correct: 3 },
];

function getTodaysSeed() {
    return Math.floor(Date.now() / 86400000);
}

function shuffle(arr: typeof QUIZ_QUESTIONS, seed: number) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = (seed * (i + 1) * 7919) % (i + 1);
        [a[i], a[j < 0 ? 0 : j]] = [a[j < 0 ? 0 : j], a[i]];
    }
    return a.slice(0, 5);
}

export default function QuizPage() {
    const { t } = useTranslation();
    const [questions] = useState(() => shuffle(QUIZ_QUESTIONS, getTodaysSeed()));
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(Array(5).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 min

    useEffect(() => {
        if (submitted || timeLeft <= 0) return;
        const id = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { setSubmitted(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [submitted, timeLeft]);

    const select = (optIdx: number) => {
        if (submitted) return;
        setAnswers(prev => { const n = [...prev]; n[current] = optIdx; return n; });
    };

    const score = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
    const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');
    const q = questions[current];

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #f59e0b, transparent 60%)' }} />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{t('quiz.title')}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{t('quiz.subtitle')}</p>
                    </div>
                    {!submitted && (
                        <div className="text-2xl font-mono font-bold" style={{ color: timeLeft < 30 ? '#ef4444' : '#6366f1' }}>
                            {mins}:{secs}
                        </div>
                    )}
                </div>
            </div>

            {!submitted ? (
                <>
                    {/* Progress dots */}
                    <div className="flex gap-2 justify-center">
                        {questions.map((_, i) => (
                            <button key={i} onClick={() => setCurrent(i)}
                                className="w-8 h-8 rounded-full text-xs font-bold transition-all"
                                style={{
                                    background: i === current ? '#6366f1' : answers[i] !== null ? 'rgba(99,102,241,0.3)' : 'var(--bg-card)',
                                    border: `2px solid ${i === current ? '#6366f1' : 'var(--border)'}`,
                                    color: i === current ? 'white' : 'var(--text-muted)',
                                }}>
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Question */}
                    <div className="glass p-6 rounded-xl">
                        <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6366f1' }}>
                            Question {current + 1} of 5
                        </div>
                        <div className="text-lg font-medium mb-5">{q.q}</div>
                        <div className="space-y-2">
                            {q.options.map((opt, oi) => (
                                <button key={oi} onClick={() => select(oi)}
                                    className="w-full text-left p-3 rounded-xl text-sm transition-all hover:scale-[1.01]"
                                    style={{
                                        background: answers[current] === oi ? 'rgba(99,102,241,0.2)' : 'var(--bg-primary)',
                                        border: answers[current] === oi ? '2px solid #6366f1' : '2px solid var(--border)',
                                        color: answers[current] === oi ? 'white' : 'var(--text-primary)',
                                    }}>
                                    <span className="font-semibold mr-2" style={{ color: '#6366f1' }}>{String.fromCharCode(65 + oi)}.</span>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nav */}
                    <div className="flex justify-between">
                        <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
                            className="px-4 py-2 rounded-lg text-sm disabled:opacity-30"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>← Back</button>
                        {current === 4 ? (
                            <button onClick={() => setSubmitted(true)}
                                className="px-6 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition-all"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>Submit Quiz</button>
                        ) : (
                            <button onClick={() => setCurrent(c => Math.min(4, c + 1))}
                                className="px-4 py-2 rounded-lg text-sm"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Next →</button>
                        )}
                    </div>
                </>
            ) : (
                /* Results */
                <div className="space-y-4">
                    <div className="glass p-8 text-center rounded-2xl">
                        <div className="text-5xl mb-3">{score >= 4 ? '🎉' : score >= 2 ? '👍' : '💪'}</div>
                        <div className="text-4xl font-bold mb-1" style={{ color: score >= 4 ? '#22c55e' : score >= 2 ? '#f59e0b' : '#ef4444' }}>
                            {score}/5
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {score === 5 ? 'Perfect score! 🏆' : score >= 3 ? 'Great job!' : 'Keep practicing!'}
                        </p>
                    </div>
                    {questions.map((qq, i) => (
                        <div key={i} className="glass p-4 rounded-xl" style={{ borderLeft: `3px solid ${answers[i] === qq.correct ? '#22c55e' : '#ef4444'}` }}>
                            <div className="text-sm font-medium mb-2">{qq.q}</div>
                            <div className="text-xs">
                                <span className="mr-3">Your answer: <strong style={{ color: answers[i] === qq.correct ? '#22c55e' : '#ef4444' }}>{answers[i] !== null ? qq.options[answers[i]] : 'Skipped'}</strong></span>
                                {answers[i] !== qq.correct && <span>Correct: <strong style={{ color: '#22c55e' }}>{qq.options[qq.correct]}</strong></span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
