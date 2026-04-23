import type { InputHTMLAttributes } from 'react';

type IBaseCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string;
};

export const BaseCheckbox = ({ label, id, ...props }: IBaseCheckboxProps) => (
    <label className='form-check-label d-flex align-items-center gap-2' htmlFor={id}>
        <input id={id} type='checkbox' className='form-check-input mt-0' {...props} />
        <span>{label}</span>
    </label>
);
