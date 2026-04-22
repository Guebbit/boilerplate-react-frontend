import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCounterStore } from '@/stores/counter';

describe('useCounterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });

  it('increments and computes doubleCount', () => {
    useCounterStore.getState().increment();

    expect(useCounterStore.getState().count).toBe(1);
    expect(useCounterStore.getState().doubleCount()).toBe(2);
  });

  it('increments after delay', async () => {
    vi.useFakeTimers();
    const promise = useCounterStore.getState().incrementDelayed();

    await vi.advanceTimersByTimeAsync(1000);
    await promise;

    expect(useCounterStore.getState().count).toBe(1);
    vi.useRealTimers();
  });
});
