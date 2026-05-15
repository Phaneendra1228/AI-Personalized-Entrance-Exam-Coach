'use client';

import { useState } from 'react';

const MIND_MAPS: Record<string, { center: string; branches: { label: string; color: string; children: string[] }[] }> = {
    Mathematics: {
        center: 'Mathematics',
        branches: [
            { label: 'Algebra', color: '#6366f1', children: ['Quadratic Equations', 'Polynomials', 'Matrices', 'Determinants'] },
            { label: 'Calculus', color: '#22d3ee', children: ['Limits', 'Derivatives', 'Integrals', 'Differential Eq.'] },
            { label: 'Trigonometry', color: '#22c55e', children: ['Identities', 'Inverse Trig', 'Heights & Distances'] },
            { label: 'Coordinate', color: '#f59e0b', children: ['Straight Lines', 'Circles', 'Conics', 'Parabola'] },
            { label: 'Stats & Prob', color: '#ef4444', children: ['Probability', 'Mean/Median', 'Permutations', 'Combinations'] },
        ],
    },
    Physics: {
        center: 'Physics',
        branches: [
            { label: 'Mechanics', color: '#6366f1', children: ['Kinematics', 'Laws of Motion', 'Work & Energy', 'Rotation'] },
            { label: 'Electromagnetism', color: '#22d3ee', children: ['Electrostatics', 'Current', 'Magnetism', 'EMI'] },
            { label: 'Optics', color: '#22c55e', children: ['Ray Optics', 'Wave Optics', 'Interference'] },
            { label: 'Thermodynamics', color: '#f59e0b', children: ['Heat Transfer', 'Laws of Thermo', 'Kinetic Theory'] },
            { label: 'Modern Physics', color: '#ef4444', children: ['Photoelectric', 'Atomic Models', 'Nuclear', 'Semiconductors'] },
        ],
    },
    Chemistry: {
        center: 'Chemistry',
        branches: [
            { label: 'Physical', color: '#6366f1', children: ['Thermochemistry', 'Equilibrium', 'Electrochemistry', 'Kinetics'] },
            { label: 'Organic', color: '#22c55e', children: ['Hydrocarbons', 'Alcohols/Ethers', 'Aldehydes', 'Polymers'] },
            { label: 'Inorganic', color: '#22d3ee', children: ['Periodic Table', 'Coordination', 'd-Block', 'p-Block'] },
            { label: 'Atomic Structure', color: '#f59e0b', children: ['Quantum Nos.', 'Orbitals', 'Electron Config'] },
            { label: 'Bonding', color: '#ef4444', children: ['Ionic', 'Covalent', 'VSEPR', 'Hybridization'] },
        ],
    },
    Biology: {
        center: 'Biology',
        branches: [
            { label: 'Cell Biology', color: '#6366f1', children: ['Cell Structure', 'Cell Division', 'Transport', 'Organelles'] },
            { label: 'Genetics', color: '#22d3ee', children: ['DNA/RNA', 'Inheritance', 'Mutations', 'Gene Regulation'] },
            { label: 'Physiology', color: '#22c55e', children: ['Digestion', 'Respiration', 'Circulation', 'Excretion'] },
            { label: 'Ecology', color: '#f59e0b', children: ['Ecosystems', 'Biodiversity', 'Food Chains', 'Conservation'] },
            { label: 'Botany', color: '#ef4444', children: ['Photosynthesis', 'Plant Growth', 'Reproduction', 'Morphology'] },
        ],
    },
};

const SUBJECTS = Object.keys(MIND_MAPS);

export default function MindMapsPage() {
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const map = MIND_MAPS[subject];

    return (
        <div className="max-w-4xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #8b5cf6, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">🧠 Mind Maps</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Visual topic relationship diagrams</p>
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

            {/* Mind map visualization */}
            <div className="glass p-8 rounded-2xl">
                {/* Center node */}
                <div className="flex justify-center mb-6">
                    <div className="px-6 py-3 rounded-2xl text-lg font-bold"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                        {map.center}
                    </div>
                </div>

                {/* Branches */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {map.branches.map((branch, i) => (
                        <div key={i} className="glass p-4 rounded-xl" style={{ borderTop: `3px solid ${branch.color}` }}>
                            <div className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ background: branch.color }} />
                                {branch.label}
                            </div>
                            <div className="space-y-1.5">
                                {branch.children.map((child, j) => (
                                    <div key={j} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: `${branch.color}11`, borderLeft: `2px solid ${branch.color}44`, color: 'var(--text-muted)' }}>
                                        {child}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
