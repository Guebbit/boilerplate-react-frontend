// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CounterInput } from '@/components/atoms/CounterInput';

describe('CounterInput component UNIT TEST', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders the component', () => {
        render(<CounterInput value={0} onChange={() => {}} />);
        expect(screen.getByLabelText('Counter value')).toBeTruthy();
    });

    it('renders the provided value', () => {
        render(<CounterInput value={5} onChange={() => {}} />);
        const input = screen.getByLabelText('Counter value') as HTMLInputElement;
        expect(input.value).toBe('5');
    });

    it('respects min and max bounds', () => {
        const onChange = vi.fn();
        render(<CounterInput value={8} min={2} max={9} onChange={onChange} />);
        const input = screen.getByLabelText('Counter value');

        fireEvent.change(input, { target: { value: '9' } });
        expect(onChange).toHaveBeenCalledWith(9);

        onChange.mockClear();
        fireEvent.change(input, { target: { value: '10' } });
        fireEvent.change(input, { target: { value: '1' } });
        expect(onChange).not.toHaveBeenCalled();
    });
});
