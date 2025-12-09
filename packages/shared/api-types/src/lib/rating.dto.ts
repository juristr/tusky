export interface UserRating {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  review: string;
  createdAt: string;
}

export interface ProductRating {
  productId: number;
  averageRating: number;
  totalRatings: number;
}
