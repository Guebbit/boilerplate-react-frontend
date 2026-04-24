import { BaseButton } from '@/components/atoms/BaseButton';

type ICounterInputProps = {
    value: number;
    onChange: (value: number) => void;
};

export const CounterInput = ({ value, onChange }: ICounterInputProps) => (
    <div className='d-flex align-items-center gap-2'>
        <BaseButton className='btn-sm' onClick={() => onChange(Math.max(0, value - 1))}>
            -
        </BaseButton>
        <span data-testid='counter-value'>{value}</span>
        <BaseButton className='btn-sm' onClick={() => onChange(value + 1)}>
            +
        </BaseButton>
    </div>
);
