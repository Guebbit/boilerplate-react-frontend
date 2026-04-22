import { useNavigate } from 'react-router-dom';

import { BaseButton } from '@/components/atoms/BaseButton';
import { BaseInput } from '@/components/atoms/BaseInput';
import { useProfileStore } from '@/stores/useProfileStore';

export const LoginPage = () => {
    const navigate = useNavigate();
    const loginAsDemoUser = useProfileStore((state) => state.loginAsDemoUser);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginAsDemoUser();
        navigate('/account/profile');
    };

    return (
        <section>
            <h1>Login</h1>
            <form className='d-flex flex-column gap-2' onSubmit={onSubmit}>
                <BaseInput id='loginEmail' label='Email' type='email' required />
                <BaseInput id='loginPassword' label='Password' type='password' required />
                <BaseButton type='submit'>Login</BaseButton>
            </form>
        </section>
    );
};
