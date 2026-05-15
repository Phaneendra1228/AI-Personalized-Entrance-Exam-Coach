'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuestions, submitAttempt } from '@/lib/api';
import type { Question, AttemptResult } from '@/lib/types';

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';

export default function TestPlayerPage() {
  const params = useParams();
  const testId = Number(params.testId);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getQuestions(testId)
      .then((qs) => { setQuestions(qs); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [testId]);

  useEffect(() => {
    if (!loading && !result) {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, result]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleSelect = (qId: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [String(qId)]: optIdx }));
  };

  const handleSubmit = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const r = await submitAttempt({ student_id: STUDENT_ID, test_id: testId, answers, time_taken_seconds: time });
      setResult(r);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIdx];
  const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;
  const answered = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 slide-in">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 shimmer rounded-xl" />)}
      </div>
    );
  }

  if (result) {
    return <ResultView result={result} questions={questions} answers={answers} testId={testId} />;
  }

  return (
    <div className="max-w-2xl mx-auto slide-in">
      {/* Header bar */}
      <div className="glass p-4 mb-4 flex items-center justify-between" style={{ borderRadius: '12px' }}>
        <div className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
          Question {currentIdx + 1} of {questions.length}
        </div>
        <div
          className="font-mono text-sm px-3 py-1 rounded-full"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}
        >
          ⏱ {formatTime(time)}
        </div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {answered}/{questions.length} answered
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full mb-6" style={{ background: 'var(--bg-card)' }}>
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #22d3ee)' }}
        />
      </div>

      {/* Question card */}
      {currentQ && (
        <div className="glass p-6 mb-4" style={{ borderRadius: '16px' }}>
          <div className="flex items-start gap-3 mb-6">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
            >
              {currentIdx + 1}
            </div>
            <p className="text-base font-medium leading-relaxed">{currentQ.text}</p>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const selected = answers[String(currentQ.id)] === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(currentQ.id, i)}
                  className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3"
                  style={{
                    background: selected ? 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.15))' : 'var(--bg-card)',
                    border: selected ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--border)',
                    color: selected ? 'white' : 'var(--text-muted)',
                    transform: selected ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      borderColor: selected ? '#6366f1' : 'var(--border)',
                      background: selected ? '#6366f1' : 'transparent',
                      color: selected ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>📌 Topic: {currentQ.topic}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          ← Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: 'white' }}
          >
            {submitting ? '⏳ Submitting...' : '✅ Submit Test'}
          </button>
        )}
      </div>

      {/* Question navigation dots */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIdx(i)}
            className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
            style={{
              background: i === currentIdx
                ? 'linear-gradient(135deg, #6366f1, #22d3ee)'
                : answers[String(q.id)] !== undefined
                  ? 'rgba(34,197,94,0.3)'
                  : 'var(--bg-card)',
              color: i === currentIdx || answers[String(q.id)] !== undefined ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultView({ result, questions: _questions, answers: _answers, testId: _testId }: {
  result: AttemptResult; questions: Question[]; answers: Record<string, number>; testId: number;
}) {
  const router = useRouter();
  const pct = result.percentage;
  const color = pct >= 70 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';
  const emoji = pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪';

  return (
    <div className="max-w-2xl mx-auto slide-in space-y-4">
      {/* Score card */}
      <div className="glass p-8 text-center" style={{ borderRadius: '16px' }}>
        <div className="text-5xl mb-3">{emoji}</div>
        <div className="text-4xl font-bold mb-1" style={{ color }}>{pct}%</div>
        <div className="text-lg font-medium mb-1">{result.score} / {result.total} correct</div>
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {pct >= 70 ? 'Excellent work! You\'re performing well.' : pct >= 50 ? 'Good effort! Keep practicing.' : 'Keep going! Review your weak topics.'}
        </div>
      </div>

      {/* Topic breakdown */}
      <div className="glass p-5" style={{ borderRadius: '12px' }}>
        <h3 className="font-semibold mb-4">Topic Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(result.topic_breakdown).map(([topic, stats]) => {
            const topicPct = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
            const tc = topicPct >= 70 ? '#22c55e' : topicPct >= 50 ? '#f59e0b' : '#ef4444';
            return (
              <div key={topic}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span>{topic}</span>
                  <span style={{ color: tc }}>{stats.correct}/{stats.total}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--bg-card)' }}>
                  <div className="h-2 rounded-full transition-all" style={{ width: `${topicPct}%`, background: tc }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          🏠 Home
        </button>
        <button
          onClick={() => router.push('/analytics')}
          className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}
        >
          📊 View Analytics
        </button>
        <button
          onClick={() => router.push('/planner')}
          className="flex-1 py-3 rounded-xl text-sm font-semibold"
          style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          📅 Get Plan
        </button>
      </div>
    </div>
  );
}
