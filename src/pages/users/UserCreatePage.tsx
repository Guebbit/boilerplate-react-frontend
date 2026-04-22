import { BaseButton } from '@/components/atoms/BaseButton';
import { BaseInput } from '@/components/atoms/BaseInput';

export const UserCreatePage = () => {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section>
            <h1>Create user</h1>
            <form className='d-flex flex-column gap-2' onSubmit={onSubmit}>
                <BaseInput id='newUserEmail' label='Email' type='email' required />
                <BaseInput id='newUserName' label='Username' required />
                <BaseButton type='submit'>Create</BaseButton>
            </form>
        </section>
    );
};
