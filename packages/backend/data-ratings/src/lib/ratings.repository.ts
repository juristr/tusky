import { ProductRating } from '@tusky/api-types';

const ratings: ProductRating[] = [
  { productId: 1, averageRating: 4.7, totalRatings: 2341 },
  { productId: 2, averageRating: 4.2, totalRatings: 1876 },
  { productId: 3, averageRating: 3.8, totalRatings: 654 },
  { productId: 4, averageRating: 4.9, totalRatings: 3102 },
  { productId: 5, averageRating: 4.4, totalRatings: 892 },
  { productId: 6, averageRating: 4.1, totalRatings: 445 },
  { productId: 7, averageRating: 4.6, totalRatings: 1567 },
  { productId: 8, averageRating: 4.3, totalRatings: 723 },
];

export class RatingsRepository {
  findByProductId(productId: number): ProductRating | undefined {
    return ratings.find((r) => r.productId === productId);
  }
}

export const ratingsRepository = new RatingsRepository();
