import { UserRating, ProductRating } from '@tusky/api-types';
import { RatingsRepository, ratingsRepository } from '@tusky/data-ratings';

export class RatingsService {
  constructor(private repo: RatingsRepository = ratingsRepository) {}

  getByProductId(productId: number): UserRating[] {
    return this.repo.findByProductId(productId);
  }

  getProductRating(productId: number): ProductRating | undefined {
    return this.repo.getAggregated(productId);
  }
}

export const ratingsService = new RatingsService();
