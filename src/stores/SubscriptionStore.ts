import { defineStore } from 'pinia';
import { Subscription } from '@/models/Subscription';
import api from '@/util/api';
import { UUID } from '@/models/types';

interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

export const useSubscriptionStore = defineStore('subscriptions', {
  state: (): SubscriptionState => ({
    subscriptions: [],
    loading: false,
    error: null,
  }),

  getters: {
    // TODO: refactor functions from DashboardView.vue into getters
    // totalMonthlyCost
    // totalAnnualCost
    // averageValueRating
  },

  actions: {
    async fetchSubscriptions() {
      this.loading = true;
      try {
        const response = await api.get('/subscriptions', {
          params: {
            sortBy: 'serviceName',
            sortOrder: 'asc',
          },
        });
        this.subscriptions = response.data.map(
          (sub: any) =>
            new Subscription(
              sub.subscriptionId,
              sub.serviceName,
              sub.category,
              sub.cost,
              sub.billingCycle,
              new Date(sub.nextRenewal),
              sub.valueRating,
              sub.notes || ''
            )
        );
      } catch (error) {
        this.error = 'Failed to fetch subscriptions: ' + error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addSubscription(subscription: Omit<Subscription, 'subscriptionId'>) {
      this.loading = true;
      try {
        const response = await api.post('/subscriptions', subscription);
        this.subscriptions.push(
          new Subscription(
            response.data.subscriptionId,
            response.data.serviceName,
            response.data.category,
            response.data.cost,
            response.data.billingCycle,
            new Date(response.data.nextRenewal),
            response.data.valueRating,
            response.data.notes || ''
          )
        );
      } catch (error) {
        this.error = 'Failed to add subscription: ' + error;
      } finally {
        this.loading = false;
      }
    },

    async updateSubscription(subscription: Subscription) {
      this.loading = true;
      try {
        const { subscriptionId, ...subscriptionData } = subscription;
        await api.put(`/subscriptions/${subscriptionId}`, subscriptionData);
        const index = this.subscriptions.findIndex(
          (sub) => sub.subscriptionId === subscriptionId
        );
        if (index !== -1) {
          this.subscriptions[index] = subscription;
        }
      } catch (error) {
        this.error = 'Failed to update subscription: ' + error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeSubscription(subscriptionId: UUID) {
      this.loading = true;
      try {
        await api.delete(`/subscriptions/${subscriptionId}`);
        this.subscriptions = this.subscriptions.filter(
          (sub) => sub.subscriptionId !== subscriptionId
        );
      } catch (error) {
        this.error = 'Failed to remove subscription: ' + error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    getSubscriptionById(subscriptionId: UUID) {
      return this.subscriptions.find(
        (s) => s.subscriptionId === subscriptionId
      );
    },

    // Local Storage Methods
    // these are retained for reference and should be removed once the API is fully functional
    addSubscriptionLocalStorage(sub: Subscription) {
      if (!sub.isValid()) throw new Error('Invalid subscription');
      this.subscriptions.push(sub);
      this._persistToStorage();
    },

    updateSubscriptionLocalStorage(updated: Subscription) {
      if (!updated.isValid()) throw new Error('Invalid subscription');
      const existing = this.getSubscriptionById(updated.subscriptionId);
      if (!existing) {
        throw new Error(
          `no subscription found with id ${updated.subscriptionId}`
        );
      }
      Object.assign(existing, updated);
      this._persistToStorage();
    },

    removeSubscriptionLocalStorage(subscriptionId: UUID) {
      this.subscriptions = this.subscriptions.filter(
        (s) => s.subscriptionId !== subscriptionId
      );
      this._persistToStorage();
    },

    _persistToStorage() {
      localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    },
  },
});
