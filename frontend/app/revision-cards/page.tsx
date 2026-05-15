'use client';

import { useState } from 'react';

const REVISION_CARDS: Record<string, { title: string; points: string[] }[]> = {
    Mathematics: [
        { title: 'Quadratic Equations', points: ['ax²+bx+c=0', 'D=b²-4ac', 'D>0: 2 real roots', 'D=0: equal roots', 'D<0: complex roots', 'Sum of roots=-b/a', 'Product=c/a'] },
        { title: 'Trigonometric Identities', points: ['sin²θ+cos²θ=1', '1+tan²θ=sec²θ', '1+cot²θ=csc²θ', 'sin(A±B)=sinAcosB±cosAsinB', 'cos2A=cos²A-sin²A', 'sin2A=2sinAcosA'] },
        { title: 'Differentiation Rules', points: ['d/dx(xⁿ)=nxⁿ⁻¹', 'd/dx(sinx)=cosx', 'd/dx(eˣ)=eˣ', 'd/dx(lnx)=1/x', 'Chain rule: d/dx f(g(x))=f\'(g(x))·g\'(x)', 'Product: (uv)\'=u\'v+uv\''] },
    ],
    Physics: [
        { title: 'Newton\'s Laws', points: ['1st: Body at rest stays at rest (inertia)', '2nd: F=ma (force=mass×acceleration)', '3rd: Every action has equal opposite reaction', 'Weight: W=mg', 'Friction: f=μN', 'Tension acts along string'] },
        { title: 'Kinematics Equations', points: ['v=u+at', 's=ut+½at²', 'v²=u²+2as', 'Free fall: g=9.8m/s²', 'Projectile range: R=u²sin2θ/g', 'Max height: H=u²sin²θ/2g'] },
        { title: 'Electrostatics', points: ['F=kq₁q₂/r² (Coulomb)', 'E=F/q (Field)', 'V=kq/r (Potential)', 'C=q/V (Capacitance)', 'Series: 1/C=Σ1/Cᵢ', 'Parallel: C=ΣCᵢ'] },
    ],
    Chemistry: [
        { title: 'Periodic Trends', points: ['Atomic radius ↓ across period', 'Atomic radius ↑ down group', 'Ionization energy ↑ across period', 'Electronegativity ↑ across period', 'Metallic character ↓ across period', 'Most electronegative: Fluorine'] },
        { title: 'Gas Laws', points: ['Boyle: P₁V₁=P₂V₂ (const T)', 'Charles: V₁/T₁=V₂/T₂ (const P)', 'Ideal: PV=nRT', 'R=8.314 J/mol·K', 'STP: 0°C, 1 atm', 'Molar vol at STP=22.4L'] },
        { title: 'Organic Reactions', points: ['Alkane: substitution (halogenation)', 'Alkene: addition (HBr, H₂O)', 'Alcohol → Aldehyde: mild oxidation', 'Aldehyde → Acid: strong oxidation', 'Ester: Alcohol + Acid → Ester + H₂O', 'Saponification: Ester + Base → Salt + Alcohol'] },
    ],
    Biology: [
        { title: 'Cell Division', points: ['Mitosis: 2n→2n (somatic cells)', 'Meiosis: 2n→n (gametes)', 'Phases: Prophase→Meta→Ana→Telo', 'Crossing over in Meiosis I', 'Mitosis: growth & repair', 'Meiosis: genetic variation'] },
        { title: 'DNA & RNA', points: ['DNA: deoxyribose, thymine', 'RNA: ribose, uracil', 'A-T (2 bonds), G-C (3 bonds)', 'mRNA, tRNA, rRNA types', 'Central dogma: DNA→RNA→Protein', 'Codon = 3 bases = 1 amino acid'] },
        { title: 'Photosynthesis', points: ['6CO₂+6H₂O→C₆H₁₂O₆+6O₂', 'Light reaction: thylakoid', 'Dark reaction: stroma (Calvin cycle)', 'Chlorophyll absorbs red/blue light', 'ATP & NADPH from light reactions', 'C3 vs C4 vs CAM plants'] },
    ],
};

const SUBJECTS = Object.keys(REVISION_CARDS);

export default function RevisionCardsPage() {
    const [subject, setSubject] = useState(SUBJECTS[0]);

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #22d3ee, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">📋 Quick Revision Cards</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Key points for last-minute revision</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s => (
                    <button key={s} onClick={() => setSubject(s)}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: subject === s ? 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(34,211,238,0.2))' : 'var(--bg-card)',
                            border: subject === s ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--border)',
                            color: subject === s ? 'white' : 'var(--text-muted)',
                        }}>{s}</button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REVISION_CARDS[subject].map((card, i) => {
                    const colors = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
                    const c = colors[i % colors.length];
                    return (
                        <div key={i} className="glass p-5 rounded-xl hover:scale-[1.01] transition-all" style={{ borderTop: `3px solid ${c}` }}>
                            <h3 className="font-bold text-sm mb-3" style={{ color: c }}>{card.title}</h3>
                            <ul className="space-y-1.5">
                                {card.points.map((pt, j) => (
                                    <li key={j} className="text-xs flex items-start gap-2">
                                        <span style={{ color: c }}>•</span>
                                        <span className="font-mono">{pt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
