<template>
  <div id="subscription-manager">
    <header>
      <h2>Manage Subscriptions</h2>
      <button v-if="!showForm" @click="handleAddSubscriptionClick">
        Add Subscription
      </button>
    </header>

    <subscription-form
      v-if="showForm"
      :subscription="editingSubscription"
      @subscription-submit="handleSubscriptionSubmit"
      @cancel="handleCancel"
    />
    <subscription-list v-else @edit="handleEdit" />
  </div>
</template>

<script>
import SubscriptionList from './SubscriptionList.vue';
import SubscriptionForm from './SubscriptionForm.vue';

export default {
  name: 'SubscriptionManager',
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
    handleSubscriptionSubmit(updatedSubscription) {
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

<style scoped>
.subscription-manager {
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
