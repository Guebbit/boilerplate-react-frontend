import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useOrdersStore } from '@/stores/orders';

export function OrdersListPage() {
  const orders = useOrdersStore((state) => state.orders);
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Orders</h1>
      {orders.map((order) => (
        <div key={order.id} className="theme-card row">
          <span>{order.id}</span>
          <span>{order.status}</span>
          <span>{order.total}€</span>
          <Link className="theme-button" to={`/en/orders/${order.id}`}>
            View
          </Link>
        </div>
      ))}
    </LayoutDefault>
  );
}
