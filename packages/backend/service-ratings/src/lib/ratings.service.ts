import { ProductRating } from '@tusky/api-types';
import { Rating, RatingsRepository, ratingsRepository } from '@tusky/data-ratings';

export class RatingsService {
  constructor(private repo: RatingsRepository = ratingsRepository) {}

  getAggregatedRating(productId: number): ProductRating | undefined {
    const ratings = this.repo.findByProductId(productId);

    if (ratings.length === 0) {
      return undefined;
    }

    const totalRatings = ratings.length;
    const averageRating =
      ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings;

    return {
      productId,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalRatings,
    };
  }

  getAllRatingsForProduct(productId: number): Rating[] {
    return this.repo.findByProductId(productId);
  }
}

export const ratingsService = new RatingsService();
