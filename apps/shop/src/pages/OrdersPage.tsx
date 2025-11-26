import { FeatCurrentOrders } from '@tusky/feat-current-orders';
import { FeatCancelOrder } from '@tusky/feat-cancel-order';

export function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <FeatCurrentOrders />
        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">Cancel an Order</h2>
          <FeatCancelOrder />
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
