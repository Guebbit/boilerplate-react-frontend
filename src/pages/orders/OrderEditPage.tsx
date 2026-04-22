import { useParams } from 'react-router-dom';

import { BaseButton } from '@/components/atoms/BaseButton';
import { BaseInput } from '@/components/atoms/BaseInput';

export const OrderEditPage = () => {
    const { id } = useParams();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section>
            <h1>Edit order #{id}</h1>
            <form className='d-flex flex-column gap-2' onSubmit={onSubmit}>
                <BaseInput id='orderStatus' label='Status' required />
                <BaseButton type='submit'>Save</BaseButton>
            </form>
        </section>
    );
};
