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
import { displayToast } from '@/util/notifications';

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
    handleSubscriptionSubmit(formData) {
      try {
        const subscription = Subscription.buildFromFormData(formData);
        const store = useSubscriptionStore();
        if (subscription.subscriptionId) {
          store.updateSubscription(subscription);
        } else {
          store.addSubscription(subscription);
        }
      } catch (error) {
        displayToast(
          'Sorry, there was an error while saving the subscription.'
        );
        console.error(error);
      }

      // reset display state
      this.showForm = false;
      this.editingSubscription = null;
    },
    handleEdit(id) {
      const store = useSubscriptionStore();
      this.editingSubscription = store.getSubscriptionById(id);
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
