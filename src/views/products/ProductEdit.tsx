import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useProductsStore } from '@/stores/products';

export function ProductEditPage() {
  const { id = '' } = useParams();
  const product = useProductsStore((state) => state.findProduct(id));
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const [price, setPrice] = useState(product?.price ?? 0);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateProduct(id, { price });
    navigate(`/en/products/${id}`);
  };

  return (
    <LayoutDefault centered>
      <form className="theme-card" onSubmit={(event) => void handleSubmit(event)}>
        <h1 className="theme-page-title">Edit product</h1>
        <label>Price</label>
        <input
          className="theme-input"
          type="number"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
        />
        <button className="theme-button" type="submit">Update</button>
      </form>
    </LayoutDefault>
  );
}
