<!-- This component provides the "Manage Subscriptions" view. It displays a
list of the user's subscriptions on a set of "cards" that each represent a
subscription. It also allows the user to add new subscriptions, edit existing
ones, and delete subscriptions. -->

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
      ref="subscriptionForm"
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
      this.editingSubscription = null;
    },
    async handleSubscriptionSubmit(formData) {
      try {
        const subscription = Subscription.buildFromFormData(formData);
        const store = useSubscriptionStore();
        if (subscription.subscriptionId) {
          await store.updateSubscription(subscription);
        } else {
          await store.addSubscription(subscription);
        }
        this.$refs.subscriptionForm.resetForm();
        displayToast('Subscription saved successfully!');
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
