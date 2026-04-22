import { NavLink } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/atoms/LanguageSwitcher';
import { useAppI18n } from '@/hooks/useAppI18n';
import { useProfileStore } from '@/stores/useProfileStore';

export const Navigation = () => {
    const { t } = useAppI18n();
    const profile = useProfileStore((state) => state.profile);
    const logout = useProfileStore((state) => state.logout);

    return (
        <nav className='navbar navbar-expand navbar-light bg-light px-3 gap-3'>
            <NavLink to='/'>{t('navigation.home')}</NavLink>
            <NavLink to='/products'>{t('navigation.products')}</NavLink>
            <NavLink to='/orders'>{t('navigation.orders')}</NavLink>
            <NavLink to='/users'>{t('navigation.users')}</NavLink>
            <NavLink to='/cart'>{t('navigation.cart')}</NavLink>
            <NavLink to='/admin'>{t('navigation.admin')}</NavLink>
            <div className='ms-auto d-flex align-items-center gap-2'>
                <LanguageSwitcher />
                {profile ? (
                    <>
                        <span>{profile.username}</span>
                        <button type='button' className='btn btn-sm btn-outline-secondary' onClick={logout}>
                            {t('navigation.logout')}
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to='/account/login'>{t('navigation.login')}</NavLink>
                        <NavLink to='/account/signup'>{t('navigation.signup')}</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};
