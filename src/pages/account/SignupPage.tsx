import type { FormEvent } from 'react';
import { BaseButton } from '@/components/atoms/BaseButton';
import { BaseInput } from '@/components/atoms/BaseInput';

export const SignupPage = () => {
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section>
            <h1>Signup</h1>
            <form className='d-flex flex-column gap-2' onSubmit={onSubmit}>
                <BaseInput id='signupEmail' label='Email' type='email' required />
                <BaseInput id='signupUsername' label='Username' required />
                <BaseInput id='signupPassword' label='Password' type='password' required />
                <BaseButton type='submit'>Create account</BaseButton>
            </form>
        </section>
    );
};
