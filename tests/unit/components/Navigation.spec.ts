// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Navigation } from '@/components/organisms/Navigation';

describe('Navigation', () => {
    it('renders properly', () => {
        render(
            <MemoryRouter>
                <Navigation profileLabel="john">child content</Navigation>
            </MemoryRouter>
        );

        expect(screen.getByText('Home')).toBeTruthy();
        expect(screen.getByText('Products')).toBeTruthy();
        expect(screen.getByText('child content')).toBeTruthy();
        expect(screen.getByText('Hello john')).toBeTruthy();
    });
});
