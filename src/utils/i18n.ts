import { messages } from '@/i18n/messages';

export interface ITranslationDictionaries {
    [key: string]: string | ITranslationDictionaries;
}

type ILocaleDictionaries = Record<string, ITranslationDictionaries>;

const localeLoaders = import.meta.glob('/src/locales/*.json');

/**
 * [on build]
 * List of supported languages (loaded or loadable)
 */
export const supportedLanguages = import.meta.env.VITE_APP_SUPPORTED_LOCALES
    ? ((import.meta.env.VITE_APP_SUPPORTED_LOCALES as string | undefined) ?? '').split(',').filter(Boolean)
    : Object.keys(localeLoaders).map((file) => file.replace('/src/locales/', '').replace('.json', ''));

/**
 * [runtime]
 * List of loaded languages
 */
export const loadedLanguages: string[] = Object.keys(messages);

const localeDictionary: ILocaleDictionaries = { ...messages };

let currentLocale = import.meta.env.VITE_APP_DEFAULT_LOCALE ?? 'en';
let fallbackLocale = import.meta.env.VITE_APP_FALLBACK_LOCALE ?? 'en';

const getLocaleFileKey = (locale: string) => `/src/locales/${locale}.json`;

const getTranslationFromDictionary = (dictionary: ITranslationDictionaries, key: string) => {
    const segments = key.split('.');
    let cursor: string | ITranslationDictionaries | undefined = dictionary;

    for (const segment of segments) {
        if (!cursor || typeof cursor === 'string') return undefined;
        cursor = cursor[segment];
    }

    return typeof cursor === 'string' ? cursor : undefined;
};

/**
 * Dynamic import (from file) of translations
 *
 * @param locale
 */
const _loadLocale = (locale: string): Promise<unknown> => {
    if (loadedLanguages.includes(locale)) return _changeLanguage(locale);

    const localeFile = getLocaleFileKey(locale);
    const loader = localeLoaders[localeFile];
    if (!loader || !supportedLanguages.includes(locale)) return _changeLanguage(getDefaultLocale());

    return loader()
        .then((file) => {
            const dictionary = ((file as { default?: ITranslationDictionaries }).default ?? file) as ITranslationDictionaries;
            return _updateLocale(locale, dictionary).then(() => _changeLanguage(locale));
        })
        .catch(() => _changeLanguage(getDefaultLocale()));
};

/**
 * Same as above but with default registry
 *
 * @param locale
 */
export const loadLocale = (locale: string) => _loadLocale(locale);

/**
 * Dynamic update of translations
 *
 * @param locale
 * @param nextMessages
 */
const _updateLocale = (locale: string, nextMessages: ITranslationDictionaries) => {
    localeDictionary[locale] = nextMessages;
    if (!loadedLanguages.includes(locale)) loadedLanguages.push(locale);
    return Promise.resolve();
};

/**
 * Same as above but with default registry
 *
 * @param locale
 * @param nextMessages
 */
export const updateLocale = (locale: string, nextMessages: ITranslationDictionaries) =>
    _updateLocale(locale, nextMessages);

/**
 * Change selected language
 *
 * @param locale
 */
const _changeLanguage = (locale: string): Promise<unknown> => {
    if (!loadedLanguages.includes(locale)) return _loadLocale(locale);

    currentLocale = locale;
    document.querySelector('html')?.setAttribute('lang', locale);
    return Promise.resolve(locale);
};

/**
 * Same as above but with default registry
 *
 * @param locale
 */
export const changeLanguage = (locale: string) => _changeLanguage(locale);

/**
 * Get user locale, fallback if not available
 */
export const getDefaultLocale = () => {
    const foundLocale = navigator.language.slice(0, 2);
    if (supportedLanguages.includes(foundLocale)) return foundLocale;
    if (loadedLanguages.includes(fallbackLocale)) return fallbackLocale;
    return loadedLanguages[0] ?? 'en';
};

/**
 * Current locale value
 */
export const getCurrentLocale = () => currentLocale;

/**
 * Set fallback locale for this util registry
 *
 * @param locale
 */
export const setFallbackLocale = (locale: string) => {
    fallbackLocale = locale;
};

/**
 * Translate key using selected locale dictionary
 *
 * @param key
 */
export const t = (key: string) => {
    const dictionary = localeDictionary[currentLocale] ?? localeDictionary[fallbackLocale];
    if (!dictionary) return key;

    return (
        getTranslationFromDictionary(dictionary, key) ??
        getTranslationFromDictionary(localeDictionary[fallbackLocale] ?? {}, key) ??
        key
    );
};

/**
 * Build a route-like object with current locale attached
 *
 * @param to
 */
export const routeWithI18n = (to: string | { path?: string; params?: Record<string, unknown>; [key: string]: unknown }) => {
    if (typeof to === 'string')
        return {
            path: to,
            params: {
                locale: getCurrentLocale()
            }
        };

    return {
        ...to,
        params: {
            locale: getCurrentLocale(),
            ...(to.params ?? {})
        }
    };
};
