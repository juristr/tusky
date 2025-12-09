import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, Product } from '@tusky/data-access-products';
import { ProductDetail } from '../lib/ProductDetail';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? parseInt(id, 10) : null;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    getProductById(productId)
      .then((p) => setProduct(p ?? null))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (!productId) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-8"
        data-testid="invalid-product"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Invalid Product</h1>
          <p className="mt-2 text-gray-600">
            Please provide a valid product ID.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-8"
        data-testid="product-loading"
      >
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8" data-testid="product-error">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 py-8"
        data-testid="product-not-found"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Product Not Found
          </h1>
          <p className="mt-2 text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const productDetailData = {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    description: `Experience the excellence of ${
      product.name
    }. This premium ${product.category.toLowerCase()} product has been carefully crafted to meet your highest expectations.`,
    images: [product.image],
    rating: product.rating,
    reviewCount: Math.floor(Math.random() * 1000) + 100,
    features: [
      'Premium quality materials',
      'Satisfaction guaranteed',
      'Free shipping on orders over $50',
      '30-day return policy',
    ],
    inStock: true,
  };

  return <ProductDetail product={productDetailData} />;
}

export default ProductDetailPage;
