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
import { Subscription } from '@/models/Subscription';
import { useSubscriptionStore } from '@/stores/SubscriptionStore';

export default {
  name: 'SubscriptionManager',
  components: {
    SubscriptionList,
    SubscriptionForm,
  },
  data() {
    return {
      showForm: false,
      editingId: null,
    };
  },
  methods: {
    handleAddSubscriptionClick() {
      this.showForm = true;
    },
    handleSubscriptionSubmit(formData) {
      try {
        const subscription = Subscription.buildFromFormData(formData);
        const store = useSubscriptionStore();
        if (subscription.id) {
          store.updateSubscription(subscription);
        } else {
          subscription.id = Date.now();
          store.addSubscription(subscription);
        }
      } catch (error) {
        // TODO: render validation errors in the UI
        console.error(error);
      }

      // reset display state
      this.showForm = false;
      this.editingId = null;
    },
    handleEdit(id) {
      const store = useSubscriptionStore();
      this.editingSubscription = store.getSubscriptionById(id);
      this.showForm = true;
    },
    handleCancel() {
      this.editingId = null;
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
