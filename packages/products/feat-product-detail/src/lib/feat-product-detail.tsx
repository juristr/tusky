import styles from './feat-product-detail.module.css';
import { dataAccessProducts } from '@tusky/data-access-products';
import { UiProductDetail } from '@tusky/ui-product-detail';

export function FeatProductDetail() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatProductDetail!</h1>
      <p>Data access value: {dataAccessProducts()}</p>
      <UiProductDetail />
    </div>
  );
}

export default FeatProductDetail;
