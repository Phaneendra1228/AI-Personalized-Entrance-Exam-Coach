'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getTests } from '@/lib/api';
import type { MockTest } from '@/lib/types';

const DIFFICULTY_CONFIG = {
  easy:   { label: 'Easy',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.3)',  icon: '🟢' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: '🟡' },
  hard:   { label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.3)',  icon: '🔴' },
};

export default function TestsPage() {
  const params        = useParams();
  const subjectId     = Number(params.subjectId);
  const [tests, setTests]   = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    getTests(subjectId)
      .then(setTests)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [subjectId]);

  const grouped = {
    easy:   tests.filter((t) => t.difficulty === 'easy'),
    medium: tests.filter((t) => t.difficulty === 'medium'),
    hard:   tests.filter((t) => t.difficulty === 'hard'),
  };

  return (
    <div className="space-y-6 slide-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Mock Tests</h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Select a test to start. Tests are organised by difficulty level.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 shimmer rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="glass p-10 text-center" style={{ borderRadius: '16px' }}>
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Tests</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{error}</p>
          <Link href="/" className="text-sm underline" style={{ color: '#6366f1' }}>
            ← Back to Domains
          </Link>
        </div>
      ) : tests.length === 0 ? (
        <div className="glass p-10 text-center" style={{ borderRadius: '16px' }}>
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-bold mb-2">No Tests Yet</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            No mock tests have been added for this subject yet.
          </p>
          <Link href="/" className="text-sm underline" style={{ color: '#6366f1' }}>
            ← Explore other subjects
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {(Object.keys(grouped) as ('easy' | 'medium' | 'hard')[]).map((level) => {
            const cfg        = DIFFICULTY_CONFIG[level];
            const levelTests = grouped[level];
            if (levelTests.length === 0) return null;

            return (
              <div key={level}>
                <div className="flex items-center gap-3 mb-3">
                  <span>{cfg.icon}</span>
                  <h2 className="text-lg font-semibold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </h2>
                  <div
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                  >
                    {levelTests.length} test{levelTests.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelTests.map((test) => (
                    <div
                      key={test.id}
                      className="glass p-5 flex flex-col gap-3"
                      style={{ borderRadius: '12px', borderLeft: `3px solid ${cfg.color}` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm leading-snug">{test.name}</h3>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full shrink-0"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span>⏱ {test.duration_minutes} min</span>
                        <span>❓ {test.question_count ?? '?'} questions</span>
                      </div>

                      {test.description && (
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {test.description}
                        </p>
                      )}

                      <Link
                        href={`/play/${test.id}`}
                        className="mt-auto w-full text-center py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                        style={{
                          background: `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}1a)`,
                          color: cfg.color,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        Start Test →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
