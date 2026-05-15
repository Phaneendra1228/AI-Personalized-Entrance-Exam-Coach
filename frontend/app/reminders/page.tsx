'use client';

import { useState, useEffect, useCallback } from 'react';

interface Reminder { id: string; title: string; time: string; days: string[]; active: boolean; subject: string; }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SUBJECTS = ['General', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Revision'];

export default function RemindersPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('09:00');
    const [days, setDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    const [subject, setSubject] = useState('General');
    const [permission, setPermission] = useState<NotificationPermission>('default');

    useEffect(() => {
        const saved = localStorage.getItem('lf-reminders');
        if (saved) setReminders(JSON.parse(saved));
        if (typeof Notification !== 'undefined') setPermission(Notification.permission);
    }, []);

    const requestPermission = async () => {
        if (typeof Notification !== 'undefined') {
            const result = await Notification.requestPermission();
            setPermission(result);
        }
    };

    const save = useCallback((r: Reminder[]) => {
        setReminders(r);
        localStorage.setItem('lf-reminders', JSON.stringify(r));
    }, []);

    const addReminder = () => {
        if (!title.trim()) return;
        const reminder: Reminder = { id: Date.now().toString(), title: title.trim(), time, days, active: true, subject };
        save([...reminders, reminder]);
        setTitle(''); setTime('09:00'); setDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']); setShowForm(false);
    };

    const toggleDay = (day: string) => {
        setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
    };

    const toggleActive = (id: string) => {
        save(reminders.map(r => r.id === id ? { ...r, active: !r.active } : r));
    };

    const remove = (id: string) => save(reminders.filter(r => r.id !== id));

    // Check reminders every minute
    useEffect(() => {
        const check = () => {
            if (permission !== 'granted') return;
            const now = new Date();
            const currentDay = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1];
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            reminders.forEach(r => {
                if (r.active && r.days.includes(currentDay) && r.time === currentTime) {
                    new Notification(`📚 Study Reminder: ${r.title}`, { body: `Time to study ${r.subject}!`, icon: '📚' });
                }
            });
        };
        const id = setInterval(check, 60000);
        return () => clearInterval(id);
    }, [reminders, permission]);

    return (
        <div className="max-w-2xl mx-auto space-y-6 slide-in">
            <div className="glass p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 80% 50%, #f59e0b, transparent 60%)' }} />
                <div className="relative flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">🔔 Study Reminders</h1>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Set reminders to stay on track</p>
                    </div>
                    <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>+ Add Reminder</button>
                </div>
            </div>

            {/* Notification permission */}
            {permission !== 'granted' && (
                <div className="glass p-4 rounded-xl flex items-center justify-between" style={{ borderLeft: '3px solid #f59e0b' }}>
                    <div>
                        <div className="text-sm font-semibold">Enable Notifications</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Allow browser notifications for reminders</div>
                    </div>
                    <button onClick={requestPermission} className="px-4 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid #f59e0b44' }}>Enable</button>
                </div>
            )}

            {/* Add form */}
            {showForm && (
                <div className="glass p-5 rounded-xl space-y-3" style={{ borderLeft: '3px solid #6366f1' }}>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Reminder title..."
                        className="w-full px-3 py-2 rounded-lg text-sm bg-transparent outline-none"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                    <div className="flex items-center gap-3">
                        <input type="time" value={time} onChange={e => setTime(e.target.value)}
                            className="px-3 py-2 rounded-lg text-sm bg-transparent outline-none"
                            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
                        <select value={subject} onChange={e => setSubject(e.target.value)}
                            className="px-3 py-2 rounded-lg text-sm bg-transparent outline-none"
                            style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        {DAYS.map(d => (
                            <button key={d} onClick={() => toggleDay(d)}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                                style={{
                                    background: days.includes(d) ? '#6366f1' : 'var(--bg-primary)',
                                    color: days.includes(d) ? 'white' : 'var(--text-muted)',
                                    border: '1px solid var(--border)',
                                }}>{d}</button>
                        ))}
                    </div>
                    <button onClick={addReminder} className="w-full py-2 rounded-lg text-sm font-semibold"
                        style={{ background: '#6366f1', color: 'white' }}>Save Reminder</button>
                </div>
            )}

            {/* Reminders list */}
            {reminders.length === 0 ? (
                <div className="glass p-10 text-center rounded-2xl">
                    <div className="text-5xl mb-3">🔔</div>
                    <p style={{ color: 'var(--text-muted)' }}>No reminders set. Add one to stay on track!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {reminders.map(r => (
                        <div key={r.id} className="glass p-4 rounded-xl flex items-center gap-4"
                            style={{ opacity: r.active ? 1 : 0.5 }}>
                            <button onClick={() => toggleActive(r.id)}
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-all"
                                style={{ borderColor: r.active ? '#22c55e' : 'var(--border)', background: r.active ? '#22c55e' : 'transparent', color: 'white' }}>
                                {r.active ? '✓' : ''}
                            </button>
                            <div className="flex-1">
                                <div className="text-sm font-semibold">{r.title}</div>
                                <div className="text-xs flex items-center gap-2 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    <span>⏰ {r.time}</span>
                                    <span>·</span>
                                    <span>{r.subject}</span>
                                    <span>·</span>
                                    <span>{r.days.join(', ')}</span>
                                </div>
                            </div>
                            <button onClick={() => remove(r.id)} className="text-xs opacity-50 hover:opacity-100" style={{ color: '#ef4444' }}>🗑</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
