import { describe, expect, it } from 'vitest';

import { useCounterStore } from '@/stores/useCounterStore';

describe('useCounterStore', () => {
    it('increments count', () => {
        useCounterStore.setState({ count: 0 });
        useCounterStore.getState().increment();
        expect(useCounterStore.getState().count).toBe(1);
    });
});
