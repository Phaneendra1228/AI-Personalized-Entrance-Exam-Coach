'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';

// ─── PYQ Data ────────────────────────────────────────────
const EXAMS = ['JEE Mains', 'JEE Advanced', 'NEET', 'EAMCET MPC', 'EAMCET BiPC'];
const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020'];
const SUBJECTS: Record<string, string[]> = {
    'JEE Mains': ['Physics', 'Chemistry', 'Mathematics'],
    'JEE Advanced': ['Physics', 'Chemistry', 'Mathematics'],
    'NEET': ['Physics', 'Chemistry', 'Biology'],
    'EAMCET MPC': ['Physics', 'Chemistry', 'Mathematics'],
    'EAMCET BiPC': ['Physics', 'Chemistry', 'Biology'],
};

interface PYQ {
    id: string; question: string; options: string[]; correct: number;
    solution: string; difficulty: 'Easy' | 'Medium' | 'Hard'; topic: string;
}

const PYQ_BANK: Record<string, PYQ[]> = {
    'Physics': [
        { id: 'p1', question: 'A particle moves in a straight line with uniform acceleration. If the velocity at time t=0 is 5 m/s and at t=10s is 25 m/s, find the acceleration.', options: ['1 m/s²', '2 m/s²', '3 m/s²', '4 m/s²'], correct: 1, solution: 'Using v = u + at → 25 = 5 + a(10) → a = 20/10 = 2 m/s²', difficulty: 'Easy', topic: 'Kinematics' },
        { id: 'p2', question: 'A body of mass 2 kg is moving with a velocity of 3 m/s. The kinetic energy of the body is:', options: ['3 J', '6 J', '9 J', '12 J'], correct: 2, solution: 'KE = ½mv² = ½ × 2 × 3² = ½ × 2 × 9 = 9 J', difficulty: 'Easy', topic: 'Work & Energy' },
        { id: 'p3', question: 'Two charges of +2μC and -4μC are placed 20 cm apart. The electric field at the midpoint is:', options: ['5.4×10⁶ N/C', '10.8×10⁶ N/C', '2.7×10⁶ N/C', '21.6×10⁶ N/C'], correct: 1, solution: 'E = kq/r². Both fields point in the same direction at midpoint. E_net = k(|q₁|+|q₂|)/r² = 9×10⁹ × 6×10⁻⁶/(0.1)² = 5.4×10⁶ N/C', difficulty: 'Medium', topic: 'Electrostatics' },
        { id: 'p4', question: 'The de Broglie wavelength of an electron accelerated through 100V is approximately:', options: ['0.123 nm', '0.223 nm', '0.323 nm', '0.423 nm'], correct: 0, solution: 'λ = 1.226/√V nm = 1.226/√100 = 1.226/10 = 0.1226 ≈ 0.123 nm', difficulty: 'Medium', topic: 'Modern Physics' },
        { id: 'p5', question: 'In Young\'s double slit experiment, the fringe width is β. If the distance between the slits is halved, the new fringe width is:', options: ['β/2', 'β', '2β', '4β'], correct: 2, solution: 'β = λD/d. If d → d/2, then β\' = λD/(d/2) = 2λD/d = 2β', difficulty: 'Medium', topic: 'Optics' },
        { id: 'p6', question: 'A Carnot engine has an efficiency of 40%. If the temperature of the sink is 300K, the temperature of the source is:', options: ['400 K', '450 K', '500 K', '600 K'], correct: 2, solution: 'η = 1 - T₂/T₁ → 0.4 = 1 - 300/T₁ → T₁ = 300/0.6 = 500 K', difficulty: 'Hard', topic: 'Thermodynamics' },
    ],
    'Chemistry': [
        { id: 'c1', question: 'The IUPAC name of CH₃-CH=CH-CHO is:', options: ['But-2-enal', 'But-3-enal', '2-Butenal', 'Crotonaldehyde'], correct: 0, solution: 'The longest chain has 4 carbons with a double bond at C-2 and aldehyde at C-1. IUPAC: But-2-enal', difficulty: 'Easy', topic: 'Organic Chemistry' },
        { id: 'c2', question: 'Which of the following has the highest electron affinity?', options: ['F', 'Cl', 'Br', 'I'], correct: 1, solution: 'Chlorine has the highest electron affinity (-349 kJ/mol) due to its optimal atomic size. Fluorine is smaller, causing electron-electron repulsion.', difficulty: 'Easy', topic: 'Periodic Table' },
        { id: 'c3', question: 'The hybridization of carbon in CO₂ is:', options: ['sp', 'sp²', 'sp³', 'sp³d'], correct: 0, solution: 'CO₂ is O=C=O, linear molecule. Carbon forms 2 double bonds with no lone pairs → sp hybridization.', difficulty: 'Easy', topic: 'Chemical Bonding' },
        { id: 'c4', question: 'The pH of 0.01 M HCl solution is:', options: ['1', '2', '3', '4'], correct: 1, solution: 'HCl is a strong acid, fully dissociates. [H⁺] = 0.01 = 10⁻². pH = -log[H⁺] = -log(10⁻²) = 2', difficulty: 'Easy', topic: 'Ionic Equilibrium' },
        { id: 'c5', question: 'Which reaction is an example of Wurtz reaction?', options: ['2CH₃Cl + 2Na → C₂H₆ + 2NaCl', 'CH₃Cl + KOH → CH₃OH + KCl', 'C₂H₅Br + KCN → C₂H₅CN + KBr', 'CH₃Cl + NH₃ → CH₃NH₂ + HCl'], correct: 0, solution: 'Wurtz reaction: 2R-X + 2Na → R-R + 2NaX. Two alkyl halides react with sodium to form a higher alkane.', difficulty: 'Medium', topic: 'Organic Chemistry' },
    ],
    'Mathematics': [
        { id: 'm1', question: 'The value of lim(x→0) sin(x)/x is:', options: ['0', '1', '∞', 'Does not exist'], correct: 1, solution: 'This is a standard limit. lim(x→0) sin(x)/x = 1 (L\'Hôpital\'s rule or squeeze theorem)', difficulty: 'Easy', topic: 'Limits' },
        { id: 'm2', question: 'The derivative of e^(sin x) is:', options: ['e^(sin x)·cos x', 'e^(cos x)·sin x', 'e^(sin x)', 'cos x·e^x'], correct: 0, solution: 'By chain rule: d/dx[e^(sin x)] = e^(sin x) · d/dx[sin x] = e^(sin x) · cos x', difficulty: 'Easy', topic: 'Differentiation' },
        { id: 'm3', question: '∫ (1/x) dx from 1 to e equals:', options: ['0', '1', 'e', '1/e'], correct: 1, solution: '∫₁ᵉ (1/x)dx = [ln|x|]₁ᵉ = ln(e) - ln(1) = 1 - 0 = 1', difficulty: 'Easy', topic: 'Integration' },
        { id: 'm4', question: 'If A = {1,2,3} and B = {3,4,5}, then A ∩ B is:', options: ['{1,2,3,4,5}', '{3}', '{}', '{1,2,4,5}'], correct: 1, solution: 'A ∩ B = elements common to both A and B = {3}', difficulty: 'Easy', topic: 'Sets' },
        { id: 'm5', question: 'The number of solutions of x² + |x| - 6 = 0 is:', options: ['1', '2', '3', '4'], correct: 1, solution: 'For x ≥ 0: x² + x - 6 = 0 → (x+3)(x-2) = 0 → x = 2 (valid). For x < 0: x² - x - 6 = 0 → (x-3)(x+2) = 0 → x = -2 (valid). Total: 2 solutions.', difficulty: 'Medium', topic: 'Algebra' },
        { id: 'm6', question: 'The distance between the parallel lines 3x + 4y = 5 and 3x + 4y = 10 is:', options: ['1', '5', '½', '5/√(25)'], correct: 0, solution: 'd = |c₁ - c₂|/√(a² + b²) = |5 - 10|/√(9+16) = 5/5 = 1', difficulty: 'Medium', topic: 'Coordinate Geometry' },
    ],
    'Biology': [
        { id: 'b1', question: 'The powerhouse of the cell is:', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi body'], correct: 1, solution: 'Mitochondria are called the powerhouse because they produce ATP through oxidative phosphorylation.', difficulty: 'Easy', topic: 'Cell Biology' },
        { id: 'b2', question: 'DNA replication is:', options: ['Conservative', 'Semi-conservative', 'Dispersive', 'Non-conservative'], correct: 1, solution: 'DNA replication is semi-conservative — each new DNA molecule has one parent strand and one new strand (Meselson & Stahl experiment).', difficulty: 'Easy', topic: 'Molecular Biology' },
        { id: 'b3', question: 'Which vitamin is required for blood clotting?', options: ['Vitamin A', 'Vitamin C', 'Vitamin K', 'Vitamin E'], correct: 2, solution: 'Vitamin K is essential for synthesis of prothrombin and other clotting factors in the liver.', difficulty: 'Easy', topic: 'Biomolecules' },
        { id: 'b4', question: 'The number of chromosomes in human gametes is:', options: ['23', '46', '22', '44'], correct: 0, solution: 'Human gametes (sperm/egg) are haploid with 23 chromosomes (22 autosomes + 1 sex chromosome).', difficulty: 'Easy', topic: 'Genetics' },
        { id: 'b5', question: 'Krebs cycle occurs in:', options: ['Cytoplasm', 'Mitochondrial matrix', 'Nucleus', 'Ribosomes'], correct: 1, solution: 'The Krebs cycle (citric acid cycle) occurs in the mitochondrial matrix, producing NADH, FADH₂, and GTP.', difficulty: 'Medium', topic: 'Respiration' },
    ],
};

export default function PYQPage() {
    const { showToast } = useToast();
    const [exam, setExam] = useState(EXAMS[0]);
    const [year, setYear] = useState(YEARS[0]);
    const [subject, setSubject] = useState(SUBJECTS[EXAMS[0]][0]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('lf-pyq-bookmarks');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        }
        return new Set();
    });

    const questions = PYQ_BANK[subject] || [];
    const availableSubjects = SUBJECTS[exam] || [];

    const toggleBookmark = (id: string) => {
        setBookmarked(prev => {
            const next = new Set(prev);
            if (next.has(id)) { next.delete(id); showToast('Bookmark removed', 'info'); }
            else { next.add(id); showToast('Question bookmarked! 📌', 'success'); }
            localStorage.setItem('lf-pyq-bookmarks', JSON.stringify([...next]));
            return next;
        });
    };

    const diffColor = (d: string) =>
        d === 'Easy' ? '#22c55e' : d === 'Medium' ? '#f59e0b' : '#ef4444';

    return (
        <div className="max-w-4xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #6366f1, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">📄 Previous Year Questions</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Practice with real exam questions from past years</p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Exam Filter */}
                <div className="glass p-4 rounded-xl">
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>🎯 Exam</label>
                    <div className="flex flex-wrap gap-1.5">
                        {EXAMS.map(e => (
                            <button key={e}
                                onClick={() => { setExam(e); setSubject(SUBJECTS[e][0]); }}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                style={{
                                    background: exam === e ? 'rgba(99,102,241,0.2)' : 'var(--bg-primary)',
                                    color: exam === e ? '#6366f1' : 'var(--text-muted)',
                                    border: `1px solid ${exam === e ? '#6366f144' : 'var(--border)'}`,
                                }}>{e}</button>
                        ))}
                    </div>
                </div>

                {/* Year Filter */}
                <div className="glass p-4 rounded-xl">
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>📅 Year</label>
                    <div className="flex flex-wrap gap-1.5">
                        {YEARS.map(y => (
                            <button key={y}
                                onClick={() => setYear(y)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                style={{
                                    background: year === y ? 'rgba(34,211,238,0.2)' : 'var(--bg-primary)',
                                    color: year === y ? '#22d3ee' : 'var(--text-muted)',
                                    border: `1px solid ${year === y ? '#22d3ee44' : 'var(--border)'}`,
                                }}>{y}</button>
                        ))}
                    </div>
                </div>

                {/* Subject Filter */}
                <div className="glass p-4 rounded-xl">
                    <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>📚 Subject</label>
                    <div className="flex flex-wrap gap-1.5">
                        {availableSubjects.map(s => (
                            <button key={s}
                                onClick={() => setSubject(s)}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                                style={{
                                    background: subject === s ? 'rgba(245,158,11,0.2)' : 'var(--bg-primary)',
                                    color: subject === s ? '#f59e0b' : 'var(--text-muted)',
                                    border: `1px solid ${subject === s ? '#f59e0b44' : 'var(--border)'}`,
                                }}>{s}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info bar */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {exam} · {year} · {subject} — {questions.length} questions
                </span>
                <span className="text-xs" style={{ color: '#6366f1' }}>📌 {bookmarked.size} bookmarked</span>
            </div>

            {/* Questions */}
            <div className="space-y-3">
                {questions.map((q, idx) => (
                    <div key={q.id} className="glass p-5 rounded-xl transition-all hover:scale-[1.005]">
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>Q{idx + 1}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${diffColor(q.difficulty)}22`, color: diffColor(q.difficulty) }}>{q.difficulty}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>{q.topic}</span>
                                </div>
                                <p className="text-sm leading-relaxed">{q.question}</p>
                            </div>
                            <button onClick={() => toggleBookmark(q.id)}
                                className="text-lg shrink-0 hover:scale-125 transition-transform"
                                title={bookmarked.has(q.id) ? 'Remove bookmark' : 'Bookmark'}
                            >{bookmarked.has(q.id) ? '📌' : '🔖'}</button>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            {q.options.map((opt, oi) => (
                                <div key={oi}
                                    className="px-3 py-2 rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer hover:bg-white/5"
                                    style={{
                                        background: expanded === q.id && oi === q.correct ? 'rgba(34,197,94,0.15)' : 'var(--bg-primary)',
                                        border: expanded === q.id && oi === q.correct ? '1px solid #22c55e44' : '1px solid var(--border)',
                                        color: expanded === q.id && oi === q.correct ? '#22c55e' : 'var(--text-primary)',
                                    }}
                                >
                                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                                        {String.fromCharCode(65 + oi)}
                                    </span>
                                    {opt}
                                    {expanded === q.id && oi === q.correct && <span className="ml-auto">✓</span>}
                                </div>
                            ))}
                        </div>

                        {/* Show/Hide Solution */}
                        <button
                            onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                            className="text-xs font-semibold hover:underline"
                            style={{ color: '#6366f1' }}
                        >{expanded === q.id ? '▲ Hide Solution' : '▼ Show Solution'}</button>

                        {expanded === q.id && (
                            <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed" style={{ background: 'rgba(34,197,94,0.08)', borderLeft: '3px solid #22c55e', color: 'var(--text-primary)' }}>
                                <strong style={{ color: '#22c55e' }}>Solution:</strong> {q.solution}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
