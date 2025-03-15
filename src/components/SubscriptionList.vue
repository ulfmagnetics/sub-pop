<template>
  <div class="subscription-list active">
    <h2>Active Subscriptions</h2>
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading subscriptions...</p>
    </div>
    <div v-else>
      <div v-if="activeSubscriptions.length === 0" class="empty-state">
        You don't have any active subscriptions.
      </div>
      <div v-else class="subscription-grid">
        <subscription-details
          v-for="sub in activeSubscriptions"
          :key="sub.subscriptionId"
          :subscription="sub"
          @edit="editSubscription"
          @delete="deleteSubscription"
        />
      </div>
    </div>
  </div>

  <div class="subscription-list inactive">
    <h2>Inactive Subscriptions</h2>
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading subscriptions...</p>
    </div>
    <div v-else>
      <div v-if="inactiveSubscriptions.length === 0" class="empty-state">
        You don't have any inactive subscriptions.
      </div>
      <div v-else>
        <subscription-details
          v-for="sub in inactiveSubscriptions"
          :key="sub.subscriptionId"
          :subscription="sub"
          @edit="editSubscription"
          @delete="deleteSubscription"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SubscriptionDetails from './SubscriptionDetails.vue';
import { CategoryMap } from '@/constants';
import { useSubscriptionStore } from '@/stores/SubscriptionStore';
import { displayToast } from '@/util/notifications';

export default {
  name: 'SubscriptionList',
  components: {
    SubscriptionDetails,
  },
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
    activeSubscriptions() {
      return this.subscriptions.filter((sub) => sub.isActive());
    },
    inactiveSubscriptions() {
      return this.subscriptions.filter((sub) => !sub.isActive());
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
    editSubscription(subscriptionId) {
      this.$emit('edit', subscriptionId);
    },
    deleteSubscription(subscriptionId) {
      if (confirm('Are you sure you want to delete this subscription?')) {
        this.subscriptionStore.removeSubscription(subscriptionId);
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

.subscription-list.inactive .subscription-card {
  border: #474747 1px solid;
  background: #dedede;
  color: #666;
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
</style>
