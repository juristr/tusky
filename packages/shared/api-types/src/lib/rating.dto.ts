export interface RatingSummary {
  productId: number;
  rating: number;
  totalRatings: number;
}

export interface UserRating {
  productId: number;
  rating: number;
  comment: string;
}
