import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { CounterInput } from '@/components/atoms/CounterInput';

describe('CounterInput', () => {
    it('calls onChange with incremented value', () => {
        const onChange = vi.fn();
        render(<CounterInput value={2} onChange={onChange} />);

        fireEvent.click(screen.getByText('+'));

        expect(onChange).toHaveBeenCalledWith(3);
    });
});
