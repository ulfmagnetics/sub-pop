// This is a Pinia store that manages the user's subscriptions.
// It is used to fetch, add, update, and remove subscriptions from the database.
// It is backed by an AWS DynamoDB table.

import { defineStore } from 'pinia';
import { Subscription } from '@/models/Subscription';
import api from '@/util/api';
import { UUID } from '@/models/types';
import { fetchSubscriptionsFromApi } from '@/services/subscription-service';
import { ensureSessionValid } from '@/services/session-service';

interface SubscriptionState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
}

export const useSubscriptionStore = defineStore('subscriptions', {
  state: (): SubscriptionState => ({
    subscriptions: [],
    loading: false,
    error: null,
    selectedCategory: null,
  }),

  getters: {
    sortedSubscriptions: (state) => {
      return (sortKey: keyof Subscription, ascending: boolean = true) => {
        return [...state.subscriptions].sort((a, b) => {
          let valueA = a[sortKey];
          let valueB = b[sortKey];

          // Handle date comparisons
          if (valueA instanceof Date || valueB instanceof Date) {
            valueA = new Date(valueA as Date).getTime();
            valueB = new Date(valueB as Date).getTime();
          }

          // Handle numeric comparisons
          if (typeof valueA === 'number' && typeof valueB === 'number') {
            return ascending ? valueA - valueB : valueB - valueA;
          }

          // Handle string comparisons
          if (typeof valueA === 'string' && typeof valueB === 'string') {
            return ascending
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          }

          return 0;
        });
      };
    },
    subscriptionsByCategory: (state) => {
      return (category: string) => {
        return state.subscriptions.filter(sub => sub.category === category);
      };
    },
  },

  actions: {
    async fetchSubscriptions() {
      this.loading = true;
      try {
        await ensureSessionValid();
        const subscriptions = await fetchSubscriptionsFromApi();
        this.subscriptions = subscriptions;
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
        await ensureSessionValid();
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
            response.data.notes || '',
            response.data.status || 'active'
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
        await ensureSessionValid();
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
        await ensureSessionValid();
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

    setCategoryFilter(category: string | null) {
      this.selectedCategory = category;
    },
  },
});
