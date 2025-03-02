<template>
  <div class="subscription-form">
    <h2>{{ isEditing ? 'Edit Subscription' : 'Add New Subscription' }}</h2>
    <form @submit.prevent="handleSubmit">
      <input type="hidden" v-if="isEditing" v-model="form.id" />
      <div class="form-group">
        <label for="serviceName">Service Name</label>
        <input
          id="serviceName"
          v-model="form.serviceName"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="category">Category</label>
        <select id="category" v-model="form.category" required>
          <option value="">Select a category</option>
          <option
            v-for="(label, value) in categories"
            :key="value"
            :value="value"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="cost">Cost</label>
        <input
          id="cost"
          v-model.number="form.cost"
          type="number"
          step="0.01"
          required
        />
      </div>

      <div class="form-group">
        <label for="billingCycle">Billing Cycle</label>
        <select id="billingCycle" v-model="form.billingCycle" required>
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>
      </div>

      <div class="form-group">
        <label for="nextRenewal">Next Renewal Date</label>
        <input
          id="nextRenewal"
          v-model="form.nextRenewal"
          type="date"
          required
        />
      </div>

      <div class="form-group">
        <label for="valueRating">Value Rating</label>
        <input
          id="valueRating"
          v-model.number="form.valueRating"
          type="number"
          min="1"
          max="5"
          required
        />
      </div>

      <div class="form-group">
        <label for="notes">Notes</label>
        <textarea id="notes" v-model="form.notes" rows="3"></textarea>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')">Cancel</button>
        <button type="submit">
          {{ isEditing ? 'Update' : 'Add' }} Subscription
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { CategoryMap } from '@/constants';

const defaultValues = {
  serviceName: '',
  category: '',
  cost: '',
  billingCycle: 'monthly',
  nextRenewal: '',
  valueRating: 3,
  notes: '',
};

export default {
  name: 'SubscriptionForm',
  props: {
    subscription: {
      type: Object,
      default: null,
    },
  },
  data() {
    // default values for the form
    return {
      categories: CategoryMap,
      form: defaultValues,
    };
  },
  computed: {
    isEditing() {
      return !!this.subscription;
    },
  },
  methods: {
    handleSubmit() {
      const subscription = {
        ...this.form,
        id: this.isEditing ? this.subscription.id : null,
      };
      // NOTE: emitting an event named 'submit' causes an extra call to
      // handleSubmit() in App.vue with a SubmitEvent as a parameter.
      // The custom event name prevents this.
      this.$emit('subscription-submit', subscription);
      this.resetForm();
    },
    resetForm() {
      this.form = defaultValues;
    },
  },
  watch: {
    subscription: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal };
          // extract the date part of the date/time string
          this.form.nextRenewal = new Date(newVal.nextRenewal)
            .toISOString()
            .split('T')[0];
        } else {
          this.resetForm();
        }
      },
    },
  },
};
</script>

<style scoped>
.subscription-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type='submit'] {
  background: #4caf50;
  color: white;
}

button[type='button'] {
  background: #ccc;
}
</style>
