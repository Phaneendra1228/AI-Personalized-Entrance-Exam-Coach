'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getDomains, getAnalytics } from '@/lib/api';
import type { Domain, Analytics } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

// ─── Motivational Quotes ─────────────────────────────────
const QUOTES = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Genius is 1% inspiration and 99% perspiration.", author: "Thomas Edison" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
];

function getDailyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}

// ─── Pomodoro Timer Widget ─────────────────────────────────
function PomodoroWidget() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          setRunning(false);
          setMode(m => m === 'work' ? 'break' : 'work');
          return mode === 'work' ? 5 * 60 : 25 * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  const pct = mode === 'work' ? ((25 * 60 - seconds) / (25 * 60)) * 100 : ((5 * 60 - seconds) / (5 * 60)) * 100;

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">⏱ Pomodoro Timer</h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{
          background: mode === 'work' ? 'rgba(99,102,241,0.15)' : 'rgba(34,197,94,0.15)',
          color: mode === 'work' ? '#6366f1' : '#22c55e',
        }}>
          {mode === 'work' ? '🎯 Focus' : '☕ Break'}
        </span>
      </div>
      <div className="text-center">
        <div className="text-4xl font-bold font-mono mb-3" style={{ color: mode === 'work' ? '#6366f1' : '#22c55e' }}>
          {mins}:{secs}
        </div>
        <div className="h-1.5 rounded-full mb-4" style={{ background: 'var(--bg-primary)' }}>
          <div className="h-1.5 rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: mode === 'work' ? '#6366f1' : '#22c55e' }} />
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={() => setRunning(!running)}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
            style={{ background: running ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)', color: running ? '#ef4444' : '#6366f1', border: `1px solid ${running ? '#ef4444' : '#6366f1'}44` }}>
            {running ? '⏸ Pause' : '▶ Start'}
          </button>
          <button onClick={() => { setRunning(false); setSeconds(mode === 'work' ? 25 * 60 : 5 * 60); }}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            ↻ Reset
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Exam Countdown Widget ──────────────────────────────────
function ExamCountdownWidget() {
  const [target, setTarget] = useState('');
  const [diff, setDiff] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('lf-exam-date');
    if (saved) setTarget(saved);
  }, []);

  useEffect(() => {
    if (!target) return;
    const calc = () => {
      const ms = new Date(target).getTime() - Date.now();
      if (ms <= 0) { setDiff({ days: 0, hours: 0, mins: 0 }); return; }
      setDiff({ days: Math.floor(ms / 86400000), hours: Math.floor((ms % 86400000) / 3600000), mins: Math.floor((ms % 3600000) / 60000) });
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [target]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTarget(e.target.value);
    localStorage.setItem('lf-exam-date', e.target.value);
  };

  return (
    <div className="glass p-5">
      <h3 className="font-semibold text-sm mb-3">🎯 Exam Countdown</h3>
      <input type="date" value={target} onChange={handleChange}
        className="w-full px-3 py-2 rounded-lg text-xs mb-3 bg-transparent outline-none"
        style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
      {target ? (
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { v: diff.days, l: 'Days', c: '#6366f1' },
            { v: diff.hours, l: 'Hours', c: '#22d3ee' },
            { v: diff.mins, l: 'Mins', c: '#f59e0b' },
          ].map(({ v, l, c }) => (
            <div key={l} className="p-3 rounded-xl" style={{ background: `${c}11`, border: `1px solid ${c}33` }}>
              <div className="text-2xl font-bold" style={{ color: c }}>{v}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{l}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>Set your exam date above ↑</p>
      )}
    </div>
  );
}

// ─── Sticky Notes Widget ─────────────────────────────────────
const NOTE_COLORS = ['#6366f1', '#22d3ee', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6'];

interface StickyNote { id: string; text: string; color: string; }

function StickyNotesWidget() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('lf-sticky-notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const save = useCallback((n: StickyNote[]) => {
    setNotes(n);
    localStorage.setItem('lf-sticky-notes', JSON.stringify(n));
  }, []);

  const add = () => {
    if (!input.trim()) return;
    save([...notes, { id: Date.now().toString(), text: input.trim(), color: NOTE_COLORS[notes.length % NOTE_COLORS.length] }]);
    setInput('');
  };

  const remove = (id: string) => save(notes.filter(n => n.id !== id));

  return (
    <div className="glass p-5">
      <h3 className="font-semibold text-sm mb-3">📝 Sticky Notes</h3>
      <div className="flex gap-2 mb-3">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a note..."
          className="flex-1 px-3 py-2 rounded-lg text-xs bg-transparent outline-none"
          style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        <button onClick={add} className="px-3 py-2 rounded-lg text-xs font-semibold hover:scale-105 transition-all"
          style={{ background: 'rgba(99,102,241,0.2)', color: '#6366f1', border: '1px solid #6366f144' }}>+</button>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {notes.length === 0 && <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>No notes yet</p>}
        {notes.map(n => (
          <div key={n.id} className="flex items-start gap-2 p-2 rounded-lg text-xs" style={{ background: `${n.color}11`, borderLeft: `3px solid ${n.color}` }}>
            <span className="flex-1">{n.text}</span>
            <button onClick={() => remove(n.id)} className="text-xs opacity-50 hover:opacity-100 shrink-0">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Study Streak Widget ──────────────────────────────────────
function StudyStreakWidget() {
  const [streakData, setStreakData] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('lf-streak');
    if (saved) setStreakData(JSON.parse(saved));
    // Mark today as studied
    const today = new Date().toISOString().slice(0, 10);
    setStreakData(prev => {
      const upd = { ...prev, [today]: (prev[today] || 0) + 1 };
      localStorage.setItem('lf-streak', JSON.stringify(upd));
      return upd;
    });
  }, []);

  // Generate last 35 days
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const key = d.toISOString().slice(0, 10);
    const count = streakData[key] || 0;
    return { key, count, day: d.getDate() };
  });

  const currentStreak = (() => {
    let streak = 0;
    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i].count > 0) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">🔥 Study Streak</h3>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
          {currentStreak} day{currentStreak !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {cells.map(c => (
          <div key={c.key} className="heatmap-cell" title={`${c.key}: ${c.count} sessions`}
            style={{ background: c.count === 0 ? 'var(--bg-primary)' : c.count === 1 ? '#6366f144' : c.count <= 3 ? '#6366f188' : '#6366f1' }} />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span>Less</span>
        {[0, 1, 2, 4].map(v => (
          <div key={v} className="heatmap-cell" style={{ background: v === 0 ? 'var(--bg-primary)' : v === 1 ? '#6366f144' : v === 2 ? '#6366f188' : '#6366f1' }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

// ─── Daily Login Rewards Widget ───────────────────────────────
function DailyRewardWidget() {
  const [claimed, setClaimed] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('lf-daily-claim');
    const loginStreak = parseInt(localStorage.getItem('lf-login-streak') || '0');
    setStreak(loginStreak);
    if (lastClaim === today) setClaimed(true);
  }, []);

  const claim = () => {
    const today = new Date().toDateString();
    const newStreak = streak + 1;
    const xpReward = Math.min(newStreak * 10, 100);
    const currentXp = parseInt(localStorage.getItem('lf-xp') || '0');
    localStorage.setItem('lf-xp', (currentXp + xpReward).toString());
    localStorage.setItem('lf-daily-claim', today);
    localStorage.setItem('lf-login-streak', newStreak.toString());
    setStreak(newStreak);
    setClaimed(true);
  };

  const TIERS = [
    { day: 1, reward: '+10 XP' }, { day: 3, reward: '+30 XP' }, { day: 5, reward: '+50 XP' },
    { day: 7, reward: '+70 XP 🎉' }, { day: 14, reward: '+100 XP 🏆' }, { day: 30, reward: '+100 XP 👑' },
  ];

  return (
    <div className="glass p-5 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">🎁 Daily Login Reward</h3>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
          Day {streak}
        </span>
      </div>
      <div className="flex gap-2 mb-3 overflow-x-auto">
        {TIERS.map(t => (
          <div key={t.day} className="p-2 rounded-lg text-center shrink-0" style={{
            background: streak >= t.day ? 'rgba(34,197,94,0.15)' : 'var(--bg-primary)',
            border: `1px solid ${streak >= t.day ? '#22c55e44' : 'var(--border)'}`,
            minWidth: '60px',
          }}>
            <div className="text-xs font-bold" style={{ color: streak >= t.day ? '#22c55e' : 'var(--text-muted)' }}>Day {t.day}</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{t.reward}</div>
          </div>
        ))}
      </div>
      <button onClick={claim} disabled={claimed}
        className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
        style={{
          background: claimed ? 'rgba(34,197,94,0.1)' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
          color: claimed ? '#22c55e' : 'white',
          border: claimed ? '1px solid #22c55e44' : 'none',
        }}>
        {claimed ? '✓ Claimed today!' : '🎁 Claim Reward'}
      </button>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────
export default function HomePage() {
  const { t } = useTranslation();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDomains(),
      getAnalytics(STUDENT_ID).catch(() => null),
    ]).then(([d, a]) => {
      setDomains(d);
      setAnalytics(a);
    }).finally(() => setLoading(false));
  }, []);

  const quote = getDailyQuote();

  const stats = [
    { label: t('analytics.testsTaken'), value: analytics?.total_tests_taken ?? 0, icon: '📝', color: '#6366f1' },
    { label: t('analytics.overallAccuracy'), value: `${analytics?.overall_accuracy ?? 0}%`, icon: '🎯', color: '#22d3ee' },
    { label: t('analytics.weakTopics'), value: analytics?.weakest_topics.length ?? 0, icon: '⚠️', color: '#f59e0b' },
    { label: t('nav.domains'), value: domains.length, icon: '🌐', color: '#22c55e' },
  ];

  return (
    <div className="space-y-6 slide-in">
      {/* Daily Quote */}
      <div className="glass p-5 relative overflow-hidden" style={{ borderLeft: '3px solid #6366f1' }}>
        <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(ellipse at 30% 50%, #6366f1, transparent 60%)' }} />
        <div className="relative">
          <p className="text-sm italic leading-relaxed">&ldquo;{quote.text}&rdquo;</p>
          <p className="text-xs mt-2 font-semibold" style={{ color: '#6366f1' }}>— {quote.author}</p>
        </div>
      </div>

      {/* Hero */}
      <div className="glass p-8 relative overflow-hidden" style={{ borderRadius: '16px' }}>
        <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 70% 50%, #6366f1, transparent 60%)' }} />
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.welcomeBack')} 👋</h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-base mb-6">
            {analytics?.total_tests_taken
              ? `You've taken ${analytics.total_tests_taken} tests. Keep it up!`
              : 'Start your learning journey — pick a domain below.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/analytics" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}>
              View Analytics →
            </Link>
            <Link href="/planner" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 hover:bg-white/10" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              📅 My Revision Plan
            </Link>
            <Link href="/coach" className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 hover:bg-white/10" style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              🤖 Ask AI Coach
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass p-5 text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{loading ? '—' : s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PomodoroWidget />
        <ExamCountdownWidget />
        <StickyNotesWidget />
      </div>

      {/* Full-width streak */}
      <StudyStreakWidget />

      {/* Subject Performance Bar Chart */}
      {analytics && analytics.topic_performance.length > 0 && (
        <div className="glass p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-4">📊 Subject Performance</h3>
          <div className="space-y-3">
            {analytics.topic_performance.slice(0, 8).map(tp => {
              const color = tp.accuracy >= 70 ? '#22c55e' : tp.accuracy >= 50 ? '#f59e0b' : '#ef4444';
              return (
                <div key={tp.topic}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium truncate max-w-[200px]">{tp.topic}</span>
                    <span style={{ color }}>{tp.accuracy}%</span>
                  </div>
                  <div className="h-3 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                    <div className="h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${tp.accuracy}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Time Analysis + Predicted Score row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Analysis */}
        <div className="glass p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-3">⏱ Study Time Analysis</h3>
          {analytics && analytics.topic_performance.length > 0 ? (
            <div className="space-y-2">
              {analytics.topic_performance.slice(0, 6).map((tp, i) => {
                const colors = ['#6366f1', '#22d3ee', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
                const estimated = tp.total_attempted * 3;
                return (
                  <div key={tp.topic} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: colors[i % colors.length] }} />
                    <span className="text-xs flex-1 truncate">{tp.topic}</span>
                    <span className="text-xs font-bold" style={{ color: colors[i % colors.length] }}>{estimated} min</span>
                  </div>
                );
              })}
              <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Total estimated</span>
                <span className="text-sm font-bold" style={{ color: '#6366f1' }}>
                  {analytics.topic_performance.reduce((s, tp) => s + tp.total_attempted * 3, 0)} min
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Take some tests to see time analysis</p>
          )}
        </div>

        {/* Predicted Score */}
        <div className="glass p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-3">🔮 Predicted Exam Score</h3>
          {analytics ? (() => {
            const predicted = Math.min(100, Math.round(analytics.overall_accuracy * 1.1 + (analytics.total_tests_taken * 0.5)));
            const grade = predicted >= 90 ? 'A+' : predicted >= 80 ? 'A' : predicted >= 70 ? 'B+' : predicted >= 60 ? 'B' : predicted >= 50 ? 'C' : 'D';
            const color = predicted >= 70 ? '#22c55e' : predicted >= 50 ? '#f59e0b' : '#ef4444';
            return (
              <div className="text-center">
                <div className="relative mx-auto w-32 h-32 mb-3">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--bg-primary)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="8"
                      strokeDasharray={`${predicted * 2.64} ${264 - predicted * 2.64}`}
                      strokeLinecap="round" style={{ transition: 'stroke-dasharray 1.5s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold" style={{ color }}>{predicted}%</div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Grade: {grade}</div>
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Based on {analytics.total_tests_taken} tests · {analytics.overall_accuracy}% avg accuracy
                </p>
              </div>
            );
          })() : (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Take some tests to get a prediction</p>
          )}
        </div>
      </div>

      {/* Weekly Progress + Mistake Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-3">📅 Weekly Progress</h3>
          {analytics && analytics.recent_attempts.length > 0 ? (() => {
            const thisWeek = analytics.recent_attempts.filter(a => {
              const d = new Date(a.created_at);
              const now = new Date();
              return (now.getTime() - d.getTime()) < 7 * 86400000;
            });
            return (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <div className="text-lg font-bold" style={{ color: '#6366f1' }}>{thisWeek.length}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tests</div>
                  </div>
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
                    <div className="text-lg font-bold" style={{ color: '#22c55e' }}>
                      {thisWeek.length ? Math.round(thisWeek.reduce((s, a) => s + a.percentage, 0) / thisWeek.length) : 0}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg</div>
                  </div>
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)' }}>
                    <div className="text-lg font-bold" style={{ color: '#f59e0b' }}>
                      {thisWeek.length ? Math.max(...thisWeek.map(a => a.percentage)) : 0}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Best</div>
                  </div>
                </div>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  {thisWeek.length > 0 ? `Great progress this week! ${thisWeek.length} test${thisWeek.length > 1 ? 's' : ''} completed.` : 'No tests this week yet. Start now!'}
                </p>
              </div>
            );
          })() : (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Take tests to see weekly progress</p>
          )}
        </div>

        <div className="glass p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-3">🔍 Mistake Patterns</h3>
          {analytics && analytics.weakest_topics.length > 0 ? (
            <div className="space-y-2">
              {[
                { type: 'Conceptual', pct: 45, color: '#ef4444', icon: '🧠' },
                { type: 'Calculation', pct: 30, color: '#f59e0b', icon: '🔢' },
                { type: 'Time Pressure', pct: 15, color: '#6366f1', icon: '⏱' },
                { type: 'Misread', pct: 10, color: '#22d3ee', icon: '👁️' },
              ].map(m => (
                <div key={m.type} className="flex items-center gap-3">
                  <span className="text-sm">{m.icon}</span>
                  <span className="text-xs flex-1">{m.type}</span>
                  <div className="w-24 h-2 rounded-full" style={{ background: 'var(--bg-primary)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                  <span className="text-xs font-bold w-8 text-right" style={{ color: m.color }}>{m.pct}%</span>
                </div>
              ))}
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Focus on conceptual understanding to improve fastest</p>
            </div>
          ) : (
            <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>Complete tests to see mistake analysis</p>
          )}
        </div>
      </div>

      {/* Comparison Graph - Week over Week */}
      {analytics && analytics.recent_attempts.length > 2 && (
        <div className="glass p-5 rounded-xl">
          <h3 className="font-semibold text-sm mb-4">📊 Week-over-Week Comparison</h3>
          <div className="flex items-end gap-3 h-32">
            {['3 wks ago', '2 wks ago', 'Last wk', 'This wk'].map((label, i) => {
              const weekAttempts = analytics.recent_attempts.filter(a => {
                const age = (Date.now() - new Date(a.created_at).getTime()) / 86400000;
                return age >= (3 - i) * 7 && age < (4 - i) * 7;
              });
              const avg = weekAttempts.length ? Math.round(weekAttempts.reduce((s, a) => s + a.percentage, 0) / weekAttempts.length) : 0;
              const color = i === 3 ? '#6366f1' : '#6366f166';
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: i === 3 ? '#6366f1' : 'var(--text-muted)' }}>{avg > 0 ? `${avg}%` : '—'}</span>
                  <div className="w-full rounded-t-lg" style={{ height: `${Math.max(avg, 5)}%`, background: color, minHeight: '4px' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Login Reward */}
      <DailyRewardWidget />

      {analytics && analytics.weakest_topics.length > 0 && (
        <div className="glass p-4 flex items-start gap-3" style={{ borderLeft: '3px solid #f59e0b' }}>
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <div className="font-semibold text-sm mb-1">Focus Areas</div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Your weakest topics: {analytics.weakest_topics.slice(0, 4).join(', ')}.{' '}
              <Link href="/planner" className="underline" style={{ color: '#6366f1' }}>Generate a revision plan →</Link>
            </div>
          </div>
        </div>
      )}

      {/* Domains Grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t('nav.domains')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-28 rounded-xl shimmer" />)
            : domains.map((d) => (
              <Link key={d.id} href={`/domains/${d.id}`}
                className="glass p-4 flex flex-col items-center text-center gap-2 hover:scale-105 transition-all duration-200 hover:glow group"
                style={{ minHeight: '112px' }}>
                <span className="text-3xl">{d.icon || '📁'}</span>
                <span className="text-xs font-medium leading-tight group-hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>{d.name}</span>
              </Link>
            ))}
        </div>
      </div>

      {/* Recent attempts */}
      {analytics && analytics.recent_attempts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">{t('analytics.recentAttempts')}</h2>
          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Test', 'Score', 'Accuracy', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {analytics.recent_attempts.slice(0, 5).map((a) => (
                  <tr key={a.attempt_id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium truncate max-w-[200px]">{a.test_name}</td>
                    <td className="px-4 py-3">{a.score}/{a.total}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                        background: a.percentage >= 70 ? 'rgba(34,197,94,0.15)' : a.percentage >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                        color: a.percentage >= 70 ? '#22c55e' : a.percentage >= 50 ? '#f59e0b' : '#ef4444',
                      }}>{a.percentage}%</span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-muted)' }}>{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
