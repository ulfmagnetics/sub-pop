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

    getSubscriptionById(id: number) {
      return this.subscriptions.find((s) => s.id === id);
    },

    updateSubscription(updated: Subscription) {
      console.log('in updateSubscription');
      if (!updated.isValid()) throw new Error('Invalid subscription');
      const existing = this.getSubscriptionById(updated.id);
      console.log('updating subscription', existing, updated);
      if (!existing) {
        throw new Error(`no subscription found with id ${updated.id}`);
      }
      Object.assign(existing, updated);
      this._persistToStorage();
    },

    removeSubscription(id: number) {
      this.subscriptions = this.subscriptions.filter((s) => s.id !== id);
      this._persistToStorage();
    },

    _persistToStorage() {
      console.log('updating local storage', this.subscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(this.subscriptions));
    },
  },

  getters: {},
});
