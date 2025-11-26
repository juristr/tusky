import styles from './feat-product-detail.module.css';
import { getProducts } from '@tusky/data-access-products';
import { UiProductDetail } from '@tusky/ui-product-detail';

export function FeatProductDetail() {
  const products = getProducts();
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatProductDetail!</h1>
      <p>Data access value: {products.length} products</p>
      <UiProductDetail />
    </div>
  );
}

export default FeatProductDetail;
