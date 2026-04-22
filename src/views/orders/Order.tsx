import { Link, useParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useOrdersStore } from '@/stores/orders';

export function OrderPage() {
  const { id = '' } = useParams();
  const order = useOrdersStore((state) => state.findOrder(id));

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Order</h1>
      <div className="theme-card">
        <p>ID: {order?.id}</p>
        <p>Status: {order?.status}</p>
        <p>Total: {order?.total}</p>
        <Link className="theme-button" to={`/en/orders/${id}/edit`}>
          Edit
        </Link>
      </div>
    </LayoutDefault>
  );
}
