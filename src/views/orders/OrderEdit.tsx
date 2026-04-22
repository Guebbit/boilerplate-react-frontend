import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useOrdersStore } from '@/stores/orders';

export function OrderEditPage() {
  const { id = '' } = useParams();
  const order = useOrdersStore((state) => state.findOrder(id));
  const updateOrder = useOrdersStore((state) => state.updateOrder);
  const [status, setStatus] = useState<'draft' | 'confirmed'>(order?.status ?? 'draft');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateOrder(id, { status });
    navigate(`/en/orders/${id}`);
  };

  return (
    <LayoutDefault centered>
      <form className="theme-card" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="theme-page-title">Edit order</h1>
        <label>Status</label>
        <select className="theme-select" value={status} onChange={(event) => setStatus(event.target.value as 'draft' | 'confirmed')}>
          <option value="draft">draft</option>
          <option value="confirmed">confirmed</option>
        </select>
        <button className="theme-button" type="submit">Update</button>
      </form>
    </LayoutDefault>
  );
}
