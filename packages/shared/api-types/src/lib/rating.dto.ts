export interface ProductRating {
  productId: number;
  averageRating: number;
  totalRatings: number;
}

export interface IndividualRating {
  id: number;
  productId: number;
  value: number;
  comment: string;
}
