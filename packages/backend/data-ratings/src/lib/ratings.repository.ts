export interface Rating {
  id: number;
  productId: number;
  value: number;
}

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
