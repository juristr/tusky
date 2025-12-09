import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { Price, Button, IconButton } from '@tusky/tusky-design';
import { SmartRating, RatingsModal } from '@tusky/ui-ratings';
import { useState } from 'react';

interface ProductDetailProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    images: string[];
    features?: string[];
    inStock?: boolean;
  };
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showRatingsModal, setShowRatingsModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="product-detail">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Image thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side - Product info */}
        <div className="space-y-6">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900"
              data-testid="product-name"
            >
              {product.name}
            </h1>

            {/* Rating */}
            <SmartRating
              productId={product.id}
              className="mt-2"
              onCountClick={() => setShowRatingsModal(true)}
            />
          </div>

          {/* Price */}
          <Price
            price={product.price}
            originalPrice={product.originalPrice}
            showDiscount
            size="lg"
          />

          {/* Description */}
          <div className="prose prose-sm text-gray-600">
            <p>{product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Key Features</h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-gray-700"
              >
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<ShoppingCart className="w-5 h-5" />}
                disabled={!product.inStock}
                className="flex-1"
              >
                Add to Cart
              </Button>

              <Button variant="danger" size="lg" className="flex-1">
                Buy Now
              </Button>
            </div>

            {/* Additional actions */}
            <div className="flex gap-4 pt-2">
              <IconButton
                icon={<Heart className="w-5 h-5" />}
                label="Add to Wishlist"
              />
              <IconButton icon={<Share2 className="w-5 h-5" />} label="Share" />
            </div>
          </div>

          {/* Stock status */}
          <div className="text-sm">
            {product.inStock ? (
              <span className="text-green-600 font-medium">✓ In Stock</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
        </div>
      </div>

      <RatingsModal
        isOpen={showRatingsModal}
        onClose={() => setShowRatingsModal(false)}
        productId={product.id}
      />
    </div>
  );
}

export default ProductDetail;
