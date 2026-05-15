'use client';

import { useState, useEffect } from 'react';
import { sendChat } from '@/lib/api';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];

interface Doubt { id: string; question: string; subject: string; answer: string; timestamp: string; }

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

export default function DoubtSolverPage() {
    const [question, setQuestion] = useState('');
    const [subject, setSubject] = useState('Physics');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState('');
    const [history, setHistory] = useState<Doubt[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('lf-doubt-history');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    const handleSubmit = async () => {
        if (!question.trim() || loading) return;
        setLoading(true);
        setAnswer('');

        const prompt = `You are a ${subject} tutor. A student asks: "${question}". Provide a clear, step-by-step solution. If it's a numerical problem, show all calculations. Keep it concise but thorough.`;

        try {
            const res = await sendChat({
                student_id: STUDENT_ID,
                message: prompt,
                history: [],
            });
            const ans = res.response;
            setAnswer(ans);

            const doubt: Doubt = {
                id: Date.now().toString(),
                question: question.trim(),
                subject,
                answer: ans,
                timestamp: new Date().toISOString(),
            };
            const updated = [doubt, ...history].slice(0, 50);
            setHistory(updated);
            localStorage.setItem('lf-doubt-history', JSON.stringify(updated));
        } catch {
            setAnswer('⚠️ Could not connect to AI. Please check that the backend server is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('lf-doubt-history');
    };

    const relatedTopics: Record<string, string[]> = {
        Physics: ['Mechanics', 'Electrostatics', 'Optics', 'Thermodynamics', 'Modern Physics', 'Magnetism'],
        Chemistry: ['Organic', 'Inorganic', 'Physical Chemistry', 'Electrochemistry', 'Coordination', 'Polymers'],
        Mathematics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry', 'Probability', 'Vectors'],
        Biology: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology', 'Plant Biology', 'Evolution'],
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #f59e0b, transparent 60%)' }} />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">🤔 Doubt Solver</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Paste your question → Get step-by-step AI solution</p>
                    </div>
                    <button onClick={() => setShowHistory(!showHistory)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                        style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1', border: '1px solid #6366f144' }}>
                        📜 History ({history.length})
                    </button>
                </div>
            </div>

            {/* Subject Selector */}
            <div className="flex gap-2">
                {SUBJECTS.map(s => (
                    <button key={s} onClick={() => setSubject(s)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                        style={{
                            background: subject === s ? 'rgba(245,158,11,0.2)' : 'var(--bg-card)',
                            color: subject === s ? '#f59e0b' : 'var(--text-muted)',
                            border: `1px solid ${subject === s ? '#f59e0b44' : 'var(--border)'}`,
                        }}>{s}</button>
                ))}
            </div>

            {/* Quick Topics */}
            <div className="flex flex-wrap gap-1.5">
                {(relatedTopics[subject] || []).map(t => (
                    <button key={t} onClick={() => setQuestion(`Explain the concept of ${t} in ${subject}`)}
                        className="px-2.5 py-1 rounded-full text-xs transition-all hover:scale-105"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="glass p-5 rounded-xl">
                <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder={`Type your ${subject} doubt here...\n\nFor example:\n• "Explain the concept of electromagnetic induction"\n• "Solve: ∫ x²sin(x) dx"\n• "What is the hybridization of XeF₄?"`}
                    className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none resize-none"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)', minHeight: '120px' }}
                />
                <div className="flex items-center justify-between mt-3">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{subject} · AI-powered solution</span>
                    <button onClick={handleSubmit} disabled={!question.trim() || loading}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white' }}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Solving...
                            </span>
                        ) : '🧠 Solve Doubt'}
                    </button>
                </div>
            </div>

            {/* Answer */}
            {answer && (
                <div className="glass p-5 rounded-xl" style={{ borderLeft: '3px solid #22c55e' }}>
                    <h3 className="font-semibold text-sm mb-3" style={{ color: '#22c55e' }}>✅ Solution</h3>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                        {answer.split('\n').map((line, i) => (
                            <p key={i} className={line.trim() === '' ? 'h-3' : 'mb-1'}>{line}</p>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading animation */}
            {loading && (
                <div className="glass p-6 rounded-xl text-center">
                    <div className="text-3xl mb-2 animate-bounce">🧠</div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>AI is thinking...</p>
                </div>
            )}

            {/* History Panel */}
            {showHistory && (
                <div className="glass p-5 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-sm">📜 Past Doubts</h3>
                        {history.length > 0 && (
                            <button onClick={clearHistory} className="text-xs hover:underline" style={{ color: '#ef4444' }}>Clear All</button>
                        )}
                    </div>
                    {history.length === 0 ? (
                        <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No doubts solved yet</p>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {history.map(d => (
                                <button key={d.id}
                                    onClick={() => { setQuestion(d.question); setSubject(d.subject); setAnswer(d.answer); setShowHistory(false); }}
                                    className="w-full text-left p-3 rounded-lg text-xs transition-all hover:bg-white/5"
                                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>{d.subject}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{new Date(d.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <span className="line-clamp-1">{d.question}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
