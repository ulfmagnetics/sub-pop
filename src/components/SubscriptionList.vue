<template>
  <div class="subscription-list">
    <h2>Your Subscriptions</h2>
    <div v-if="subscriptions.length === 0" class="empty-state">
      You haven't added any subscriptions yet.
    </div>
    <div v-else class="subscription-grid">
      <div v-for="sub in subscriptions" :key="sub.id" class="subscription-card">
        <h3>{{ sub.serviceName }}</h3>
        <div class="subscription-details">
          <p>Category: {{ sub.category }}</p>
          <p>Cost: {{ sub.cost }} {{ sub.billingCycle }}</p>
          <p>Next Renewal: {{ formatDate(sub.nextRenewal) }}</p>
          <p>Value Rating: {{ sub.valueRating }}/5</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubscriptionList',
  data() {
    return {
      subscriptions: [],
    };
  },
  methods: {
    loadSubscriptions() {
      const stored = localStorage.getItem('subscriptions');
      // TODO: catch JSON parsing errors here
      this.subscriptions = stored ? JSON.parse(stored) : [];
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  mounted() {
    this.loadSubscriptions();
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

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
