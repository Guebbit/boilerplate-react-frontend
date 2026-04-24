import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { initializeApiMocking } from '../.dev/mocks/apiMock';
import { App } from '@/app/App';
import { I18nProvider } from '@/i18n/I18nProvider';

import '@/styles/theme.scss';
import '@/styles/main.scss';

initializeApiMocking();

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
    <StrictMode>
        <I18nProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </I18nProvider>
    </StrictMode>
);
