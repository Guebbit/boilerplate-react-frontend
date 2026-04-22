import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useProductsStore } from '@/stores/products';

export function ProductsListPage() {
  const items = useProductsStore((state) => state.items);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Products</h1>
      {items.map((product) => (
        <div key={product.id} className="theme-card row">
          <span>{product.name}</span>
          <strong>{product.price}€</strong>
          <Link className="theme-button" to={`/en/products/${product.id}`}>
            View
          </Link>
          <Link className="theme-button" to={`/en/products/${product.id}/edit`}>
            Edit
          </Link>
        </div>
      ))}
    </LayoutDefault>
  );
}
