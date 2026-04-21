export const SUPPORTED_LOCALES = ['en', 'it', 'es'];

export const getDefaultLocale = () =>
  import.meta.env.VITE_APP_DEFAULT_LOCALE && SUPPORTED_LOCALES.includes(import.meta.env.VITE_APP_DEFAULT_LOCALE)
    ? import.meta.env.VITE_APP_DEFAULT_LOCALE
    : 'en';
