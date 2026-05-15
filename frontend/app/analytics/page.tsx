'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAnalytics, generatePlan } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import type { Analytics } from '@/lib/types';

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    getAnalytics(STUDENT_ID)
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      await generatePlan(STUDENT_ID);
      window.location.href = '/planner';
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 slide-in">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 shimmer rounded-xl" />)}
      </div>
    );
  }

  if (!analytics || analytics.total_tests_taken === 0) {
    return (
      <div className="slide-in text-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
        <p className="mb-6" style={{ color: 'var(--text-muted)' }}>
          Take your first mock test to see your analytics here.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}
        >
          Browse Tests →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Performance Analytics</h1>
        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}
        >
          {generating ? '⏳ Generating...' : '📅 Generate Revision Plan'}
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tests Taken', value: analytics.total_tests_taken, color: '#6366f1', icon: '📝' },
          { label: 'Overall Accuracy', value: `${analytics.overall_accuracy}%`, color: '#22d3ee', icon: '🎯' },
          { label: 'Topics Studied', value: analytics.topic_performance.length, color: '#22c55e', icon: '📚' },
          { label: 'Weak Topics', value: analytics.weakest_topics.length, color: '#f59e0b', icon: '⚠️' },
        ].map((s) => (
          <div key={s.label} className="glass p-4 text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Topic performance chart */}
      <div className="glass p-6" style={{ borderRadius: '16px' }}>
        <h2 className="text-lg font-semibold mb-1">Topic Performance</h2>
        <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
          Accuracy by topic — bar width represents accuracy, color indicates performance level
        </p>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {analytics.topic_performance.map((tp) => {
            const color = tp.accuracy >= 70 ? '#22c55e' : tp.accuracy >= 50 ? '#f59e0b' : '#ef4444';
            const weaknessLabel = tp.weakness_score > 0.6 ? 'Weak' : tp.weakness_score > 0.3 ? 'Average' : 'Strong';
            return (
              <div key={tp.topic}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="font-medium truncate max-w-[60%]">{tp.topic}</span>
                  <div className="flex items-center gap-3" style={{ color: 'var(--text-muted)' }}>
                    <span>{tp.correct}/{tp.total_attempted}</span>
                    <span
                      className="px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${color}22`,
                        color,
                        border: `1px solid ${color}44`,
                      }}
                    >
                      {tp.accuracy}%
                    </span>
                    <span style={{ color: tp.weakness_score > 0.5 ? '#f59e0b' : 'var(--text-muted)' }}>
                      {weaknessLabel}
                    </span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-card)' }}>
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${tp.accuracy}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakness radar — visual table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass p-5" style={{ borderRadius: '12px' }}>
          <h3 className="font-semibold mb-3 text-sm">🔴 Weakest Topics</h3>
          {analytics.weakest_topics.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No weak topics — excellent!</p>
          ) : (
            <div className="space-y-2">
              {analytics.weakest_topics.map((t, i) => (
                <div key={t} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
                  >
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass p-5" style={{ borderRadius: '12px' }}>
          <h3 className="font-semibold mb-3 text-sm">🟢 Strongest Topics</h3>
          {analytics.strongest_topics.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Keep practicing to find your strengths!</p>
          ) : (
            <div className="space-y-2">
              {analytics.strongest_topics.map((t, i) => (
                <div key={t} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}
                  >
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent attempts */}
      {analytics.recent_attempts.length > 0 && (
        <div className="glass overflow-hidden" style={{ borderRadius: '12px' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-semibold">Recent Attempts</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Test', 'Score', 'Accuracy', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.recent_attempts.map((a) => {
                const pctColor = a.percentage >= 70 ? '#22c55e' : a.percentage >= 50 ? '#f59e0b' : '#ef4444';
                return (
                  <tr key={a.attempt_id} className="hover:bg-white/5" style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="px-4 py-3 font-medium truncate max-w-[200px]">{a.test_name}</td>
                    <td className="px-4 py-3">{a.score}/{a.total}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${pctColor}22`, color: pctColor, border: `1px solid ${pctColor}33` }}>
                        {a.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
