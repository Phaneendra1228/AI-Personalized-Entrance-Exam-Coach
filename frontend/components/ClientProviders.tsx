'use client';

import { LanguageProvider } from '@/lib/i18n';
import { ToastProvider } from '@/components/Toast';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const publicPaths = ['/login', '/signup', '/onboarding'];
    const isPublic = publicPaths.includes(pathname);

    useEffect(() => {
        setMounted(true);
        const auth = sessionStorage.getItem('lf-auth');
        if (auth) {
            setIsAuthenticated(true);
        } else if (!isPublic) {
            router.push('/login');
        }
    }, [pathname, router, isPublic]);

    // To prevent the dashboard from flashing before the redirect,
    // we only render the children if we are on a public path, or if the user is authenticated.
    const shouldRender = !mounted ? true : (isPublic || isAuthenticated);

    return (
        <LanguageProvider>
            <ToastProvider>
                <div style={{ display: 'contents', visibility: (!mounted && !isPublic) ? 'hidden' : 'visible' }}>
                    {shouldRender ? children : null}
                </div>
            </ToastProvider>
        </LanguageProvider>
    );
}
