'use client';

import { useState, useEffect } from 'react';

const CHALLENGE_TYPES = [
    { id: 'speed', label: '⏱ Speed Round', desc: 'Answer 5 questions in 60 seconds', time: 60, count: 5 },
    { id: 'accuracy', label: '🎯 Perfect Score', desc: 'Get all 5 questions right', time: 120, count: 5 },
    { id: 'marathon', label: '🏃 Marathon', desc: 'Answer 10 questions, no time limit', time: 0, count: 10 },
];

const CHALLENGE_QUESTIONS = [
    { q: 'What is 15² ?', options: ['225', '215', '235', '245'], correct: 0 },
    { q: 'What is the atomic mass of Carbon?', options: ['10', '12', '14', '16'], correct: 1 },
    { q: 'sin(30°) = ?', options: ['1', '0', '0.5', '√3/2'], correct: 2 },
    { q: 'What is 1 Newton in terms of base SI units?', options: ['kg·m/s²', 'kg·m²/s', 'kg/m·s²', 'kg·m/s'], correct: 0 },
    { q: 'Which element has atomic number 79?', options: ['Silver', 'Gold', 'Platinum', 'Copper'], correct: 1 },
    { q: 'What is the HCF of 12 and 18?', options: ['3', '6', '9', '12'], correct: 1 },
    { q: 'What is the acceleration formula?', options: ['v/t', '(v-u)/t', 'v×t', 'u+at'], correct: 1 },
    { q: 'Chemical formula of Sulphuric Acid?', options: ['HCl', 'HNO₃', 'H₂SO₄', 'H₃PO₄'], correct: 2 },
    { q: 'What is log₂(8)?', options: ['2', '3', '4', '8'], correct: 1 },
    { q: 'Which organelle has its own DNA?', options: ['Ribosome', 'Lysosome', 'Mitochondria', 'Golgi'], correct: 2 },
];

interface ChallengeResult { type: string; score: number; total: number; date: string; }

export default function ChallengesPage() {
    const [mode, setMode] = useState<'select' | 'play' | 'result'>('select');
    const [challenge, setChallenge] = useState(CHALLENGE_TYPES[0]);
    const [questions, setQuestions] = useState<typeof CHALLENGE_QUESTIONS>([]);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [history, setHistory] = useState<ChallengeResult[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('lf-challenges');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    useEffect(() => {
        if (mode !== 'play' || !challenge.time || timeLeft <= 0) return;
        const id = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { setMode('result'); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [mode, timeLeft, challenge.time]);

    const startChallenge = (type: typeof CHALLENGE_TYPES[number]) => {
        const shuffled = [...CHALLENGE_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, type.count);
        setChallenge(type);
        setQuestions(shuffled);
        setAnswers(Array(type.count).fill(null));
        setCurrent(0);
        setTimeLeft(type.time);
        setMode('play');
    };

    const select = (idx: number) => {
        const a = [...answers]; a[current] = idx; setAnswers(a);
        if (current < questions.length - 1) {
            setTimeout(() => setCurrent(c => c + 1), 300);
        } else {
            setTimeout(() => {
                setMode('result');
                const score = questions.reduce((s, q, i) => s + (a[i] === q.correct ? 1 : 0), 0);
                const result: ChallengeResult = { type: challenge.label, score, total: questions.length, date: new Date().toISOString() };
                const updated = [result, ...history].slice(0, 20);
                setHistory(updated);
                localStorage.setItem('lf-challenges', JSON.stringify(updated));
            }, 300);
        }
    };

    const score = questions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #ef4444, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">⚔️ Challenge Mode</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Test yourself with timed challenges and compete!</p>
                </div>
            </div>

            {mode === 'select' && (
                <>
                    <div className="grid gap-3">
                        {CHALLENGE_TYPES.map(type => (
                            <button key={type.id} onClick={() => startChallenge(type)}
                                className="glass p-5 rounded-xl text-left hover:scale-[1.01] transition-all"
                                style={{ borderLeft: '3px solid #6366f1' }}>
                                <div className="text-lg font-bold mb-1">{type.label}</div>
                                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{type.desc}</div>
                            </button>
                        ))}
                    </div>
                    {history.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-sm mb-3">Recent Challenges</h3>
                            <div className="space-y-2">
                                {history.slice(0, 5).map((h, i) => (
                                    <div key={i} className="glass p-3 rounded-xl flex items-center justify-between"
                                        style={{ borderLeft: `3px solid ${h.score === h.total ? '#22c55e' : h.score >= h.total / 2 ? '#f59e0b' : '#ef4444'}` }}>
                                        <div>
                                            <div className="text-sm font-medium">{h.type}</div>
                                            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className="text-sm font-bold" style={{ color: h.score === h.total ? '#22c55e' : '#f59e0b' }}>{h.score}/{h.total}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {mode === 'play' && questions[current] && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Question {current + 1}/{questions.length}</span>
                        {challenge.time > 0 && (
                            <span className="text-lg font-mono font-bold" style={{ color: timeLeft < 10 ? '#ef4444' : '#6366f1' }}>
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </span>
                        )}
                    </div>
                    <div className="glass p-6 rounded-xl">
                        <div className="text-lg font-medium mb-4">{questions[current].q}</div>
                        <div className="space-y-2">
                            {questions[current].options.map((opt, oi) => (
                                <button key={oi} onClick={() => select(oi)}
                                    className="w-full text-left p-3 rounded-xl text-sm transition-all hover:scale-[1.01]"
                                    style={{ background: 'var(--bg-primary)', border: '2px solid var(--border)', color: 'var(--text-primary)' }}>
                                    <span className="font-semibold mr-2" style={{ color: '#6366f1' }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {mode === 'result' && (
                <div className="space-y-4">
                    <div className="glass p-8 text-center rounded-2xl">
                        <div className="text-5xl mb-3">{score === questions.length ? '🎉' : score >= questions.length / 2 ? '👍' : '💪'}</div>
                        <div className="text-4xl font-bold" style={{ color: score === questions.length ? '#22c55e' : '#f59e0b' }}>{score}/{questions.length}</div>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{challenge.label} Complete!</p>
                    </div>
                    <button onClick={() => setMode('select')} className="w-full py-3 rounded-xl text-sm font-semibold hover:scale-[1.01] transition-all"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>← Back to Challenges</button>
                </div>
            )}
        </div>
    );
}
