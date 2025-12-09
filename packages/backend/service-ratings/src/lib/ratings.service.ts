import { ProductRating } from '@tusky/api-types';
import { RatingsRepository, ratingsRepository } from '@tusky/data-ratings';

export class RatingsService {
  constructor(private repo: RatingsRepository = ratingsRepository) {}

  getRatingByProductId(productId: number): ProductRating | undefined {
    return this.repo.findByProductId(productId);
  }
}

export const ratingsService = new RatingsService();
