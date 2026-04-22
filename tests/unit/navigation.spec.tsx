import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { Navigation } from '@/components/organisms/Navigation';
import { I18nProvider } from '@/i18n/I18nProvider';

describe('Navigation', () => {
    it('renders primary links', () => {
        render(
            <I18nProvider>
                <BrowserRouter>
                    <Navigation />
                </BrowserRouter>
            </I18nProvider>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
    });
});
