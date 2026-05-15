'use client';

import { useState } from 'react';

const EXAMS = [
    {
        id: 'jee_main',
        name: 'JEE Main',
        maxMarks: 300,
        totalQ: 90,
        table: [
            { marks: 300, percentile: 99.99, rank: '1-10' },
            { marks: 280, percentile: 99.95, rank: '50-100' },
            { marks: 250, percentile: 99.8, rank: '100-500' },
            { marks: 220, percentile: 99.5, rank: '500-1500' },
            { marks: 200, percentile: 99, rank: '1500-5000' },
            { marks: 180, percentile: 98, rank: '5K-15K' },
            { marks: 150, percentile: 96, rank: '15K-40K' },
            { marks: 120, percentile: 93, rank: '40K-80K' },
            { marks: 100, percentile: 90, rank: '80K-120K' },
            { marks: 80, percentile: 85, rank: '120K-200K' },
            { marks: 60, percentile: 75, rank: '200K-350K' },
            { marks: 40, percentile: 60, rank: '350K-500K' },
        ],
    },
    {
        id: 'neet',
        name: 'NEET',
        maxMarks: 720,
        totalQ: 200,
        table: [
            { marks: 710, percentile: 99.99, rank: '1-10' },
            { marks: 680, percentile: 99.9, rank: '10-100' },
            { marks: 650, percentile: 99.5, rank: '100-500' },
            { marks: 600, percentile: 99, rank: '500-2K' },
            { marks: 550, percentile: 97, rank: '2K-10K' },
            { marks: 500, percentile: 95, rank: '10K-30K' },
            { marks: 450, percentile: 90, rank: '30K-60K' },
            { marks: 400, percentile: 85, rank: '60K-100K' },
            { marks: 350, percentile: 75, rank: '100K-200K' },
            { marks: 300, percentile: 60, rank: '200K-400K' },
            { marks: 250, percentile: 45, rank: '400K-600K' },
            { marks: 200, percentile: 30, rank: '600K-800K' },
        ],
    },
    {
        id: 'eamcet',
        name: 'EAMCET',
        maxMarks: 160,
        totalQ: 160,
        table: [
            { marks: 155, percentile: 99.9, rank: '1-50' },
            { marks: 140, percentile: 99, rank: '50-500' },
            { marks: 120, percentile: 97, rank: '500-3K' },
            { marks: 100, percentile: 93, rank: '3K-10K' },
            { marks: 80, percentile: 85, rank: '10K-25K' },
            { marks: 60, percentile: 70, rank: '25K-50K' },
            { marks: 40, percentile: 50, rank: '50K-80K' },
            { marks: 20, percentile: 25, rank: '80K+' },
        ],
    },
];

export default function RankPredictorPage() {
    const [examId, setExamId] = useState(EXAMS[0].id);
    const [marks, setMarks] = useState('');

    const exam = EXAMS.find(e => e.id === examId)!;
    const m = parseInt(marks) || 0;

    // Interpolate percentile
    const predict = () => {
        if (!m) return null;
        const table = exam.table;
        if (m >= table[0].marks) return table[0];
        if (m <= table[table.length - 1].marks) return table[table.length - 1];
        for (let i = 0; i < table.length - 1; i++) {
            if (m <= table[i].marks && m >= table[i + 1].marks) {
                const ratio = (m - table[i + 1].marks) / (table[i].marks - table[i + 1].marks);
                return {
                    marks: m,
                    percentile: parseFloat((table[i + 1].percentile + ratio * (table[i].percentile - table[i + 1].percentile)).toFixed(2)),
                    rank: table[i + 1].rank,
                };
            }
        }
        return null;
    };

    const prediction = predict();

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #f59e0b, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">📈 Rank Predictor</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Estimate your percentile and rank from marks</p>
                </div>
            </div>

            {/* Exam selector */}
            <div className="flex gap-2">
                {EXAMS.map(e => (
                    <button key={e.id} onClick={() => { setExamId(e.id); setMarks(''); }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: examId === e.id ? 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(34,211,238,0.2))' : 'var(--bg-card)',
                            border: examId === e.id ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--border)',
                            color: examId === e.id ? 'white' : 'var(--text-muted)',
                        }}>{e.name}</button>
                ))}
            </div>

            {/* Input */}
            <div className="glass p-5 rounded-xl">
                <label className="text-sm font-semibold block mb-2">Enter your marks (out of {exam.maxMarks})</label>
                <input type="number" value={marks} onChange={e => setMarks(e.target.value)}
                    min={0} max={exam.maxMarks} placeholder={`0 - ${exam.maxMarks}`}
                    className="w-full px-4 py-3 rounded-xl text-lg bg-transparent outline-none font-bold text-center"
                    style={{ border: '2px solid var(--border)', color: '#6366f1' }} />
            </div>

            {/* Prediction result */}
            {prediction && (
                <div className="glass p-6 rounded-2xl text-center slide-in" style={{ borderLeft: '3px solid #6366f1' }}>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Marks</div>
                            <div className="text-2xl font-bold" style={{ color: '#6366f1' }}>{m}/{exam.maxMarks}</div>
                        </div>
                        <div>
                            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Percentile</div>
                            <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>{prediction.percentile}%</div>
                        </div>
                        <div>
                            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Est. Rank</div>
                            <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{prediction.rank}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reference table */}
            <div className="glass overflow-hidden rounded-xl">
                <table className="w-full text-sm">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            {['Marks', 'Percentile', 'Approx. Rank'].map(h => (
                                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {exam.table.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-white/5">
                                <td className="px-4 py-2 font-medium">{row.marks}</td>
                                <td className="px-4 py-2" style={{ color: '#22c55e' }}>{row.percentile}%</td>
                                <td className="px-4 py-2" style={{ color: 'var(--text-muted)' }}>{row.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>⚠️ Predictions are estimates based on historical data</p>
        </div>
    );
}
