import { Subscription } from '@/models/Subscription';
import api from '@/util/api';

export async function fetchSubscriptionsFromApi() {
  const response = await api.get('/subscriptions');
  return response.data.map((sub: Subscription) => {
    return new Subscription(
      sub.subscriptionId,
      sub.serviceName,
      sub.category,
      sub.cost,
      sub.billingCycle,
      sub.nextRenewal,
      sub.valueRating,
      sub.notes || '',
      sub.status || 'active'
    );
  });
}
