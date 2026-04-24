import { useMemo } from 'react';

import { BaseButton } from '@/components/atoms/BaseButton';
import { useCartStore } from '@/stores/useCartStore';

export const CartPage = () => {
    const items = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const clear = useCartStore((state) => state.clear);

    const total = useMemo(
        () => items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0),
        [items]
    );

    return (
        <section>
            <h1>Cart</h1>
            {items.length === 0 ? (
                <p>Cart is empty.</p>
            ) : (
                <>
                    <ul>
                        {items.map((item) => (
                            <li key={item.id}>
                                {item.title} ({item.quantity}) - €{item.price}
                                <BaseButton className='btn-sm ms-2' onClick={() => removeItem(item.id)}>
                                    Remove
                                </BaseButton>
                            </li>
                        ))}
                    </ul>
                    <p>Total: €{total.toFixed(2)}</p>
                    <BaseButton onClick={clear}>Clear cart</BaseButton>
                </>
            )}
        </section>
    );
};
