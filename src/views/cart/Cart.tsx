import { useEffect } from 'react';

import { LayoutDefault } from '@/layouts/LayoutDefault';
import { useCartStore } from '@/stores/cart';
import { useProductsStore } from '@/stores/products';

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const cartCount = useCartStore((state) => state.cartCount());
  const fetchCart = useCartStore((state) => state.fetchCart);
  const upsertCartItem = useCartStore((state) => state.upsertCartItem);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const products = useProductsStore((state) => state.items);
  const fetchProducts = useProductsStore((state) => state.fetchProducts);

  useEffect(() => {
    void fetchProducts();
    void fetchCart();
  }, [fetchCart, fetchProducts]);

  return (
    <LayoutDefault>
      <h1 className="theme-page-title">Cart ({cartCount})</h1>
      <div className="theme-card row">
        {products.map((product) => (
          <button
            key={product.id}
            className="theme-button"
            type="button"
            onClick={() => void upsertCartItem(product.id, 1)}
          >
            Add {product.name}
          </button>
        ))}
        <button className="theme-button" type="button" onClick={() => void clearCart()}>
          Clear cart
        </button>
      </div>
      {items.map((item) => (
        <div key={item.productId} className="theme-card row">
          <span>{item.productId}</span>
          <span>Qty: {item.quantity}</span>
          <button className="theme-button" type="button" onClick={() => void removeCartItem(item.productId)}>
            Remove
          </button>
        </div>
      ))}
    </LayoutDefault>
  );
}
