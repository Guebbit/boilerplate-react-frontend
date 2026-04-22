import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { BaseButton } from '@/components/atoms/BaseButton';
import { useCartStore } from '@/stores/useCartStore';

export const ProductPage = () => {
    const { id } = useParams();
    const addItem = useCartStore((state) => state.addItem);

    const productId = Number(id || 0);
    const product = useMemo(
        () => ({ id: productId, title: `Product #${productId}`, price: 9.99, createdAt: '', updatedAt: '' }),
        [productId]
    );

    return (
        <section>
            <h1>{product.title}</h1>
            <p>Price: €{product.price}</p>
            <BaseButton onClick={() => addItem(product)}>Add to cart</BaseButton>
            <div className='mt-2'>
                <Link to={`/products/${productId}/edit`}>Edit product</Link>
            </div>
        </section>
    );
};
