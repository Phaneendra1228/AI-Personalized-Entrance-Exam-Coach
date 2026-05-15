'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getDomains, getSubjects } from '@/lib/api';
import type { Domain, Subject } from '@/lib/types';

export default function DomainPage() {
  const params = useParams();
  const domainId = Number(params.domainId);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const SUBJECT_ICONS = ['🔬', '📐', '🌍', '💡', '📖', '🔭', '⚗️', '🎵', '🖥️', '🧬'];

  useEffect(() => {
    Promise.all([
      getDomains(),
      getSubjects(domainId),
    ]).then(([domains, subs]) => {
      const found = domains.find((d) => d.id === domainId) || null;
      setDomain(found);
      setSubjects(subs);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [domainId]);

  if (loading) {
    return (
      <div className="space-y-6 slide-in">
        <div className="h-32 glass shimmer rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 shimmer rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 slide-in">
      {/* Domain hero */}
      <div className="glass p-6 relative overflow-hidden" style={{ borderRadius: '16px' }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse at 60% 50%, #6366f1, transparent 70%)' }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.2))' }}
          >
            {domain?.icon || '📁'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{domain?.name}</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {domain?.description}
            </p>
            <div className="mt-2 text-sm" style={{ color: '#6366f1' }}>
              {subjects.length} subject{subjects.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>
      </div>

      {/* Subjects grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Choose a Subject</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((s, i) => (
            <Link
              key={s.id}
              href={`/tests/${s.id}`}
              className="glass p-5 hover:scale-[1.02] transition-all duration-200 hover:glow group cursor-pointer"
              style={{ borderRadius: '12px' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.15))' }}
              >
                {SUBJECT_ICONS[i % SUBJECT_ICONS.length]}
              </div>
              <h3 className="font-semibold text-base mb-1 group-hover:gradient-text transition-all">
                {s.name}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {s.description || 'Click to view mock tests'}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-medium" style={{ color: '#6366f1' }}>
                View tests <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
