<template>
  <div>
    <form @submit.prevent="handleLogIn">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { signIn } from '@/services/cognito-service';

export default defineComponent({
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async handleLogIn() {
      try {
        const result = await signIn(this.username, this.password);
        console.log('Login successful:', result);
      } catch (error) {
        console.error('Login error:', error);
      }
    },
  },
});
</script>
