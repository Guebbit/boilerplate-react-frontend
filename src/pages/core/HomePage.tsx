import { useMemo } from 'react';

import { CounterInput } from '@/components/atoms/CounterInput';
import { useAppI18n } from '@/hooks/useAppI18n';
import { useCartStore } from '@/stores/useCartStore';
import { useCounterStore } from '@/stores/useCounterStore';

export const HomePage = () => {
    const { t } = useAppI18n();
    const count = useCounterStore((state) => state.count);
    const setCount = useCounterStore((state) => state.setCount);
    const cartItems = useCartStore((state) => state.items);

    const totalItems = useMemo(
        () => cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0),
        [cartItems]
    );

    return (
        <section>
            <h1>{t('home.title')}</h1>
            <p>{t('home.subtitle')}</p>
            <CounterInput value={count} onChange={setCount} />
            <p>Cart items: {totalItems}</p>
        </section>
    );
};
