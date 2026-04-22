import type { InputHTMLAttributes } from 'react';

type IBaseInputProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

export const BaseInput = ({ label, id, ...props }: IBaseInputProps) => (
    <label className='form-label d-flex flex-column gap-1' htmlFor={id}>
        <span>{label}</span>
        <input id={id} className='form-control' {...props} />
    </label>
);
