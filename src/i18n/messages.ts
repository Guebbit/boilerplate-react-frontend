import en from '@/locales/en.json';
import it from '@/locales/it.json';

export const messages = { en, it } as const;

export type ILocale = keyof typeof messages;
