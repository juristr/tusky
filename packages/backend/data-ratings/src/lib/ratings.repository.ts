import { UserRating } from '@tusky/api-types';

const ratings: UserRating[] = [
  // Product 1 ratings
  {
    id: 1,
    productId: 1,
    userId: 101,
    rating: 5,
    review: 'Absolutely love this product! Exceeded expectations.',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    productId: 1,
    userId: 102,
    rating: 5,
    review: 'Great quality and fast shipping.',
    createdAt: '2024-01-20T14:22:00Z',
  },
  {
    id: 3,
    productId: 1,
    userId: 103,
    rating: 4,
    review: 'Very good, minor issues with packaging.',
    createdAt: '2024-02-01T09:15:00Z',
  },
  {
    id: 4,
    productId: 1,
    userId: 104,
    rating: 5,
    review: 'Perfect! Will buy again.',
    createdAt: '2024-02-10T16:45:00Z',
  },
  {
    id: 5,
    productId: 1,
    userId: 105,
    rating: 4,
    review: 'Solid product, recommended.',
    createdAt: '2024-02-15T11:30:00Z',
  },

  // Product 2 ratings
  {
    id: 6,
    productId: 2,
    userId: 106,
    rating: 1,
    review: 'Good value for money.',
    createdAt: '2024-01-18T08:00:00Z',
  },
  {
    id: 7,
    productId: 2,
    userId: 107,
    rating: 2,
    review: 'Amazing quality!',
    createdAt: '2024-01-25T13:20:00Z',
  },
  {
    id: 8,
    productId: 2,
    userId: 108,
    rating: 2,
    review: 'Pretty good overall.',
    createdAt: '2024-02-05T17:10:00Z',
  },

  // Product 3 ratings
  {
    id: 10,
    productId: 3,
    userId: 110,
    rating: 4,
    review: 'Nice design and functionality.',
    createdAt: '2024-01-22T12:30:00Z',
  },
  {
    id: 11,
    productId: 3,
    userId: 111,
    rating: 3,
    review: 'Average quality.',
    createdAt: '2024-02-02T15:45:00Z',
  },
  {
    id: 12,
    productId: 3,
    userId: 112,
    rating: 4,
    review: 'Works as expected.',
    createdAt: '2024-02-08T09:20:00Z',
  },

  // Product 4 ratings
  {
    id: 13,
    productId: 4,
    userId: 113,
    rating: 5,
    review: 'Best purchase I made this year!',
    createdAt: '2024-01-10T11:00:00Z',
  },
  {
    id: 14,
    productId: 4,
    userId: 114,
    rating: 5,
    review: 'Outstanding quality and service.',
    createdAt: '2024-01-28T14:30:00Z',
  },
  {
    id: 15,
    productId: 4,
    userId: 115,
    rating: 5,
    review: 'Highly recommend to everyone.',
    createdAt: '2024-02-03T16:00:00Z',
  },
  {
    id: 16,
    productId: 4,
    userId: 116,
    rating: 4,
    review: 'Great product, slightly overpriced.',
    createdAt: '2024-02-11T10:45:00Z',
  },
  {
    id: 17,
    productId: 4,
    userId: 117,
    rating: 5,
    review: 'Exceeded all my expectations!',
    createdAt: '2024-02-14T13:15:00Z',
  },

  // Product 5 ratings
  {
    id: 18,
    productId: 5,
    userId: 118,
    rating: 5,
    review: 'Love it! Perfect for my needs.',
    createdAt: '2024-01-16T09:30:00Z',
  },
  {
    id: 19,
    productId: 5,
    userId: 119,
    rating: 4,
    review: 'Good product, fast delivery.',
    createdAt: '2024-02-01T11:20:00Z',
  },
  {
    id: 20,
    productId: 5,
    userId: 120,
    rating: 4,
    review: 'Satisfied with the purchase.',
    createdAt: '2024-02-09T14:00:00Z',
  },

  // Product 6 ratings
  {
    id: 21,
    productId: 6,
    userId: 121,
    rating: 4,
    review: 'Decent quality for the price.',
    createdAt: '2024-01-24T10:15:00Z',
  },
  {
    id: 22,
    productId: 6,
    userId: 122,
    rating: 4,
    review: 'Happy with my purchase.',
    createdAt: '2024-02-06T16:30:00Z',
  },

  // Product 7 ratings
  {
    id: 23,
    productId: 7,
    userId: 123,
    rating: 5,
    review: 'Fantastic product!',
    createdAt: '2024-01-12T08:45:00Z',
  },
  {
    id: 24,
    productId: 7,
    userId: 124,
    rating: 4,
    review: 'Very good, would recommend.',
    createdAt: '2024-01-30T12:00:00Z',
  },
  {
    id: 25,
    productId: 7,
    userId: 125,
    rating: 5,
    review: 'Excellent quality and design.',
    createdAt: '2024-02-07T15:30:00Z',
  },
  {
    id: 26,
    productId: 7,
    userId: 126,
    rating: 4,
    review: 'Good value overall.',
    createdAt: '2024-02-13T11:00:00Z',
  },

  // Product 8 ratings
  {
    id: 27,
    productId: 8,
    userId: 127,
    rating: 4,
    review: 'Nice product, works well.',
    createdAt: '2024-01-19T13:45:00Z',
  },
  {
    id: 28,
    productId: 8,
    userId: 128,
    rating: 5,
    review: 'Impressed with the quality.',
    createdAt: '2024-02-04T09:00:00Z',
  },
  {
    id: 29,
    productId: 8,
    userId: 129,
    rating: 4,
    review: 'Good but shipping was slow.',
    createdAt: '2024-02-10T17:20:00Z',
  },
];

export class RatingsRepository {
  findByProductId(productId: number): UserRating[] {
    return ratings.filter((r) => r.productId === productId);
  }

  findAll(): UserRating[] {
    return [...ratings];
  }
}

export const ratingsRepository = new RatingsRepository();
