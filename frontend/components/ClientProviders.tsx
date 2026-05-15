'use client';

import { LanguageProvider } from '@/lib/i18n';
import { ToastProvider } from '@/components/Toast';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </LanguageProvider>
    );
}
