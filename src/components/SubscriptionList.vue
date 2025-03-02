<template>
  <div class="subscription-list">
    <h2>Your Subscriptions</h2>
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading subscriptions...</p>
    </div>
    <div v-else>
      <div v-if="subscriptions.length === 0" class="empty-state">
        You haven't added any subscriptions yet.
      </div>
      <div v-else class="subscription-grid">
        <div
          v-for="sub in subscriptions"
          :key="sub.id"
          class="subscription-card"
        >
          <h3>{{ sub.serviceName }}</h3>
          <div class="subscription-details">
            <p>Category: {{ categories[sub.category] }}</p>
            <p>Cost: ${{ sub.cost.toFixed(2) }} {{ sub.billingCycle }}</p>
            <p>Next Renewal: {{ formatDate(sub.nextRenewal) }}</p>
            <p>Value Rating: {{ sub.valueRating }}/5</p>
          </div>
          <div class="card-actions">
            <button @click="editSubscription(sub.id)">Edit</button>
            <button @click="deleteSubscription(sub.id)" class="delete-btn">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CategoryMap } from '@/constants';
import { useSubscriptionStore } from '@/stores/SubscriptionStore';
import { displayToast } from '@/util/notifications';

export default {
  name: 'SubscriptionList',
  data() {
    return {
      categories: CategoryMap,
    };
  },
  computed: {
    subscriptionStore() {
      return useSubscriptionStore();
    },
    subscriptions() {
      return this.subscriptionStore.subscriptions;
    },
    loading() {
      return this.subscriptionStore.loading;
    },
  },
  methods: {
    async fetchSubscriptions() {
      try {
        await this.subscriptionStore.fetchSubscriptions();
      } catch (error) {
        displayToast('Failed to fetch subscriptions. Please try again later.');
      }
    },
    editSubscription(id) {
      this.$emit('edit', id);
    },
    deleteSubscription(id) {
      if (confirm('Are you sure you want to delete this subscription?')) {
        this.subscriptionStore.removeSubscription(id);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' });
    },
  },
  mounted() {
    this.fetchSubscriptions();
  },
};
</script>

<style scoped>
.subscription-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.subscription-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.delete-btn {
  background: #ff4444;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
