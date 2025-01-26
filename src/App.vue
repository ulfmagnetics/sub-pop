<template>
  <div id="app">
    <header>
      <h1>Subscription Tracker</h1>
      <button v-if="!showForm" @click="handleAddSubscriptionClick">
        Add Subscription
      </button>
    </header>

    <main>
      <subscription-form
        v-if="showForm"
        :subscription="editingSubscription"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
      <subscription-list v-else @edit="handleEdit" />
    </main>
  </div>
</template>

<script>
import SubscriptionList from './components/SubscriptionList.vue';
import SubscriptionForm from './components/SubscriptionForm.vue';

export default {
  name: 'App',
  components: {
    SubscriptionList,
    SubscriptionForm,
  },
  data() {
    return {
      showForm: false,
      editingSubscription: null,
    };
  },
  methods: {
    handleAddSubscriptionClick() {
      this.showForm = true;
    },
    handleSubmit(updatedSubscription) {
      // pull subscriptions from local storage
      const stored = localStorage.getItem('subscriptions');
      let subscriptions = stored ? JSON.parse(stored) : [];

      // update the list to incorporate the changes
      if (this.editingSubscription) {
        subscriptions = subscriptions.map((sub) =>
          sub.id === updatedSubscription.id ? updatedSubscription : sub
        );
      } else {
        subscriptions.push(updatedSubscription);
      }

      // write back to storage
      localStorage.setItem('subscriptions', JSON.stringify(subscriptions));

      // reset display state
      this.showForm = false;
      this.editingSubscription = null;
    },
    handleEdit(subscription) {
      this.editingSubscription = subscription;
      this.showForm = true;
    },
    handleCancel() {
      this.editingSubscription = null;
      this.showForm = false;
    },
  },
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4caf50;
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>
