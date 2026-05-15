'use client';

import { useState } from 'react';

const VIDEO_LIBRARY: Record<string, { title: string; channel: string; url: string; duration: string; level: string }[]> = {
    Mathematics: [
        { title: 'Calculus — Limits & Continuity', channel: '3Blue1Brown', url: 'https://youtube.com/watch?v=WUvTyaaNkzM', duration: '18:00', level: 'Beginner' },
        { title: 'Linear Algebra — Essence of', channel: '3Blue1Brown', url: 'https://youtube.com/watch?v=fNk_zzaMoSs', duration: '16:00', level: 'Intermediate' },
        { title: 'Probability Explained', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=uzkc-qNVoOk', duration: '12:00', level: 'Beginner' },
        { title: 'Trigonometry Full Course', channel: 'Organic Chemistry Tutor', url: 'https://youtube.com/watch?v=PUB0TaZ7bhA', duration: '45:00', level: 'Beginner' },
        { title: 'Integration by Parts', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=QOB_GGCM9Wk', duration: '10:00', level: 'Intermediate' },
    ],
    Physics: [
        { title: 'Newton\'s Laws of Motion', channel: 'Physics Wallah', url: 'https://youtube.com/watch?v=example1', duration: '25:00', level: 'Beginner' },
        { title: 'Electrostatics — Coulomb\'s Law', channel: 'Walter Lewin', url: 'https://youtube.com/watch?v=example2', duration: '50:00', level: 'Advanced' },
        { title: 'Optics — Refraction & Reflection', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=example3', duration: '15:00', level: 'Beginner' },
        { title: 'Thermodynamics First Law', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=example4', duration: '20:00', level: 'Intermediate' },
        { title: 'Wave Motion & Sound', channel: 'Physics Wallah', url: 'https://youtube.com/watch?v=example5', duration: '30:00', level: 'Intermediate' },
    ],
    Chemistry: [
        { title: 'Atomic Structure', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=example6', duration: '22:00', level: 'Beginner' },
        { title: 'Chemical Bonding — VSEPR', channel: 'Organic Chemistry Tutor', url: 'https://youtube.com/watch?v=example7', duration: '35:00', level: 'Intermediate' },
        { title: 'Organic Chemistry Basics', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=example8', duration: '40:00', level: 'Beginner' },
        { title: 'Thermochemistry', channel: 'Professor Dave', url: 'https://youtube.com/watch?v=example9', duration: '28:00', level: 'Intermediate' },
        { title: 'Electrochemistry', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=example10', duration: '18:00', level: 'Advanced' },
    ],
    Biology: [
        { title: 'Cell Biology — Complete Overview', channel: 'Amoeba Sisters', url: 'https://youtube.com/watch?v=example11', duration: '30:00', level: 'Beginner' },
        { title: 'Genetics & DNA Replication', channel: 'Khan Academy', url: 'https://youtube.com/watch?v=example12', duration: '25:00', level: 'Intermediate' },
        { title: 'Human Physiology — Nervous System', channel: 'CrashCourse', url: 'https://youtube.com/watch?v=example13', duration: '15:00', level: 'Intermediate' },
        { title: 'Plant Biology — Photosynthesis', channel: 'Amoeba Sisters', url: 'https://youtube.com/watch?v=example14', duration: '12:00', level: 'Beginner' },
        { title: 'Ecology & Ecosystems', channel: 'CrashCourse', url: 'https://youtube.com/watch?v=example15', duration: '20:00', level: 'Beginner' },
    ],
};

const SUBJECTS = Object.keys(VIDEO_LIBRARY);

export default function VideosPage() {
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [levelFilter, setLevelFilter] = useState('All');

    const videos = VIDEO_LIBRARY[subject].filter(v =>
        levelFilter === 'All' || v.level === levelFilter
    );

    return (
        <div className="max-w-3xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #ef4444, transparent 60%)' }} />
                <div className="relative">
                    <h1 className="text-2xl font-bold">🎬 Video Resources</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Curated YouTube videos for each subject</p>
                </div>
            </div>

            {/* Subject tabs */}
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

            {/* Level filter */}
            <div className="flex gap-2">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map(l => (
                    <button key={l} onClick={() => setLevelFilter(l)}
                        className="px-3 py-1 rounded-full text-xs transition-all"
                        style={{
                            background: levelFilter === l ? 'rgba(99,102,241,0.15)' : 'transparent',
                            color: levelFilter === l ? '#6366f1' : 'var(--text-muted)',
                        }}>{l}</button>
                ))}
            </div>

            {/* Video cards */}
            <div className="space-y-3">
                {videos.map((v, i) => (
                    <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                        className="glass p-4 rounded-xl flex items-center gap-4 hover:scale-[1.01] transition-all block">
                        <div className="w-16 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                            style={{ background: 'rgba(239,68,68,0.15)' }}>▶️</div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate">{v.title}</div>
                            <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                <span>{v.channel}</span>
                                <span>·</span>
                                <span>{v.duration}</span>
                            </div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{
                            background: v.level === 'Beginner' ? 'rgba(34,197,94,0.15)' : v.level === 'Advanced' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                            color: v.level === 'Beginner' ? '#22c55e' : v.level === 'Advanced' ? '#ef4444' : '#f59e0b',
                        }}>{v.level}</span>
                    </a>
                ))}
            </div>
        </div>
    );
}
