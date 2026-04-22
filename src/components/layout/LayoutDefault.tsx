import { Outlet } from 'react-router-dom';

import { Navigation } from '@/components/organisms/Navigation';

export const LayoutDefault = () => (
    <div className='page-wrapper'>
        <Navigation />
        <main className='container py-3'>
            <Outlet />
        </main>
    </div>
);
