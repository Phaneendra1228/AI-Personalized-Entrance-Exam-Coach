'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDomains } from '@/lib/api';
import type { Domain } from '@/lib/types';
import { useTranslation, type SupportedLocale } from '@/lib/i18n';

export default function Sidebar() {
  const pathname = usePathname();
  const { t, locale, setLocale, languages } = useTranslation();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const NAV_SECTIONS = [
    {
      title: t('nav.main'),
      links: [
        { href: '/', label: t('nav.dashboard'), icon: '⚡' },
        { href: '/analytics', label: t('nav.analytics'), icon: '📊' },
        { href: '/planner', label: t('nav.revisionPlanner'), icon: '📅' },
        { href: '/coach', label: t('nav.aiCoach'), icon: '🤖' },
        { href: '/exam-coach', label: t('nav.examCoach'), icon: '🎓' },
      ],
    },
    {
      title: t('nav.studyTools'),
      links: [
        { href: '/flashcards', label: t('nav.flashcards'), icon: '🃏' },
        { href: '/quiz', label: t('nav.dailyQuiz'), icon: '⚡' },
        { href: '/pyq', label: 'PYQ Papers', icon: '📄' },
        { href: '/doubt-solver', label: 'Doubt Solver', icon: '🤔' },
        { href: '/formulas', label: t('nav.formulaSheet'), icon: '📐' },
        { href: '/revision-cards', label: t('nav.revisionCards'), icon: '📋' },
        { href: '/notes', label: t('nav.notes'), icon: '📝' },
        { href: '/bookmarks', label: t('nav.bookmarks'), icon: '🔖' },
        { href: '/mind-maps', label: t('nav.mindMaps'), icon: '🧠' },
        { href: '/videos', label: t('nav.videos'), icon: '🎬' },
        { href: '/calculator', label: t('nav.calculator'), icon: '🔢' },
        { href: '/focus', label: t('nav.focusMode'), icon: '🎯' },
      ],
    },
    {
      title: t('nav.social'),
      links: [
        { href: '/study-rooms', label: t('nav.studyRooms'), icon: '💬' },
        { href: '/challenges', label: t('nav.challenges'), icon: '⚔️' },
        { href: '/forum', label: t('nav.forum'), icon: '🗣️' },
      ],
    },
    {
      title: t('nav.progress'),
      links: [
        { href: '/leaderboard', label: t('nav.leaderboard'), icon: '🏆' },
        { href: '/achievements', label: t('nav.achievements'), icon: '🎖️' },
        { href: '/goals', label: t('nav.goals'), icon: '🎯' },
        { href: '/study-tracker', label: 'Study Tracker', icon: '⏱️' },
        { href: '/compare', label: 'Compare', icon: '📊' },
        { href: '/history', label: t('nav.testHistory'), icon: '📜' },
        { href: '/rank-predictor', label: t('nav.rankPredictor'), icon: '📈' },
        { href: '/reminders', label: t('nav.reminders'), icon: '🔔' },
        { href: '/export', label: t('nav.exportData'), icon: '💾' },
        { href: '/profile', label: t('nav.profile'), icon: '👤' },
      ],
    },
  ];

  useEffect(() => {
    getDomains()
      .then(setDomains)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Hide sidebar on auth/onboarding pages
  if (['/login', '/signup', '/onboarding'].includes(pathname)) return null;

  const currentLang = languages.find((l: { code: SupportedLocale; label: string; flag: string }) => l.code === locale);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        onClick={() => setOpen(!open)}
      >☰</button>

      <aside
        className={`fixed lg:static z-40 h-full w-60 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
      >
        <div suppressHydrationWarning className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="flex items-center gap-3">
            <div suppressHydrationWarning className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold glow"
              style={{ background: 'linear-gradient(135deg, #6366f1, #22d3ee)' }}>LF</div>
            <div suppressHydrationWarning>
              <div suppressHydrationWarning className="font-bold text-sm gradient-text">LearnFlow</div>
              <div suppressHydrationWarning className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>v3.0 · AI-Adaptive</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-1.5">
          {NAV_SECTIONS.map(section => (
            <div key={section.title} className="mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider px-3 py-1"
                style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{section.title}</div>
              {section.links.map(({ href, label, icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-0.5 text-xs font-medium transition-all duration-200
                    ${isActive(href) ? 'text-white glow' : 'hover:bg-white/5'}`}
                  style={isActive(href)
                    ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.15))', color: 'var(--text-primary)' }
                    : { color: 'var(--text-muted)' }}>
                  <span className="text-xs">{icon}</span>
                  <span className="truncate">{label}</span>
                </Link>
              ))}
            </div>
          ))}

          <div className="mb-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs font-semibold uppercase tracking-wider px-3 py-1"
              style={{ color: 'var(--text-muted)', fontSize: '9px' }}>{t('nav.domains')}</div>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div suppressHydrationWarning key={i} className="h-7 rounded-lg mb-0.5 shimmer" />)
            ) : (
              domains.map(d => (
                <Link key={d.id} href={`/domains/${d.id}`} onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-0.5 text-xs transition-all duration-200
                    ${pathname === `/domains/${d.id}` ? 'text-white' : 'hover:bg-white/5'}`}
                  style={pathname === `/domains/${d.id}`
                    ? { background: 'rgba(99,102,241,0.2)', color: 'var(--text-primary)' }
                    : { color: 'var(--text-muted)' }}>
                  <span>{d.icon || '📁'}</span>
                  <span className="truncate">{d.name}</span>
                </Link>
              ))
            )}
          </div>
        </nav>

        {/* Language selector */}
        <div className="px-3 py-2 border-t relative" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--text-primary)' }}
          >
            <span className="flex items-center gap-2">
              <span>🌐</span>
              <span>{t('nav.language')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span>{currentLang?.flag}</span>
              <span style={{ color: '#6366f1' }}>{currentLang?.label}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '8px' }}>{langOpen ? '▲' : '▼'}</span>
            </span>
          </button>

          {langOpen && (
            <div
              className="absolute bottom-full left-3 right-3 mb-1 rounded-xl overflow-hidden shadow-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', zIndex: 100 }}
            >
              {languages.map((lang: { code: SupportedLocale; label: string; flag: string }) => (
                <button
                  key={lang.code}
                  onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-medium transition-all hover:bg-white/5"
                  style={{
                    color: locale === lang.code ? '#6366f1' : 'var(--text-primary)',
                    background: locale === lang.code ? 'rgba(99,102,241,0.1)' : 'transparent',
                  }}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                  {locale === lang.code && <span className="ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div suppressHydrationWarning className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <Link href="/login"
            onClick={() => { sessionStorage.removeItem('lf-auth'); }}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            🔓 {t('nav.logout')}
          </Link>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 lg:hidden" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setOpen(false)} />}
    </>
  );
}
