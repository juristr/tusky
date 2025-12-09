import { ProductRating } from '@tusky/api-types';
import { RatingsRepository, ratingsRepository } from '@tusky/data-ratings';

export class RatingsService {
  constructor(private repo: RatingsRepository = ratingsRepository) {}

  getRatingByProductId(productId: number): ProductRating | undefined {
    const userRatings = this.repo.findByProductId(productId);

    if (userRatings.length === 0) {
      return undefined;
    }

    const totalRatings = userRatings.length;
    const sumRatings = userRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = Math.round((sumRatings / totalRatings) * 10) / 10;

    return {
      productId,
      averageRating,
      totalRatings,
    };
  }
}

export const ratingsService = new RatingsService();
