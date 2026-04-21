import { describe, expect, it } from 'vitest';

import { increment, incrementBy, reduxExampleReducer } from '@/redux/exampleSlice';

describe('reduxExampleSlice', () => {
  it('handles increment', () => {
    const state = reduxExampleReducer({ value: 0 }, increment());
    expect(state.value).toBe(1);
  });

  it('handles incrementBy', () => {
    const state = reduxExampleReducer({ value: 2 }, incrementBy(5));
    expect(state.value).toBe(7);
  });
});
