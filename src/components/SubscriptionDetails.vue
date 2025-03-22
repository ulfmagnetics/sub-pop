<!-- This component displays the details of a subscription on a card. -->

<template>
  <div class="subscription-card">
    <h3>{{ subscription.serviceName }}</h3>
    <div class="subscription-details">
      <p>Category: {{ categories[subscription.category] }}</p>
      <p>
        Cost: ${{ subscription.cost.toFixed(2) }}
        {{ subscription.billingCycle }}
      </p>
      <p>Next Renewal: {{ formatDate(subscription.nextRenewal) }}</p>
      <p>Value Rating: {{ subscription.valueRating }}/5</p>
    </div>
    <div class="card-actions">
      <button @click="$emit('edit', subscription.subscriptionId)">Edit</button>
      <button
        @click="$emit('delete', subscription.subscriptionId)"
        class="delete-btn"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { CategoryMap } from '@/constants';

export default {
  name: 'SubscriptionDetails',
  props: {
    subscription: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      categories: CategoryMap,
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' });
    },
  },
};
</script>

<style scoped>
.subscription-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
}

.subscription-details {
  margin-bottom: 1rem;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.delete-btn {
  background: #ff4444;
  color: white;
}
</style>
