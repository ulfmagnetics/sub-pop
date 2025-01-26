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
        <div class="card-actions">
          <button @click="editSubscription(sub)">Edit</button>
          <button @click="deleteSubscription(sub.id)" class="delete-btn">
            Delete
          </button>
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
    editSubscription(subscription) {
      this.$emit('edit', subscription);
    },
    deleteSubscription(id) {
      if (confirm('Are you sure you want to delete this subscription?')) {
        this.subscriptions = this.subscriptions.filter((sub) => sub.id !== id);
        localStorage.setItem(
          'subscriptions',
          JSON.stringify(this.subscriptions)
        );
      }
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
</style>
