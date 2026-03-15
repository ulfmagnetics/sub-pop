<template>
  <div class="login-form">
    <form @submit.prevent="handleSubmit">
      <h2>Reset Password</h2>
      <template v-if="!codeSent">
        <input v-model="username" placeholder="Username" class="input-field" />
        <div class="button-container">
          <button type="submit" class="submit-button">Send Code</button>
        </div>
      </template>
      <template v-else>
        <input v-model="code" placeholder="Verification Code" class="input-field" />
        <input
          v-model="newPassword"
          type="password"
          placeholder="New Password"
          class="input-field"
        />
        <div class="button-container">
          <button type="submit" class="submit-button">Reset Password</button>
        </div>
      </template>
      <div class="back-link-container">
        <a href="#" class="back-link" @click.prevent="$emit('back-to-login')">Back to login</a>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { forgotPassword, confirmForgotPassword } from '@/services/cognito-service';
import { displayToast } from '@/util/notifications';

export default defineComponent({
  name: 'ForgotPasswordForm',
  emits: ['password-reset', 'back-to-login'],
  data() {
    return {
      username: '',
      code: '',
      newPassword: '',
      codeSent: false,
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.codeSent) {
        try {
          await forgotPassword(this.username);
          this.codeSent = true;
          displayToast('Verification code sent. Check your email.');
        } catch (error) {
          displayToast('Sorry, there was an error sending the reset code.');
          console.error('Forgot password error:', error);
        }
      } else {
        try {
          await confirmForgotPassword(this.username, this.code, this.newPassword);
          displayToast('Password reset successfully. Please log in.');
          this.$emit('password-reset');
        } catch (error) {
          displayToast('Sorry, there was an error resetting your password.');
          console.error('Confirm forgot password error:', error);
        }
      }
    },
  },
});
</script>

<style scoped>
.login-form {
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

.back-link-container {
  margin-top: 1rem;
  text-align: center;
}

.back-link {
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}
</style>
