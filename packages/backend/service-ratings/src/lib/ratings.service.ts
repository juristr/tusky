import { RatingSummary, UserRating } from '@tusky/api-types';
import { RatingsRepository, ratingsRepository } from '@tusky/data-ratings';

export class RatingsService {
  constructor(private repo: RatingsRepository = ratingsRepository) {}

  getRatingSummary(productId: number): RatingSummary | undefined {
    const ratings = this.repo.findByProductId(productId);
    if (ratings.length === 0) {
      return undefined;
    }
    const totalRatings = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = sum / totalRatings;
    return {
      productId,
      rating: Math.round(avgRating * 10) / 10,
      totalRatings,
    };
  }

  getAllRatings(productId: number): UserRating[] {
    return this.repo.findByProductId(productId);
  }
}

export const ratingsService = new RatingsService();
