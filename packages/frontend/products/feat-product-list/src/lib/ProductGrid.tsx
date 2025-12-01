import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts, Product } from '@tusky/data-access-products';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div data-testid="product-grid-loading" className="text-center py-8">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div
        data-testid="product-grid-error"
        className="text-center py-8 text-red-600"
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}

export default ProductGrid;
