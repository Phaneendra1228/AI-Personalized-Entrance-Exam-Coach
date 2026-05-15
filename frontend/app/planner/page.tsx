'use client';

import { useEffect, useState } from 'react';
import { generatePlan, getAnalytics } from '@/lib/api';
import type { RevisionPlan, DayPlan, StudySession } from '@/lib/types';

const STUDENT_ID = process.env.NEXT_PUBLIC_STUDENT_ID || 'student_1';



function WeaknessBar({ score }: { score: number }) {
  const color = score > 0.65 ? '#ef4444' : score > 0.35 ? '#f59e0b' : '#22c55e';
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--bg-card)' }}>
        <div className="h-1.5 rounded-full" style={{ width: `${score * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-medium" style={{ color, minWidth: '30px' }}>
        {Math.round(score * 100)}%
      </span>
    </div>
  );
}

function SessionCard({ session }: { session: StudySession }) {
  const [expanded, setExpanded] = useState(false);
  const weakColor = session.weakness_score > 0.65 ? '#ef4444' : session.weakness_score > 0.35 ? '#f59e0b' : '#22c55e';

  return (
    <div
      className="p-3 rounded-lg cursor-pointer transition-all duration-200"
      style={{
        background: 'var(--bg-primary)',
        border: `1px solid ${weakColor}33`,
        borderLeft: `3px solid ${weakColor}`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="text-xs font-semibold leading-tight">{session.topic}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>⏱ {session.duration_minutes} min</span>
          </div>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{expanded ? '▲' : '▼'}</span>
      </div>
      <WeaknessBar score={session.weakness_score} />

      {expanded && (
        <div className="mt-3 space-y-2 text-xs">
          <div style={{ color: 'var(--text-muted)' }}>
            <span className="font-medium text-white">🎯 Objective: </span>
            {session.learning_objective}
          </div>
          {session.resources.length > 0 && (
            <div>
              <div className="font-medium mb-1">📚 Resources:</div>
              <div className="space-y-1">
                {session.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                    style={{ color: '#6366f1' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>→</span> {r.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PlannerPage() {
  const [plan, setPlan] = useState<RevisionPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check if student has test data
    getAnalytics(STUDENT_ID)
      .then((a) => setHasData(a.total_tests_taken > 0))
      .catch(() => setHasData(false));
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const p = await generatePlan(STUDENT_ID);
      setPlan(p);
      setSelectedDay(0);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const dayData: DayPlan | null = plan ? plan.plan[selectedDay] : null;

  return (
    <div className="space-y-6 slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">7-Day Revision Planner</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            AI-generated schedule based on your weakness scores
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}
        >
          {generating ? '⏳ Generating...' : plan ? '🔄 Regenerate' : '✨ Generate My Plan'}
        </button>
      </div>

      {!plan && !generating && (
        <div className="glass p-10 text-center" style={{ borderRadius: '16px' }}>
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-xl font-bold mb-2">Your Personalized Study Plan</h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            {hasData
              ? 'Get an AI-generated 7-day schedule tailored to your weak areas.'
              : 'Take some mock tests first to get a personalized plan. Or generate a starter plan now!'}
          </p>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white' }}
          >
            ✨ Generate My Plan →
          </button>
        </div>
      )}

      {generating && (
        <div className="glass p-10 text-center" style={{ borderRadius: '16px' }}>
          <div className="text-4xl mb-3 animate-pulse">🤖</div>
          <p className="font-medium">Analyzing your performance data...</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Generating your optimized 7-day plan</p>
        </div>
      )}

      {plan && (
        <>
          {/* Plan summary */}
          <div className="glass p-4 flex flex-wrap items-center gap-6" style={{ borderRadius: '12px' }}>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Topics Covered</div>
              <div className="font-bold text-lg" style={{ color: '#6366f1' }}>{plan.total_topics_covered}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Days</div>
              <div className="font-bold text-lg" style={{ color: '#22d3ee' }}>{plan.plan.length}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Generated</div>
              <div className="font-bold text-sm">{new Date(plan.generated_at).toLocaleDateString()}</div>
            </div>
          </div>

          {/* 7-day calendar tabs */}
          <div className="grid grid-cols-7 gap-2">
            {plan.plan.map((day, i) => {
              const dateObj = new Date(day.date);
              const dayName = dateObj.toLocaleDateString('en', { weekday: 'short' });
              const isToday = i === 0;
              const isSelected = i === selectedDay;
              const totalMin = day.total_minutes;

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(i)}
                  className="p-2 rounded-xl text-center transition-all duration-200 hover:scale-105"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(34,211,238,0.2))'
                      : 'var(--bg-card)',
                    border: isSelected
                      ? '1px solid rgba(99,102,241,0.6)'
                      : isToday
                        ? '1px solid rgba(99,102,241,0.3)'
                        : '1px solid var(--border)',
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{dayName}</div>
                  <div
                    className="text-lg font-bold my-0.5"
                    style={{ color: isSelected ? 'white' : 'var(--text-primary)' }}
                  >
                    {dateObj.getDate()}
                  </div>
                  <div className="text-xs" style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
                    {totalMin}m
                  </div>
                  {isToday && (
                    <div className="w-1.5 h-1.5 rounded-full mx-auto mt-1 pulse-dot" style={{ background: '#6366f1' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          {dayData && (
            <div className="glass p-5" style={{ borderRadius: '12px' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Day {dayData.day} — {new Date(dayData.date).toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {dayData.sessions.length} session{dayData.sessions.length > 1 ? 's' : ''} · {dayData.total_minutes} minutes total
                  </p>
                </div>
                <div
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}
                >
                  ⏱ {dayData.total_minutes} min
                </div>
              </div>
              <div className="space-y-3">
                {dayData.sessions.map((s, i) => (
                  <SessionCard key={i} session={s} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
