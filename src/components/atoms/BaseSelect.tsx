import type { SelectHTMLAttributes } from 'react';

type ISelectOption = { value: string; label: string };

type IBaseSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: ISelectOption[];
};

export const BaseSelect = ({ label, id, options, ...props }: IBaseSelectProps) => (
    <label className='form-label d-flex flex-column gap-1' htmlFor={id}>
        <span>{label}</span>
        <select id={id} className='form-select' {...props}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </label>
);
