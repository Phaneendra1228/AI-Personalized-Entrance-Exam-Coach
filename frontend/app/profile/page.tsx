'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';

const AVATARS = ['🧑‍🎓', '👩‍🎓', '🧑‍💻', '👩‍🔬', '🧑‍🏫', '👩‍⚕️', '🧑‍🔧', '👩‍💼', '🦸', '🧙', '🎯', '🚀'];

const EXAMS = [
    { id: 'jee_main', label: 'JEE Main' },
    { id: 'jee_advanced', label: 'JEE Advanced' },
    { id: 'eamcet_mpc', label: 'EAMCET (MPC)' },
    { id: 'eamcet_bipc', label: 'EAMCET (BiPC)' },
    { id: 'neet', label: 'NEET' },
];

interface Profile {
    name: string;
    avatar: string;
    photoUrl: string;
    exam: string;
    examDate: string;
    dailyGoal: number;
    notifications: boolean;
}

const DEFAULT_PROFILE: Profile = {
    name: 'Student',
    avatar: '🧑‍🎓',
    photoUrl: '',
    exam: 'jee_main',
    examDate: '',
    dailyGoal: 120,
    notifications: true,
};

export default function ProfilePage() {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
    const [saved, setSaved] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const data = sessionStorage.getItem('lf-profile');
        if (data) {
            const parsed = JSON.parse(data);
            setProfile({ ...DEFAULT_PROFILE, ...parsed });
            if (parsed.photoUrl) setPhotoPreview(parsed.photoUrl);
        }
    }, []);

    const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
        setProfile(prev => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, etc.)');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be under 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;

            // Resize image to save localStorage space (max 200x200)
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = 200;
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d')!;

                // Crop to square from center
                const minDim = Math.min(img.width, img.height);
                const sx = (img.width - minDim) / 2;
                const sy = (img.height - minDim) / 2;
                ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

                const resized = canvas.toDataURL('image/jpeg', 0.8);
                setPhotoPreview(resized);
                update('photoUrl', resized);
                update('avatar', ''); // Clear emoji avatar when photo is set
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    const removePhoto = () => {
        setPhotoPreview('');
        update('photoUrl', '');
        update('avatar', '🧑‍🎓');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const save = () => {
        sessionStorage.setItem('lf-profile', JSON.stringify(profile));
        // Notify Header component to update avatar immediately
        window.dispatchEvent(new Event('lf-profile-updated'));
        // Back up profile to localStorage so it survives session restart
        const auth = sessionStorage.getItem('lf-auth');
        if (auth) {
            try { const a = JSON.parse(auth); if (a.email) localStorage.setItem('lf-profile-backup-' + a.email, JSON.stringify(profile)); } catch { }
        }
        if (profile.examDate) localStorage.setItem('lf-exam-date', profile.examDate);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const displayAvatar = photoPreview || profile.photoUrl;

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            {/* Header with profile picture */}
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #6366f1, transparent 60%)' }} />
                <div className="relative flex items-center gap-4">
                    {displayAvatar ? (
                        <img src={displayAvatar} alt="Profile"
                            className="w-16 h-16 rounded-2xl object-cover"
                            style={{ border: '3px solid #6366f1' }} />
                    ) : (
                        <div className="text-5xl">{profile.avatar}</div>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold">{profile.name || 'Student'}</h1>
                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {EXAMS.find(e => e.id === profile.exam)?.label || 'No exam selected'} Aspirant
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Photo Upload */}
            <div className="glass p-5 rounded-xl">
                <h3 className="font-semibold text-sm mb-3">{t('profile.profilePhoto')}</h3>
                <div className="flex items-center gap-4">
                    {/* Preview */}
                    <div className="relative">
                        {displayAvatar ? (
                            <img src={displayAvatar} alt="Preview"
                                className="w-20 h-20 rounded-2xl object-cover"
                                style={{ border: '2px solid #6366f1' }} />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
                                style={{ background: 'var(--bg-primary)', border: '2px dashed var(--border)' }}>
                                {profile.avatar}
                            </div>
                        )}
                        {displayAvatar && (
                            <button onClick={removePhoto}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center"
                                style={{ background: '#ef4444', color: 'white', fontSize: '10px' }}>✕</button>
                        )}
                    </div>

                    {/* Upload buttons */}
                    <div className="flex-1 space-y-2">
                        <label className="block py-2.5 px-4 rounded-xl text-sm font-semibold text-center cursor-pointer transition-all hover:scale-[1.02]"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                            📷 Upload Photo
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                            JPG, PNG or GIF · Max 5MB · Will be cropped to square
                        </p>
                    </div>
                </div>
            </div>

            {/* Avatar Selection (fallback) */}
            <div className="glass p-5 rounded-xl">
                <h3 className="font-semibold text-sm mb-3">{t('profile.emojiAvatar')}</h3>
                <div className="flex flex-wrap gap-3">
                    {AVATARS.map(a => (
                        <button key={a} onClick={() => { update('avatar', a); update('photoUrl', ''); setPhotoPreview(''); }}
                            className="text-3xl p-2 rounded-xl transition-all hover:scale-110"
                            style={{
                                background: !displayAvatar && profile.avatar === a ? 'rgba(99,102,241,0.2)' : 'var(--bg-primary)',
                                border: !displayAvatar && profile.avatar === a ? '2px solid #6366f1' : '2px solid var(--border)',
                            }}>
                            {a}
                        </button>
                    ))}
                </div>
            </div>

            {/* Name */}
            <div className="glass p-5 rounded-xl">
                <h3 className="font-semibold text-sm mb-3">{t('profile.studentName')}</h3>
                <input value={profile.name} onChange={e => update('name', e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-lg text-sm bg-transparent outline-none"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>

            {/* Target Exam */}
            <div className="glass p-5 rounded-xl">
                <h3 className="font-semibold text-sm mb-3">{t('profile.targetExam')}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {EXAMS.map(exam => (
                        <button key={exam.id} onClick={() => update('exam', exam.id)}
                            className="p-3 rounded-xl text-sm font-medium transition-all hover:scale-105"
                            style={{
                                background: profile.exam === exam.id ? 'rgba(99,102,241,0.2)' : 'var(--bg-primary)',
                                border: profile.exam === exam.id ? '2px solid #6366f1' : '2px solid var(--border)',
                                color: profile.exam === exam.id ? '#6366f1' : 'var(--text-muted)',
                            }}>
                            {exam.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Exam Date */}
            <div className="glass p-5 rounded-xl">
                <h3 className="font-semibold text-sm mb-3">{t('profile.examDate')}</h3>
                <input type="date" value={profile.examDate} onChange={e => update('examDate', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg text-sm bg-transparent outline-none"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            </div>

            {/* Daily Study Goal */}
            <div className="glass p-5 rounded-xl">
                <h3 className="font-semibold text-sm mb-3">{t('profile.dailyGoal')}</h3>
                <div className="flex items-center gap-4">
                    <input type="range" min={30} max={480} step={30} value={profile.dailyGoal}
                        onChange={e => update('dailyGoal', Number(e.target.value))}
                        className="flex-1" style={{ accentColor: '#6366f1' }} />
                    <span className="text-lg font-bold w-20 text-right" style={{ color: '#6366f1' }}>
                        {profile.dailyGoal} min
                    </span>
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    That&apos;s {Math.floor(profile.dailyGoal / 60)}h {profile.dailyGoal % 60}m per day
                </p>
            </div>

            {/* Notifications toggle */}
            <div className="glass p-5 rounded-xl flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-sm">🔔 Notifications</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Get reminders for study sessions</p>
                </div>
                <button onClick={() => update('notifications', !profile.notifications)}
                    className="w-12 h-6 rounded-full transition-all"
                    style={{ background: profile.notifications ? '#6366f1' : 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                    <div className="w-5 h-5 rounded-full transition-all"
                        style={{
                            background: 'white',
                            transform: profile.notifications ? 'translateX(24px)' : 'translateX(2px)',
                        }} />
                </button>
            </div>

            {/* Save button */}
            <button onClick={save}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{
                    background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg, #6366f1, #22d3ee)',
                    color: saved ? '#22c55e' : 'white',
                    border: saved ? '1px solid #22c55e44' : 'none',
                }}>
                {saved ? t('profile.savedSuccess') : t('profile.saveProfile')}
            </button>
        </div>
    );
}
