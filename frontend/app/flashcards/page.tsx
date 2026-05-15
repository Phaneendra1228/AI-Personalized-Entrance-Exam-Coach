'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';

// ─── Flashcard Data ──────────────────────────────────────────
const FLASHCARD_BANKS: Record<string, { q: string; a: string }[]> = {
    Mathematics: [
        { q: 'What is the derivative of sin(x)?', a: 'cos(x)' },
        { q: 'What is ∫ eˣ dx?', a: 'eˣ + C' },
        { q: 'What is the quadratic formula?', a: 'x = (-b ± √(b²-4ac)) / 2a' },
        { q: 'What is the sum of angles in a triangle?', a: '180°' },
        { q: 'What is log₁₀(1000)?', a: '3' },
        { q: 'What is the derivative of xⁿ?', a: 'nxⁿ⁻¹' },
        { q: 'What is sin²θ + cos²θ?', a: '1' },
        { q: 'What is the distance formula?', a: '√((x₂-x₁)² + (y₂-y₁)²)' },
        { q: 'What is the formula for nCr?', a: 'n! / (r!(n-r)!)' },
        { q: 'What is the value of e (Euler\'s number)?', a: '≈ 2.71828' },
    ],
    Physics: [
        { q: 'What is Newton\'s Second Law?', a: 'F = ma (Force = mass × acceleration)' },
        { q: 'What is the speed of light?', a: '3 × 10⁸ m/s' },
        { q: 'What is Ohm\'s Law?', a: 'V = IR' },
        { q: 'What is the formula for kinetic energy?', a: 'KE = ½mv²' },
        { q: 'What is the unit of frequency?', a: 'Hertz (Hz)' },
        { q: 'What is Coulomb\'s Law?', a: 'F = kq₁q₂/r²' },
        { q: 'What is the SI unit of power?', a: 'Watt (W)' },
        { q: 'What is the formula for gravitational PE?', a: 'PE = mgh' },
        { q: 'What is Snell\'s Law?', a: 'n₁ sin θ₁ = n₂ sin θ₂' },
        { q: 'What is the value of g on Earth?', a: '≈ 9.8 m/s²' },
    ],
    Chemistry: [
        { q: 'What is the pH of pure water?', a: '7' },
        { q: 'What is Avogadro\'s number?', a: '6.022 × 10²³' },
        { q: 'What is the chemical formula of water?', a: 'H₂O' },
        { q: 'What is the ideal gas equation?', a: 'PV = nRT' },
        { q: 'What is the atomic number of Carbon?', a: '6' },
        { q: 'What is the shape of methane (CH₄)?', a: 'Tetrahedral' },
        { q: 'What is the hybridization of BF₃?', a: 'sp²' },
        { q: 'What is the molar volume of gas at STP?', a: '22.4 L/mol' },
        { q: 'What functional group defines an alcohol?', a: '-OH (Hydroxyl group)' },
        { q: 'What is the electron configuration of Na?', a: '1s² 2s² 2p⁶ 3s¹' },
    ],
    Biology: [
        { q: 'What is the powerhouse of the cell?', a: 'Mitochondria' },
        { q: 'What is DNA\'s full form?', a: 'Deoxyribonucleic Acid' },
        { q: 'How many chromosomes do humans have?', a: '46 (23 pairs)' },
        { q: 'What is the basic unit of life?', a: 'Cell' },
        { q: 'What pigment is responsible for photosynthesis?', a: 'Chlorophyll' },
        { q: 'What are the 4 bases of DNA?', a: 'Adenine, Thymine, Guanine, Cytosine' },
        { q: 'What is the largest organ in the human body?', a: 'Skin' },
        { q: 'What is the functional unit of kidney?', a: 'Nephron' },
        { q: 'What carries oxygen in blood?', a: 'Hemoglobin (in Red Blood Cells)' },
        { q: 'What is the process of cell division called?', a: 'Mitosis (somatic) / Meiosis (gametes)' },
    ],
};

const SUBJECTS = Object.keys(FLASHCARD_BANKS);

export default function FlashcardsPage() {
    const { t } = useTranslation();
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState<Set<number>>(new Set());
    const [reviewLater, setReviewLater] = useState<Set<number>>(new Set());

    const cards = useMemo(() => FLASHCARD_BANKS[subject] || [], [subject]);
    const card = cards[index];

    const next = () => { setFlipped(false); setIndex(i => (i + 1) % cards.length); };
    const prev = () => { setFlipped(false); setIndex(i => (i - 1 + cards.length) % cards.length); };

    const markKnown = () => { setKnown(s => new Set(s).add(index)); next(); };
    const markReview = () => { setReviewLater(s => new Set(s).add(index)); next(); };

    const resetAll = () => { setKnown(new Set()); setReviewLater(new Set()); setIndex(0); setFlipped(false); };

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            {/* Header */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #8b5cf6, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">🃏 AI Flashcard Generator</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Tap cards to flip. Mark as Known or Review Later.</p>
                </div>
            </div>

            {/* Subject selector */}
            <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s => (
                    <button key={s} onClick={() => { setSubject(s); setIndex(0); setFlipped(false); }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: subject === s ? 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(34,211,238,0.2))' : 'var(--bg-card)',
                            border: subject === s ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--border)',
                            color: subject === s ? 'white' : 'var(--text-muted)',
                        }}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Card {index + 1} of {cards.length}</span>
                <span>|</span>
                <span style={{ color: '#22c55e' }}>✓ Known: {known.size}</span>
                <span style={{ color: '#f59e0b' }}>↻ Review: {reviewLater.size}</span>
                <button onClick={resetAll} className="ml-auto hover:underline" style={{ color: '#6366f1' }}>Reset All</button>
            </div>

            {/* Flashcard */}
            {card && (
                <div className="flip-card cursor-pointer" style={{ height: '280px' }} onClick={() => setFlipped(!flipped)}>
                    <div className={`flip-card-inner w-full h-full ${flipped ? 'flipped' : ''}`}>
                        <div className="flip-card-front glass text-center" style={{ borderTop: '3px solid #6366f1' }}>
                            <div>
                                <div className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: '#6366f1' }}>Question</div>
                                <div className="text-lg font-medium leading-relaxed">{card.q}</div>
                                <div className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>Click to reveal answer</div>
                            </div>
                        </div>
                        <div className="flip-card-back glass text-center" style={{ borderTop: '3px solid #22c55e', background: 'var(--bg-card)' }}>
                            <div>
                                <div className="text-xs mb-3 font-semibold uppercase tracking-wider" style={{ color: '#22c55e' }}>Answer</div>
                                <div className="text-lg font-medium leading-relaxed">{card.a}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="flex gap-3 justify-center">
                <button onClick={prev} className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>← Previous</button>
                <button onClick={markReview} className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid #f59e0b44' }}>↻ Review Later</button>
                <button onClick={markKnown} className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid #22c55e44' }}>✓ Known</button>
                <button onClick={next} className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>Next →</button>
            </div>
        </div>
    );
}
