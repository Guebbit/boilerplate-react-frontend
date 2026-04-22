import { BaseSelect } from '@/components/atoms/BaseSelect';
import { useAppI18n } from '@/hooks/useAppI18n';

export const LanguageSwitcher = () => {
    const { locale, setLocale } = useAppI18n();

    return (
        <BaseSelect
            id='localeSwitcher'
            label=''
            value={locale}
            onChange={(event) => setLocale(event.target.value)}
            options={[
                { value: 'en', label: 'EN' },
                { value: 'it', label: 'IT' }
            ]}
        />
    );
};
