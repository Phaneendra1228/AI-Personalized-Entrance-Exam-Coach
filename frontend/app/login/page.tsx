'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LANGUAGES } from '@/lib/i18n/translations';
import type { SupportedLocale } from '@/lib/i18n/translations';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Forgot password states
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'newpass'>('email');
    const [otp, setOtp] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // Social login popup states
    const [showSocial, setShowSocial] = useState<'google' | 'github' | null>(null);
    const [socialName, setSocialName] = useState('');
    const [socialEmail, setSocialEmail] = useState('');
    const [socialLoading, setSocialLoading] = useState(false);

    // Language picker after login
    const [showLangPicker, setShowLangPicker] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError('Please fill in all fields'); return; }
        setLoading(true); setError('');
        await new Promise(r => setTimeout(r, 1200));

        // Check if account exists in localStorage
        const accounts = JSON.parse(localStorage.getItem('lf-accounts') || '[]');
        const account = accounts.find((a: { email: string }) => a.email === email);
        if (!account) {
            setLoading(false);
            setError('No account found with this email. Please sign up first.');
            return;
        }
        if (account.password !== password) {
            setLoading(false);
            setError('Incorrect password. Try again or use Forgot Password.');
            return;
        }

        const userName = account?.name || email.split('@')[0];
        sessionStorage.setItem('lf-auth', JSON.stringify({ email, name: userName, loggedIn: true, loginDate: new Date().toISOString() }));
        // Also restore or create profile so avatar shows in header
        const existingProfile = localStorage.getItem('lf-profile-backup-' + email);
        if (existingProfile) {
            sessionStorage.setItem('lf-profile', existingProfile);
        } else {
            sessionStorage.setItem('lf-profile', JSON.stringify({ name: userName, avatar: '🧑‍🎓', exam: 'jee_main', examDate: '', dailyGoal: 120, notifications: true }));
        }
        setLoading(false);
        setShowLangPicker(true);
    };

    // ─── Forgot Password Flow ───
    const handleForgotEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail) { setError('Please enter your email'); return; }
        setError(''); setLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        // Generate a 6-digit OTP and show it in the UI (local demo)
        const code = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedOtp(code);
        setForgotStep('otp');
        setSuccess(`🔑 Your verification code is: ${code} (In production, this would be sent to your email)`);
        setLoading(false);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp !== generatedOtp) { setError('Invalid verification code'); return; }
        setError(''); setSuccess('');
        setForgotStep('newpass');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPassword || !confirmNewPassword) { setError('Please fill in both fields'); return; }
        if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (newPassword !== confirmNewPassword) { setError('Passwords do not match'); return; }
        setError(''); setLoading(true);
        await new Promise(r => setTimeout(r, 1000));

        // Save new password
        const accounts = JSON.parse(localStorage.getItem('lf-accounts') || '[]');
        const idx = accounts.findIndex((a: { email: string }) => a.email === forgotEmail);
        if (idx >= 0) accounts[idx].password = newPassword;
        else accounts.push({ email: forgotEmail, name: forgotEmail.split('@')[0], password: newPassword });
        localStorage.setItem('lf-accounts', JSON.stringify(accounts));

        setLoading(false);
        setSuccess('✅ Password reset successful! You can now sign in with your new password.');
        setTimeout(() => {
            setShowForgot(false); setForgotStep('email'); setSuccess('');
            setEmail(forgotEmail); setForgotEmail('');
        }, 2000);
    };

    // ─── Social Login Flow ───
    const handleSocialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!socialName || !socialEmail) { setError('Please fill in all fields'); return; }
        setError(''); setSocialLoading(true);
        await new Promise(r => setTimeout(r, 1200));

        sessionStorage.setItem('lf-auth', JSON.stringify({
            email: socialEmail, name: socialName, loggedIn: true,
            provider: showSocial, loginDate: new Date().toISOString(),
        }));
        sessionStorage.setItem('lf-profile', JSON.stringify({
            name: socialName, avatar: showSocial === 'google' ? '🟢' : '⚫',
            exam: 'jee_main', examDate: '', dailyGoal: 120, notifications: true,
        }));
        setSocialLoading(false);
        setShowSocial(null);
        setShowLangPicker(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* ─── Animated Background Styles ─── */}
            <style>{`
                .login-bg {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    background: linear-gradient(135deg, #0a0a1a 0%, #0d1033 25%, #0a0e27 50%, #0f0a2e 75%, #0a0a1a 100%);
                    overflow: hidden;
                }
                .login-bg::before {
                    content: '';
                    position: absolute;
                    inset: -50%;
                    background: conic-gradient(from 0deg at 50% 50%,
                        #6366f1 0deg, #8b5cf6 60deg, #22d3ee 120deg,
                        #06b6d4 180deg, #6366f1 240deg, #a855f7 300deg, #6366f1 360deg);
                    opacity: 0.15;
                    animation: loginBgRotate 20s linear infinite;
                    filter: blur(80px);
                }
                .login-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.2) 0%, transparent 50%),
                                radial-gradient(ellipse at 70% 80%, rgba(34,211,238,0.15) 0%, transparent 50%),
                                radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.1) 0%, transparent 60%);
                    animation: loginBgPulse 8s ease-in-out infinite alternate;
                }
                @keyframes loginBgRotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes loginBgPulse {
                    0% { opacity: 0.6; }
                    100% { opacity: 1; }
                }

                /* Floating orbs */
                .login-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.3;
                    animation: loginOrbFloat 15s ease-in-out infinite;
                }
                .login-orb:nth-child(1) {
                    width: 400px; height: 400px;
                    background: #6366f1;
                    top: -10%; left: -5%;
                    animation-duration: 18s;
                }
                .login-orb:nth-child(2) {
                    width: 350px; height: 350px;
                    background: #22d3ee;
                    bottom: -15%; right: -10%;
                    animation-duration: 22s;
                    animation-delay: -5s;
                }
                .login-orb:nth-child(3) {
                    width: 300px; height: 300px;
                    background: #a855f7;
                    top: 50%; left: 60%;
                    animation-duration: 20s;
                    animation-delay: -10s;
                }
                .login-orb:nth-child(4) {
                    width: 250px; height: 250px;
                    background: #f59e0b;
                    top: 20%; right: 10%;
                    opacity: 0.15;
                    animation-duration: 25s;
                    animation-delay: -3s;
                }
                @keyframes loginOrbFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(30px, -40px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.95); }
                    75% { transform: translate(40px, 30px) scale(1.05); }
                }

                /* Floating particles */
                .login-particle {
                    position: absolute;
                    width: 3px; height: 3px;
                    background: white;
                    border-radius: 50%;
                    opacity: 0;
                    animation: loginParticleRise linear infinite;
                }
                @keyframes loginParticleRise {
                    0% { opacity: 0; transform: translateY(100vh) scale(0); }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.4; }
                    100% { opacity: 0; transform: translateY(-10vh) scale(1); }
                }

                /* Grid lines */
                .login-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
                    background-size: 60px 60px;
                    animation: loginGridMove 30s linear infinite;
                    mask-image: radial-gradient(ellipse at center, black 30%, transparent 70%);
                }
                @keyframes loginGridMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }

                /* Card glass effect override */
                .login-card-glass {
                    background: rgba(15, 15, 35, 0.6) !important;
                    backdrop-filter: blur(20px) saturate(1.5) !important;
                    border: 1px solid rgba(99,102,241,0.2) !important;
                    box-shadow: 0 0 40px rgba(99,102,241,0.1),
                                0 0 80px rgba(34,211,238,0.05),
                                inset 0 1px 0 rgba(255,255,255,0.05) !important;
                }

                /* Shooting stars */
                .login-star {
                    position: absolute;
                    width: 80px; height: 1px;
                    background: linear-gradient(90deg, #6366f1, transparent);
                    opacity: 0;
                    animation: loginShoot 4s ease-in-out infinite;
                }
                .login-star:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; transform: rotate(-30deg); }
                .login-star:nth-child(2) { top: 45%; left: 70%; animation-delay: 2s; transform: rotate(-25deg); width: 60px; }
                .login-star:nth-child(3) { top: 75%; left: 30%; animation-delay: 3.5s; transform: rotate(-35deg); width: 100px; }
                @keyframes loginShoot {
                    0% { opacity: 0; transform: translateX(0) rotate(-30deg); }
                    5% { opacity: 0.8; }
                    15% { opacity: 0; transform: translateX(200px) rotate(-30deg); }
                    100% { opacity: 0; }
                }
            `}</style>

            {/* ─── Video Background ─── */}
            <div className="fixed inset-0 z-0 overflow-hidden bg-black">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                >
                    <source src="https://cdn.pixabay.com/video/2023/10/22/186121-877013183_large.mp4" type="video/mp4" />
                </video>
                {/* Dark overlay to ensure the login card text is always readable */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a]/80 via-[#0d1033]/60 to-[#0f0a2e]/80 backdrop-blur-[1px]"></div>
            </div>

            {/* ─── Language Picker Modal ─── */}
            {showLangPicker && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
                    <div className="relative w-full max-w-sm login-card-glass p-8 rounded-2xl mx-4 slide-in">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">🌐</div>
                            <h2 className="text-xl font-bold" style={{ color: '#fff' }}>Choose Your Language</h2>
                            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Select your preferred language for the app</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {LANGUAGES.map((lang: { code: SupportedLocale; label: string; flag: string }) => {
                                const isSelected = (typeof window !== 'undefined' && localStorage.getItem('lf-lang') === lang.code) || (!localStorage.getItem('lf-lang') && lang.code === 'en');
                                return (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            localStorage.setItem('lf-lang', lang.code);
                                            window.location.href = '/';
                                        }}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.03]"
                                        style={{
                                            background: isSelected ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                                            border: `1px solid ${isSelected ? '#6366f1' : 'rgba(99,102,241,0.2)'}`,
                                            color: isSelected ? '#a5b4fc' : '#fff',
                                        }}
                                    >
                                        <span className="text-lg">{lang.flag}</span>
                                        <span>{lang.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Social Login Popup ─── */}
            {showSocial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => { setShowSocial(null); setError(''); }}>
                    <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
                    <div className="relative w-full max-w-sm login-card-glass p-6 rounded-2xl mx-4 slide-in" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-5">
                            <div className="text-4xl mb-2">{showSocial === 'google' ? '🔵' : '⚫'}</div>
                            <h2 className="text-lg font-bold" style={{ color: '#fff' }}>
                                Sign in with {showSocial === 'google' ? 'Google' : 'GitHub'}
                            </h2>
                            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                Enter your {showSocial === 'google' ? 'Google' : 'GitHub'} account details
                            </p>
                        </div>

                        {error && <div className="mb-3 p-2 rounded-lg text-xs text-center" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>❌ {error}</div>}

                        <form onSubmit={handleSocialSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Full Name</label>
                                <input type="text" value={socialName} onChange={e => setSocialName(e.target.value)}
                                    placeholder="John Doe" autoFocus
                                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                                    style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
                                <input type="email" value={socialEmail} onChange={e => setSocialEmail(e.target.value)}
                                    placeholder={showSocial === 'google' ? 'you@gmail.com' : 'you@github.com'}
                                    className="w-full px-4 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                                    style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                            </div>
                            <button type="submit" disabled={socialLoading}
                                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                                style={{
                                    background: showSocial === 'google' ? '#4285F4' : '#333',
                                    color: 'white',
                                }}>
                                {socialLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : `Continue with ${showSocial === 'google' ? 'Google' : 'GitHub'}`}
                            </button>
                        </form>

                        <button onClick={() => { setShowSocial(null); setError(''); }}
                            className="w-full text-xs mt-3 hover:underline" style={{ color: 'rgba(255,255,255,0.5)' }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* ─── Main Card ─── */}
            <div className="relative z-10 w-full max-w-md login-card-glass p-8 rounded-2xl slide-in">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold glow mb-4"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>LF</div>
                    <h1 className="text-2xl font-bold gradient-text">
                        {showForgot ? (forgotStep === 'email' ? 'Forgot Password' : forgotStep === 'otp' ? 'Verify Code' : 'New Password') : 'Welcome Back'}
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {showForgot
                            ? forgotStep === 'email' ? 'Enter your email to reset password'
                                : forgotStep === 'otp' ? 'Enter the verification code'
                                    : 'Create your new password'
                            : 'Sign in to continue learning'}
                    </p>
                </div>

                {success && (
                    <div className="mb-4 p-3 rounded-xl text-xs text-center" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>
                        {success}
                    </div>
                )}
                {error && !showSocial && (
                    <div className="mb-4 p-3 rounded-xl text-xs text-center" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                        ❌ {error}
                    </div>
                )}

                {showForgot ? (
                    /* ─── Forgot Password Steps ─── */
                    <>
                        {forgotStep === 'email' && (
                            <form onSubmit={handleForgotEmail} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email Address</label>
                                    <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                                        placeholder="you@example.com" autoFocus
                                        className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                                        style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                                    {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span> : '📧 Get Verification Code'}
                                </button>
                            </form>
                        )}

                        {forgotStep === 'otp' && (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>6-Digit Verification Code</label>
                                    <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="000000" maxLength={6} autoFocus
                                        className="w-full px-4 py-3 rounded-xl text-lg bg-transparent outline-none text-center tracking-[0.5em] font-mono font-bold"
                                        style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                                </div>
                                <button type="submit"
                                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                                    ✓ Verify Code
                                </button>
                            </form>
                        )}

                        {forgotStep === 'newpass' && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>New Password</label>
                                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Min 6 characters" autoFocus
                                        className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                                        style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Confirm New Password</label>
                                    <input type="password" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none"
                                        style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                                    style={{ background: 'linear-gradient(135deg, #22c55e, #14b8a6)', color: 'white' }}>
                                    {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Resetting...</span> : '🔒 Reset Password'}
                                </button>
                            </form>
                        )}

                        <button onClick={() => { setShowForgot(false); setForgotStep('email'); setError(''); setSuccess(''); setOtp(''); setNewPassword(''); setConfirmNewPassword(''); }}
                            className="w-full text-xs mt-4 hover:underline" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            ← Back to login
                        </button>
                    </>
                ) : (
                    /* ─── Main Login Form ─── */
                    <>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
                                    style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl text-sm bg-transparent outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
                                    style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#fff' }} />
                            </div>

                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    <input type="checkbox" className="rounded" style={{ accentColor: '#6366f1' }} /> Remember me
                                </label>
                                <button type="button" onClick={() => { setShowForgot(true); setError(''); }}
                                    className="hover:underline" style={{ color: '#6366f1' }}>Forgot password?</button>
                            </div>

                            <button type="submit" disabled={loading}
                                className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Signing in...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-6">
                            <div className="flex-1 h-px" style={{ background: 'rgba(99,102,241,0.2)' }} />
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>or continue with</span>
                            <div className="flex-1 h-px" style={{ background: 'rgba(99,102,241,0.2)' }} />
                        </div>

                        {/* Social logins — opens account picker popup */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={(e) => { 
                                e.preventDefault(); 
                                sessionStorage.setItem('auth-intent', 'true');
                                import('next-auth/react').then((mod) => mod.signIn('google', { callbackUrl: '/' })); 
                            }}
                                className="py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', color: '#fff' }}>
                                <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.6-3.5-11.2-8.2l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.2-2.7-.4-3.9z" /></svg>
                                Google
                            </button>
                            <button onClick={(e) => { 
                                e.preventDefault(); 
                                sessionStorage.setItem('auth-intent', 'true');
                                import('next-auth/react').then((mod) => mod.signIn('github', { callbackUrl: '/' })); 
                            }}
                                className="py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.2)', color: '#fff' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                                GitHub
                            </button>
                        </div>
                    </>
                )}

                <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-semibold hover:underline" style={{ color: '#6366f1' }}>Sign up free</Link>
                </p>
            </div>
        </div>
    );
}
