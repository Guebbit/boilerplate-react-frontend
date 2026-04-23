import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type IBaseButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const BaseButton = ({ children, className = '', type = 'button', ...props }: IBaseButtonProps) => (
    <button type={type} className={`btn btn-primary ${className}`.trim()} {...props}>
        {children}
    </button>
);
