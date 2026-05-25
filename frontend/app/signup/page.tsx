'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [exam, setExam] = useState('jee_main');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const EXAMS = [
        { id: 'jee_main', label: 'JEE Main' },
        { id: 'jee_advanced', label: 'JEE Advanced' },
        { id: 'eamcet_mpc', label: 'EAMCET (MPC)' },
        { id: 'eamcet_bipc', label: 'EAMCET (BiPC)' },
        { id: 'neet', label: 'NEET' },
    ];

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email)) return false;
        
        const [username, domain] = email.toLowerCase().split('@');
        
        // Reject numbers-only usernames (e.g., 123@gmail.com)
        if (/^\d+$/.test(username)) return false;
        
        // Reject dummy usernames
        const fakeUsernames = ['test', 'example', 'fake', 'dummy', 'abc', 'admin'];
        if (fakeUsernames.includes(username)) return false;
        
        // Reject dummy domains
        const fakeDomains = ['example.com', 'test.com', 'fake.com'];
        if (fakeDomains.includes(domain)) return false;
        
        return true;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !confirm) { setError('Please fill in all fields'); return; }
        if (!validateEmail(email)) { setError('Please enter a valid, real email address'); return; }
        if (password !== confirm) { setError('Passwords do not match'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

        // Check if account already exists
        const accounts = JSON.parse(localStorage.getItem('lf-accounts') || '[]');
        const existing = accounts.find((a: { email: string }) => a.email === email);
        if (existing) {
            setError('An account with this email already exists. Please sign in instead.');
            return;
        }

        setLoading(true); setError('');
        await new Promise(r => setTimeout(r, 1500));

        // Save account to persistent storage
        accounts.push({ email, name, password });
        localStorage.setItem('lf-accounts', JSON.stringify(accounts));

        sessionStorage.setItem('lf-auth', JSON.stringify({ email, name, loggedIn: true, loginDate: new Date().toISOString() }));
        sessionStorage.setItem('lf-profile', JSON.stringify({ name, avatar: '🧑‍🎓', exam, examDate: '', dailyGoal: 120, notifications: true }));
        router.push('/onboarding');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-primary)' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#22d3ee', top: '15%', right: '25%' }} />
                <div className="absolute w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: '#6366f1', bottom: '15%', left: '25%' }} />
            </div>

            <div className="relative w-full max-w-md glass p-8 rounded-2xl slide-in">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold glow mb-4"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>LF</div>
                    <h1 className="text-2xl font-bold gradient-text">Create Account</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Start your learning journey today</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-3">
                    <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                            className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                            className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••"
                                className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Confirm</label>
                            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••"
                                className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                                style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Target Exam</label>
                        <div className="flex flex-wrap gap-2">
                            {EXAMS.map(ex => (
                                <button key={ex.id} type="button" onClick={() => setExam(ex.id)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={{
                                        background: exam === ex.id ? 'rgba(99,102,241,0.2)' : 'var(--bg-primary)',
                                        border: exam === ex.id ? '1px solid #6366f1' : '1px solid var(--border)',
                                        color: exam === ex.id ? '#6366f1' : 'var(--text-muted)',
                                    }}>{ex.label}</button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-xs text-center" style={{ color: '#ef4444' }}>{error}</p>}

                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating account...
                            </span>
                        ) : '🚀 Create Account'}
                    </button>
                </form>

                <p className="text-center text-xs mt-5" style={{ color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold hover:underline" style={{ color: '#6366f1' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
