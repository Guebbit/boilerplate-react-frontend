import { Link } from 'react-router-dom';

const orders = [
    { id: 1, total: 75.5 },
    { id: 2, total: 32.2 }
];

export const OrdersListPage = () => (
    <section>
        <h1>Orders</h1>
        <ul>
            {orders.map((order) => (
                <li key={order.id}>
                    <Link to={`/orders/${order.id}`}>Order #{order.id}</Link> - €{order.total}
                </li>
            ))}
        </ul>
    </section>
);
