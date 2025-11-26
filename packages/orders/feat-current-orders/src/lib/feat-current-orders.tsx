import styles from './feat-current-orders.module.css';
import { dataAccessOrder } from '@tusky/data-access-order';
import { UiOrderDetail } from '@tusky/ui-order-detail';

export function FeatCurrentOrders() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeatCurrentOrders!</h1>
      <p>Data access value: {dataAccessOrder()}</p>
      <UiOrderDetail />
    </div>
  );
}

export default FeatCurrentOrders;
