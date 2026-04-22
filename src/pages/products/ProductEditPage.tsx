import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';

import { BaseButton } from '@/components/atoms/BaseButton';
import { BaseInput } from '@/components/atoms/BaseInput';

export const ProductEditPage = () => {
    const { id } = useParams();

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <section>
            <h1>Edit product #{id}</h1>
            <form className='d-flex flex-column gap-2' onSubmit={onSubmit}>
                <BaseInput id='productTitle' label='Title' required />
                <BaseInput id='productPrice' label='Price' type='number' min={0} required />
                <BaseButton type='submit'>Save</BaseButton>
            </form>
        </section>
    );
};
