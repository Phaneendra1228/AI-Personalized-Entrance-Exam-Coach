'use client';

import { LanguageProvider } from '@/lib/i18n';
import { ToastProvider } from '@/components/Toast';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

function SessionSync({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const publicPaths = ['/login', '/signup', '/onboarding'];
    const isPublic = publicPaths.includes(pathname);

    useEffect(() => {
        setMounted(true);
        // If we have a next-auth session, sync it to sessionStorage
        if (session && session.user) {
            const currentAuth = sessionStorage.getItem('lf-auth');
            if (!currentAuth) {
                const socialName = session.user.name || session.user.email?.split('@')[0] || 'User';
                sessionStorage.setItem('lf-auth', JSON.stringify({
                    email: session.user.email,
                    name: socialName,
                    loggedIn: true,
                    provider: 'google',
                    loginDate: new Date().toISOString(),
                }));
                sessionStorage.setItem('lf-profile', JSON.stringify({
                    name: socialName,
                    avatar: session.user.image || '🟢',
                    exam: 'jee_main',
                    examDate: '',
                    dailyGoal: 120,
                    notifications: true,
                }));
                // Manually trigger a refresh to reflect the new state, or just set it
            }
        }
    }, [session]);

    useEffect(() => {
        if (!mounted) return;
        const auth = sessionStorage.getItem('lf-auth');
        if (auth || status === 'authenticated') {
            setIsAuthenticated(true);
        } else if (!isPublic && status !== 'loading') {
            router.push('/login');
        }
    }, [pathname, router, isPublic, status, mounted]);

    const shouldRender = !mounted ? true : (isPublic || isAuthenticated || status === 'loading');

    return (
        <div style={{ display: 'contents', visibility: (!mounted && !isPublic) ? 'hidden' : 'visible' }}>
            {shouldRender ? children : null}
        </div>
    );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <LanguageProvider>
                <ToastProvider>
                    <SessionSync>
                        {children}
                    </SessionSync>
                </ToastProvider>
            </LanguageProvider>
        </SessionProvider>
    );
}
