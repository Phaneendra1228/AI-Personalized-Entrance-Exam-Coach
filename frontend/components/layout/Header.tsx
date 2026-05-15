'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function Header() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const { t } = useTranslation();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileName, setProfileName] = useState('S');

  // Build breadcrumb map from translations
  const BREADCRUMB_MAP: Record<string, string> = {
    '': t('header.dashboard'), 'domains': t('header.domains'), 'tests': t('header.tests'),
    'play': t('header.play'), 'analytics': t('header.analytics'), 'planner': t('header.planner'),
    'coach': t('header.coach'), 'exam-coach': t('header.examCoach'), 'results': t('header.results'),
    'flashcards': t('header.flashcards'), 'quiz': t('header.quiz'), 'leaderboard': t('header.leaderboard'),
    'history': t('header.history'), 'profile': t('header.profile'), 'study-rooms': t('header.studyRooms'),
    'challenges': t('header.challenges'), 'forum': t('header.forum'), 'achievements': t('header.achievements'),
    'notes': t('header.notes'), 'formulas': t('header.formulas'), 'bookmarks': t('header.bookmarks'),
    'reminders': t('header.reminders'), 'focus': t('header.focus'), 'goals': t('header.goals'),
    'videos': t('header.videos'), 'mind-maps': t('header.mindMaps'), 'revision-cards': t('header.revisionCards'),
    'calculator': t('header.calculator'), 'rank-predictor': t('header.rankPredictor'),
    'export': t('header.export'), 'login': t('header.login'), 'signup': t('header.signup'),
    'onboarding': t('header.onboarding'),
    'pyq': 'PYQ Papers', 'doubt-solver': 'Doubt Solver',
    'study-tracker': 'Study Tracker', 'compare': 'Compare',
  };

  useEffect(() => {
    const saved = localStorage.getItem('lf-theme') as 'dark' | 'light' | null;
    const thm = saved || 'dark';
    setTheme(thm);
    document.documentElement.setAttribute('data-theme', thm);

    const profileData = sessionStorage.getItem('lf-profile');
    if (profileData) {
      try {
        const p = JSON.parse(profileData);
        if (p.photoUrl) setProfilePhoto(p.photoUrl);
        if (p.avatar) setProfileAvatar(p.avatar);
        if (p.name) setProfileName(p.name.charAt(0).toUpperCase());
      } catch { }
    } else {
      const authData = sessionStorage.getItem('lf-auth');
      if (authData) {
        try {
          const a = JSON.parse(authData);
          if (a.name) setProfileName(a.name.charAt(0).toUpperCase());
        } catch { }
      }
    }

    const handleProfileUpdate = () => {
      const updated = sessionStorage.getItem('lf-profile');
      if (updated) {
        try {
          const p = JSON.parse(updated);
          setProfilePhoto(p.photoUrl || '');
          setProfileAvatar(p.avatar || '');
          if (p.name) setProfileName(p.name.charAt(0).toUpperCase());
        } catch { }
      }
    };
    window.addEventListener('lf-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('lf-profile-updated', handleProfileUpdate);
  }, []);

  if (['/login', '/signup', '/onboarding'].includes(pathname)) return null;

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('lf-theme', next);
  };

  const crumbs = [
    { label: t('header.home'), href: '/' },
    ...segments.map((seg, i) => ({
      label: BREADCRUMB_MAP[seg] || decodeURIComponent(seg),
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', minHeight: '64px' }}
    >
      <nav className="flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-2">
            {i > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
            {i === crumbs.length - 1 ? (
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span key={theme} className="theme-toggle-icon text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.3)' }}
        >
          <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#6366f1' }} />
          {t('header.online')}
        </div>

        <Link
          href="/profile"
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform overflow-hidden"
          style={{ background: profilePhoto ? 'transparent' : 'linear-gradient(135deg, #6366f1, #22d3ee)' }}
        >
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : profileAvatar ? (
            <span className="text-base">{profileAvatar}</span>
          ) : (
            profileName
          )}
        </Link>
      </div>
    </header>
  );
}
