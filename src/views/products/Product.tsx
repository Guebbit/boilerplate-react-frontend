import { Link, useParams } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useProductsStore } from '@/stores/products';

export function ProductPage() {
  const { id = '' } = useParams();
  const product = useProductsStore((state) => state.findProduct(id));

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Product</h1>
      <div className="theme-card">
        <p>ID: {product?.id}</p>
        <p>Name: {product?.name}</p>
        <p>Price: {product?.price}</p>
        <Link className="theme-button" to={`/en/products/${id}/edit`}>
          Edit
        </Link>
      </div>
    </LayoutDefault>
  );
}
