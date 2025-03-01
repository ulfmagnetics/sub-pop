<template>
  <div class="update-password-form">
    <form @submit.prevent="handleUpdatePassword">
      <h2>Update Password</h2>
      <input
        v-model="currentPassword"
        type="password"
        placeholder="Current Password"
        class="input-field"
      />
      <input
        v-model="newPassword"
        type="password"
        placeholder="New Password"
        class="input-field"
      />
      <div class="button-container">
        <button type="submit" class="submit-button">Update Password</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { getCurrentUser } from '@/services/cognito-service';
import { useRouter } from 'vue-router';
import { displayToast } from '@/util/notifications';

export default defineComponent({
  name: 'UpdatePassword',
  props: {
    challengedUser: {
      type: Object as PropType<CognitoUser>,
      required: false,
    },
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
    };
  },
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async handleUpdatePassword() {
      // If a challengedUser is provided, handle the new password challenge
      if (this.challengedUser) {
        this.challengedUser.completeNewPasswordChallenge(
          this.newPassword,
          {},
          {
            onSuccess: () => {
              displayToast('Password updated successfully');
              this.router.push({ name: 'Dashboard' });
            },
            onFailure: (err) => {
              displayToast('Sorry, there was an error updating your password.');
              console.error('Password update error:', err);
            },
          }
        );
        return;
      }

      // otherwise, check the cognito service for a logged-in user
      const currentUser = getCurrentUser();
      if (currentUser) {
        // Handle the regular update password flow
        // FIXME: this returns an error: "User is not authenticated"
        currentUser.changePassword(
          this.currentPassword,
          this.newPassword,
          (err, result) => {
            if (err) {
              console.log('Error updating password:', err);
            } else {
              console.log('Password updated successfully:', result);
            }
          }
        );
      } else {
        displayToast('Sorry, you must be logged in to update your password.');
      }
    },
  },
});
</script>

<style scoped>
.update-password-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.button-container {
  display: flex;
  justify-content: center;
}

.submit-button {
  width: 100%;
  max-width: 200px;
  min-width: 100px;
  padding: 0.75rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>
