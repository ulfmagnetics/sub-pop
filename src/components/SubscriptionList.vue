<!-- This component displays a list of the user's active subscriptions. -->

<template>
  <div class="subscription-list active">
    <div class="list-header">
      <h2>Active Subscriptions</h2>
      <div class="sort-control">
        <label for="sortBy">Sort by:</label>
        <div class="sort-wrapper">
          <select id="sortBy" v-model="sortBy">
            <option value="nextRenewal">Next Renewal Date</option>
            <option value="cost">Cost</option>
            <option value="serviceName">Name</option>
          </select>
          <button
            class="sort-direction-button"
            @click="sortAscending = !sortAscending"
            :title="sortAscending ? 'Sort Ascending' : 'Sort Descending'"
          >
            <span class="arrow" :class="{ ascending: sortAscending }"> ↓ </span>
          </button>
        </div>
      </div>
    </div>
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

const SORT_SETTINGS_KEY = 'subscription-sort-settings';
const DEFAULT_SORT_SETTINGS = {
  sortBy: 'nextRenewal',
  sortAscending: true,
};

export default {
  name: 'SubscriptionList',
  components: {
    SubscriptionDetails,
  },
  data() {
    // Load saved settings or use defaults
    const savedSettings = localStorage.getItem(SORT_SETTINGS_KEY);
    const settings = savedSettings
      ? JSON.parse(savedSettings)
      : DEFAULT_SORT_SETTINGS;

    return {
      categories: CategoryMap,
      sortBy: settings.sortBy,
      sortAscending: settings.sortAscending,
    };
  },
  computed: {
    subscriptionStore() {
      return useSubscriptionStore();
    },
    subscriptions() {
      return this.subscriptionStore.sortedSubscriptions(
        this.sortBy,
        this.sortAscending
      );
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
  watch: {
    // Watch both sort settings and save changes to localStorage
    sortBy() {
      this.saveSortSettings();
    },
    sortAscending() {
      this.saveSortSettings();
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
    saveSortSettings() {
      const settings = {
        sortBy: this.sortBy,
        sortAscending: this.sortAscending,
      };
      localStorage.setItem(SORT_SETTINGS_KEY, JSON.stringify(settings));
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

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sort-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-control select {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.sort-control label {
  font-size: 0.9rem;
  color: #000;
  font-weight: bolder;
}

.sort-wrapper {
  display: flex;
  align-items: center;
}

.sort-direction-button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.25rem;
  color: #000;
  font-weight: bolder;
}

.sort-direction-button:hover {
  background-color: #cfcfcf;
  color: #fff;
}

.arrow {
  display: inline-block;
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.arrow.ascending {
  transform: rotate(180deg);
}
</style>
