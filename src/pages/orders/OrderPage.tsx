import { Link, useParams } from 'react-router-dom';

export const OrderPage = () => {
    const { id } = useParams();

    return (
        <section>
            <h1>Order #{id}</h1>
            <p>Order detail placeholder.</p>
            <Link to={`/orders/${id}/edit`}>Edit order</Link>
        </section>
    );
};
