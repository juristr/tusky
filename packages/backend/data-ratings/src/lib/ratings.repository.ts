import { UserRating, ProductRating } from '@tusky/api-types';

const ratings: UserRating[] = [
  // Product 1: Wireless Noise-Cancelling Headphones
  {
    id: 1,
    productId: 1,
    userId: 101,
    rating: 5,
    review: 'Amazing sound quality and comfort!',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    productId: 1,
    userId: 102,
    rating: 5,
    review: 'Best headphones I have ever owned.',
    createdAt: '2024-01-20T14:22:00Z',
  },
  {
    id: 3,
    productId: 1,
    userId: 103,
    rating: 4,
    review: 'Great noise cancellation, battery could be better.',
    createdAt: '2024-02-01T09:15:00Z',
  },
  {
    id: 4,
    productId: 1,
    userId: 104,
    rating: 5,
    review: 'Perfect for working from home.',
    createdAt: '2024-02-10T16:45:00Z',
  },

  // Product 2: Ultra HD Smart TV
  {
    id: 5,
    productId: 2,
    userId: 105,
    rating: 4,
    review: 'Picture quality is stunning.',
    createdAt: '2024-01-18T11:00:00Z',
  },
  {
    id: 6,
    productId: 2,
    userId: 106,
    rating: 4,
    review: 'Smart features work well, easy setup.',
    createdAt: '2024-01-25T08:30:00Z',
  },
  {
    id: 7,
    productId: 2,
    userId: 107,
    rating: 3,
    review: 'Good TV but remote is confusing.',
    createdAt: '2024-02-05T19:20:00Z',
  },

  // Product 3: Leather Crossbody Bag
  {
    id: 8,
    productId: 3,
    userId: 108,
    rating: 5,
    review: 'Beautiful craftsmanship!',
    createdAt: '2024-01-22T13:10:00Z',
  },
  {
    id: 9,
    productId: 3,
    userId: 109,
    rating: 4,
    review: 'Nice bag, perfect size for daily use.',
    createdAt: '2024-02-08T10:00:00Z',
  },
  {
    id: 10,
    productId: 3,
    userId: 110,
    rating: 4,
    review: 'Good quality leather, sturdy strap.',
    createdAt: '2024-02-15T15:30:00Z',
  },

  // Product 4: Men's Running Shoes
  {
    id: 11,
    productId: 4,
    userId: 111,
    rating: 5,
    review: 'Most comfortable running shoes ever!',
    createdAt: '2024-01-28T07:45:00Z',
  },
  {
    id: 12,
    productId: 4,
    userId: 112,
    rating: 5,
    review: 'Great support and cushioning.',
    createdAt: '2024-02-03T12:00:00Z',
  },
  {
    id: 13,
    productId: 4,
    userId: 113,
    rating: 4,
    review: 'Run well, took a few days to break in.',
    createdAt: '2024-02-12T18:15:00Z',
  },
  {
    id: 14,
    productId: 4,
    userId: 114,
    rating: 5,
    review: 'Perfect for long distance running.',
    createdAt: '2024-02-18T06:30:00Z',
  },

  // Product 5: Stainless Steel Water Bottle
  {
    id: 15,
    productId: 5,
    userId: 115,
    rating: 4,
    review: 'Keeps water cold all day.',
    createdAt: '2024-01-30T09:00:00Z',
  },
  {
    id: 16,
    productId: 5,
    userId: 116,
    rating: 5,
    review: 'Love the design and durability.',
    createdAt: '2024-02-06T14:30:00Z',
  },
  {
    id: 17,
    productId: 5,
    userId: 117,
    rating: 4,
    review: 'Good bottle, lid could be easier to open.',
    createdAt: '2024-02-14T11:45:00Z',
  },

  // Product 6: Scented Soy Candle Set
  {
    id: 18,
    productId: 6,
    userId: 118,
    rating: 4,
    review: 'Lovely scents, burns evenly.',
    createdAt: '2024-02-01T16:00:00Z',
  },
  {
    id: 19,
    productId: 6,
    userId: 119,
    rating: 5,
    review: 'Perfect gift set!',
    createdAt: '2024-02-09T20:30:00Z',
  },
  {
    id: 20,
    productId: 6,
    userId: 120,
    rating: 3,
    review: 'Nice candles but scent fades quickly.',
    createdAt: '2024-02-17T13:15:00Z',
  },

  // Product 7: Fitness Smartwatch
  {
    id: 21,
    productId: 7,
    userId: 121,
    rating: 5,
    review: 'Tracks everything accurately!',
    createdAt: '2024-01-26T08:00:00Z',
  },
  {
    id: 22,
    productId: 7,
    userId: 122,
    rating: 5,
    review: 'Battery lasts a week, love it.',
    createdAt: '2024-02-04T10:45:00Z',
  },
  {
    id: 23,
    productId: 7,
    userId: 123,
    rating: 4,
    review: 'Great features, app could be better.',
    createdAt: '2024-02-11T17:00:00Z',
  },
  {
    id: 24,
    productId: 7,
    userId: 124,
    rating: 5,
    review: 'Best fitness tracker I have used.',
    createdAt: '2024-02-19T07:30:00Z',
  },

  // Product 8: Organic Face Moisturizer
  {
    id: 25,
    productId: 8,
    userId: 125,
    rating: 4,
    review: 'Skin feels so smooth!',
    createdAt: '2024-02-02T09:30:00Z',
  },
  {
    id: 26,
    productId: 8,
    userId: 126,
    rating: 5,
    review: 'No irritation, works great.',
    createdAt: '2024-02-10T14:00:00Z',
  },
  {
    id: 27,
    productId: 8,
    userId: 127,
    rating: 4,
    review: 'Good moisturizer, light scent.',
    createdAt: '2024-02-16T11:30:00Z',
  },
];

export class RatingsRepository {
  findByProductId(productId: number): UserRating[] {
    return ratings.filter((r) => r.productId === productId);
  }

  getAggregated(productId: number): ProductRating | undefined {
    const productRatings = this.findByProductId(productId);
    if (productRatings.length === 0) {
      return undefined;
    }
    const sum = productRatings.reduce((acc, r) => acc + r.rating, 0);
    return {
      productId,
      averageRating: Math.round((sum / productRatings.length) * 10) / 10,
      totalRatings: productRatings.length,
    };
  }
}

export const ratingsRepository = new RatingsRepository();
