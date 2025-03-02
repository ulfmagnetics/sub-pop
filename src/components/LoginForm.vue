<template>
  <div class="login-form">
    <form @submit.prevent="handleLogIn">
      <h2>Log In</h2>
      <input v-model="username" placeholder="Username" class="input-field" />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="input-field"
      />
      <div class="button-container">
        <button type="submit" class="submit-button">Log In</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser, signIn } from '@/services/cognito-service';
import { displayToast } from '@/util/notifications';

export default defineComponent({
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  setup() {
    const router = useRouter();
    const currentUser = getCurrentUser();

    if (currentUser) {
      router.push({ name: 'Dashboard' });
    }

    return { router };
  },
  methods: {
    async handleLogIn() {
      try {
        const result = await signIn(this.username, this.password);
        if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
          displayToast('New password required');
          this.$emit('new-password-required', result.cognitoUser);
        } else {
          window.location.reload();
        }
      } catch (error) {
        displayToast('Sorry, there was an error while logging in.');
        console.error('Login error:', error);
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
</style>
