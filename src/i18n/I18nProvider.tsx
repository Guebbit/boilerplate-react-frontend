import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { messages, type ILocale } from '@/i18n/messages';

type II18nContext = {
    locale: ILocale;
    setLocale: (locale: string) => void;
    t: (key: string) => string;
};

const I18nContext = createContext<II18nContext | undefined>(undefined);

const safeLocale = (locale: string): ILocale => {
    if (locale in messages) return locale as ILocale;
    return 'en';
};

export const I18nProvider = ({ children }: PropsWithChildren) => {
    const [locale, setCurrentLocale] = useState<ILocale>(safeLocale(import.meta.env.VITE_APP_DEFAULT_LOCALE ?? 'en'));

    const dictionary = useMemo(() => messages[locale], [locale]);

    const t = (key: string) => {
        const segments = key.split('.');
        const value = segments.reduce<unknown>((current, segment) => {
            if (!current || typeof current !== 'object') return undefined;
            return (current as Record<string, unknown>)[segment];
        }, dictionary);

        return typeof value === 'string' ? value : key;
    };

    const setLocale = (nextLocale: string) => setCurrentLocale(safeLocale(nextLocale));

    return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) throw new Error('useI18n must be used inside I18nProvider');
    return context;
};
