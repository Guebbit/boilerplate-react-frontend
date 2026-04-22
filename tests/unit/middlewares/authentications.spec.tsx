// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RequireAdmin, RequireAuth, RequireGuest } from '@/middlewares/authentication';

const addMessageMock = vi.fn();
const profileState = {
    isAuth: () => false,
    isAdmin: () => false
};

vi.mock('@/stores/profile', () => ({
    useProfileStore: (selector: (state: typeof profileState) => unknown) => selector(profileState)
}));

vi.mock('@/toolkit/react-toolkit', () => ({
    useNotificationsStore: {
        getState: () => ({
            addMessage: addMessageMock
        })
    }
}));

describe('authentication middleware', () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        profileState.isAuth = () => false;
        profileState.isAdmin = () => false;
    });

    it('redirects guest to login for auth-only route', () => {
        render(
            <MemoryRouter initialEntries={['/en/admin']}>
                <Routes>
                    <Route
                        path="/en/admin"
                        element={
                            <RequireAuth>
                                <div>Admin content</div>
                            </RequireAuth>
                        }
                    />
                    <Route path="/en/account/login" element={<div>Login page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login page')).toBeTruthy();
        expect(addMessageMock).toHaveBeenCalledWith('Please login first', 'warning', 2500);
    });

    it('redirects authenticated user away from guest-only route', () => {
        profileState.isAuth = () => true;

        render(
            <MemoryRouter initialEntries={['/en/account/login']}>
                <Routes>
                    <Route
                        path="/en/account/login"
                        element={
                            <RequireGuest>
                                <div>Login form</div>
                            </RequireGuest>
                        }
                    />
                    <Route path="/en" element={<div>Home page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Home page')).toBeTruthy();
        expect(addMessageMock).toHaveBeenCalledWith('You are already logged in', 'warning', 2500);
    });

    it('blocks non-admin on admin middleware', () => {
        profileState.isAuth = () => true;
        profileState.isAdmin = () => false;

        render(
            <MemoryRouter initialEntries={['/en/admin']}>
                <Routes>
                    <Route
                        path="/en/admin"
                        element={
                            <RequireAdmin>
                                <div>Admin area</div>
                            </RequireAdmin>
                        }
                    />
                    <Route path="/en" element={<div>Home page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Home page')).toBeTruthy();
        expect(addMessageMock).toHaveBeenCalledWith('Admin access required', 'error', 2500);
    });
});
