import { defineStore } from 'pinia';
import { Subscription } from '@/models/Subscription';

export const useSubscriptionStore = defineStore('subscriptions', {
  state: () => {
    const stored = localStorage.getItem('subscriptions');
    // TODO: catch JSON parsing errors here
    const subs = stored ? JSON.parse(stored) : [];
    return {
      subscriptions: subs as Subscription[],
    };
  },

  actions: {
    addSubscription(sub: Subscription) {
      if (!sub.isValid()) throw new Error('Invalid subscription');
      this.subscriptions.push(sub);
      this._persistToStorage();
    },

    updateSubscription(updated: Subscription) {
      if (!updated.isValid()) throw new Error('Invalid subscription');
      const existing = this.subscriptions.find((s) => s.id === updated.id);
      if (!existing) {
        throw new Error(`no subscription found with id ${updated.id}`);
      }
      this.subscriptions.map((s) => (s.id === updated.id ? updated : s));
      this._persistToStorage();
    },

    removeSubscription(id: number) {
      this.subscriptions = this.subscriptions.filter((s) => s.id !== id);
      this._persistToStorage();
    },

    _persistToStorage() {
      localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    },
  },

  getters: {},
});
