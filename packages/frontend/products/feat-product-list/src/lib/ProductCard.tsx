import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Rating, Price, Button, IconButton } from '@tusky/tusky-design';
import { Heart, ShoppingCart } from 'lucide-react';

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  image,
  category,
}) => {
  const isOnSale = originalPrice !== undefined && originalPrice > price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${id}`} className="block">
        <div className="relative">
          <img src={image} alt={name} className="w-full h-64 object-cover" />
          <IconButton
            icon={<Heart className="w-4 h-4" />}
            className="absolute top-3 right-3 z-10"
            onClick={(e) => e.preventDefault()}
          />
          {isOnSale && (
            <Badge variant="sale" className="absolute top-3 left-3">
              SALE
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-4">
        <span className="text-sm text-gray-500">{category}</span>
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-semibold text-gray-800 mt-1 hover:text-indigo-600">
            {name}
          </h3>
        </Link>

        <Rating value={rating} size="sm" className="mt-1" />

        <div className="mt-2 flex items-center justify-between">
          <Price price={price} originalPrice={originalPrice} size="sm" />

          <Button variant="icon" aria-label="Add to cart">
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
