export interface Rating {
  id: number;
  productId: number;
  value: number;
  comment: string;
}

const sampleComments = [
  'Great product, exactly what I needed!',
  'Good quality for the price.',
  'Exceeded my expectations.',
  'Decent but could be better.',
  'Love it! Would buy again.',
  'Not bad, works as expected.',
  'Amazing quality and fast shipping.',
  'Okay product, nothing special.',
  'Perfect for my needs.',
  'Highly recommend this!',
  'Could be improved but overall satisfied.',
  'Fantastic! Five stars all the way.',
  'Average product, does the job.',
  'Very happy with this purchase.',
  'Would not recommend unfortunately.',
];

// Generate random ratings for products 1-8
function generateMockRatings(): Rating[] {
  const ratings: Rating[] = [];
  let id = 1;

  for (let productId = 1; productId <= 8; productId++) {
    // 5-15 ratings per product
    const numRatings = Math.floor(Math.random() * 11) + 5;
    for (let i = 0; i < numRatings; i++) {
      ratings.push({
        id: id++,
        productId,
        value: Math.floor(Math.random() * 5) + 1, // 1-5
        comment:
          sampleComments[Math.floor(Math.random() * sampleComments.length)],
      });
    }
  }

  return ratings;
}

const ratings: Rating[] = generateMockRatings();

export class RatingsRepository {
  findByProductId(productId: number): Rating[] {
    return ratings.filter((r) => r.productId === productId);
  }

  findAll(): Rating[] {
    return ratings;
  }
}

export const ratingsRepository = new RatingsRepository();
