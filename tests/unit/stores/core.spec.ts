import { beforeEach, describe, expect, it } from 'vitest';
import { isCoreLoading, useCoreStore } from '@/toolkit/react-toolkit';

describe('core store', () => {
    beforeEach(() => {
        useCoreStore.setState({ loadings: {} });
    });

    it('manages loading states with helpers', () => {
        const store = useCoreStore.getState();

        store.setLoading('core', true);
        expect(store.getLoading('core')).toBe(true);
        expect(isCoreLoading()).toBe(true);

        store.setLoading('core', false);
        expect(store.getLoading('core')).toBe(false);
        expect(isCoreLoading()).toBe(false);

        store.setLoading('usersList', true);
        expect(store.getLoading('usersList')).toBe(true);

        store.resetLoadings();
        expect(store.getLoading('usersList')).toBe(false);
        expect(isCoreLoading()).toBe(false);
    });
});
