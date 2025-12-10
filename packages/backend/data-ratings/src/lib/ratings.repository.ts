import { UserRating } from '@tusky/api-types';

const ratings: UserRating[] = [
  {
    productId: 1,
    rating: 5,
    comment: 'Amazing sound quality and noise cancellation!',
  },
  { productId: 1, rating: 5, comment: 'Best headphones I have ever owned.' },
  { productId: 1, rating: 4, comment: 'Great product, a bit pricey though.' },
  { productId: 2, rating: 4, comment: 'Picture quality is stunning.' },
  { productId: 2, rating: 5, comment: 'Smart features work flawlessly.' },
  { productId: 2, rating: 3, comment: 'Good TV but sound could be better.' },
  { productId: 3, rating: 4, comment: 'Beautiful bag, very stylish.' },
  { productId: 3, rating: 5, comment: 'Perfect size for everyday use.' },
  { productId: 4, rating: 5, comment: 'Super comfortable for long runs.' },
  { productId: 4, rating: 5, comment: 'Great support and cushioning.' },
  { productId: 4, rating: 4, comment: 'Excellent shoes, run a bit small.' },
  { productId: 5, rating: 4, comment: 'Keeps water cold all day.' },
  { productId: 5, rating: 3, comment: 'Good quality but lid is hard to open.' },
  { productId: 6, rating: 4, comment: 'Lovely scents, burns evenly.' },
  { productId: 6, rating: 5, comment: 'Perfect for relaxation.' },
  { productId: 7, rating: 5, comment: 'Tracks everything accurately.' },
  { productId: 7, rating: 5, comment: 'Battery lasts forever!' },
  { productId: 7, rating: 4, comment: 'Great features but app needs work.' },
  { productId: 8, rating: 4, comment: 'Skin feels amazing after use.' },
  { productId: 8, rating: 4, comment: 'Gentle and hydrating.' },
];

export class RatingsRepository {
  findByProductId(productId: number): UserRating[] {
    return ratings.filter((r) => r.productId === productId);
  }
}

export const ratingsRepository = new RatingsRepository();
