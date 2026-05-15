'use client';

import { useState } from 'react';

const FORMULA_SHEETS: Record<string, { title: string; formula: string; desc: string }[]> = {
    Mathematics: [
        { title: 'Quadratic Formula', formula: 'x = (-b ± √(b²-4ac)) / 2a', desc: 'Solving ax² + bx + c = 0' },
        { title: 'Pythagorean Theorem', formula: 'a² + b² = c²', desc: 'Right triangle hypotenuse' },
        { title: 'Area of Circle', formula: 'A = πr²', desc: 'Area with radius r' },
        { title: 'Sum of AP', formula: 'Sₙ = n/2 [2a + (n-1)d]', desc: 'Sum of n terms in arithmetic progression' },
        { title: 'Sum of GP', formula: 'Sₙ = a(rⁿ-1)/(r-1)', desc: 'Sum of geometric progression' },
        { title: 'Derivative Power Rule', formula: 'd/dx(xⁿ) = nxⁿ⁻¹', desc: 'Differentiation of power function' },
        { title: 'Integration Power Rule', formula: '∫xⁿ dx = xⁿ⁺¹/(n+1) + C', desc: 'Integration of power function' },
        { title: 'Binomial Theorem', formula: '(a+b)ⁿ = Σ ⁿCᵣ aⁿ⁻ʳ bʳ', desc: 'Expansion of binomial expression' },
        { title: 'Distance Formula', formula: 'd = √((x₂-x₁)² + (y₂-y₁)²)', desc: 'Distance between two points' },
        { title: 'Euler Formula', formula: 'eⁱᶿ = cos θ + i sin θ', desc: 'Complex exponential' },
    ],
    Physics: [
        { title: 'Newton\'s Second Law', formula: 'F = ma', desc: 'Force equals mass times acceleration' },
        { title: 'Kinetic Energy', formula: 'KE = ½mv²', desc: 'Energy of motion' },
        { title: 'Potential Energy', formula: 'PE = mgh', desc: 'Gravitational potential energy' },
        { title: 'Ohm\'s Law', formula: 'V = IR', desc: 'Voltage, current, resistance relation' },
        { title: 'Einstein\'s Mass-Energy', formula: 'E = mc²', desc: 'Mass-energy equivalence' },
        { title: 'Coulomb\'s Law', formula: 'F = kq₁q₂/r²', desc: 'Electrostatic force' },
        { title: 'Gravitational Force', formula: 'F = Gm₁m₂/r²', desc: 'Universal gravitation' },
        { title: 'Wave Equation', formula: 'v = fλ', desc: 'Velocity, frequency, wavelength' },
        { title: 'Snell\'s Law', formula: 'n₁ sin θ₁ = n₂ sin θ₂', desc: 'Refraction of light' },
        { title: 'Equations of Motion', formula: 'v = u + at, s = ut + ½at²', desc: 'Kinematics equations' },
    ],
    Chemistry: [
        { title: 'Ideal Gas Law', formula: 'PV = nRT', desc: 'Pressure, volume, moles, temperature' },
        { title: 'Mole Formula', formula: 'n = m/M', desc: 'Number of moles' },
        { title: 'pH Formula', formula: 'pH = -log[H⁺]', desc: 'Hydrogen ion concentration' },
        { title: 'Molarity', formula: 'M = mol/L', desc: 'Concentration in moles per liter' },
        { title: 'First Law of Thermo', formula: 'ΔU = q + w', desc: 'Internal energy change' },
        { title: 'Gibbs Free Energy', formula: 'ΔG = ΔH - TΔS', desc: 'Spontaneity of reactions' },
        { title: 'Boyle\'s Law', formula: 'P₁V₁ = P₂V₂', desc: 'At constant temperature' },
        { title: 'Arrhenius Equation', formula: 'k = Ae^(-Ea/RT)', desc: 'Rate constant temperature dependence' },
        { title: 'Nernst Equation', formula: 'E = E° - (RT/nF)lnQ', desc: 'Cell potential under non-standard conditions' },
        { title: 'Raoult\'s Law', formula: 'P = x·P°', desc: 'Vapor pressure lowering' },
    ],
    Biology: [
        { title: 'Photosynthesis', formula: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', desc: 'Overall equation' },
        { title: 'Cellular Respiration', formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', desc: 'Energy release' },
        { title: 'Hardy-Weinberg', formula: 'p² + 2pq + q² = 1', desc: 'Allele frequency equilibrium' },
        { title: 'BMI', formula: 'BMI = weight(kg) / height(m)²', desc: 'Body Mass Index' },
        { title: 'Cardiac Output', formula: 'CO = SV × HR', desc: 'Stroke volume × heart rate' },
        { title: 'GFR', formula: 'GFR = (U×V) / P', desc: 'Glomerular filtration rate' },
    ],
};

const SUBJECTS = Object.keys(FORMULA_SHEETS);

export default function FormulasPage() {
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [search, setSearch] = useState('');

    const formulas = FORMULA_SHEETS[subject].filter(f =>
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.formula.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #8b5cf6, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">📐 Formula Sheet</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Quick reference cards for key formulas</p>
                </div>
            </div>

            {/* Subject tabs */}
            <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s => (
                    <button key={s} onClick={() => { setSubject(s); setSearch(''); }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: subject === s ? 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(34,211,238,0.2))' : 'var(--bg-card)',
                            border: subject === s ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--border)',
                            color: subject === s ? 'white' : 'var(--text-muted)',
                        }}>{s}</button>
                ))}
            </div>

            {/* Search */}
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search formulas..."
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent outline-none glass"
                style={{ color: 'var(--text-primary)' }} />

            {/* Formula cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formulas.map((f, i) => (
                    <div key={i} className="glass p-4 rounded-xl hover:scale-[1.02] transition-all"
                        style={{ borderTop: '2px solid #6366f1' }}>
                        <div className="text-xs font-semibold mb-2" style={{ color: '#6366f1' }}>{f.title}</div>
                        <div className="text-lg font-mono font-bold mb-2 text-center py-3 rounded-lg"
                            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>{f.formula}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
