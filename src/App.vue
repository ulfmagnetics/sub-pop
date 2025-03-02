<template>
  <div id="app">
    <nav class="main-nav">
      <router-link to="/dashboard" class="nav-link"> Dashboard </router-link>
      <router-link to="/subscriptions" class="nav-link">
        Manage Subscriptions
      </router-link>
      <button
        v-if="currentUser"
        class="secondary logout-button"
        @click="logOut"
      >
        Log Out
      </button>
    </nav>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getCurrentUser } from './services/cognito-service';
import { signOut } from './services/cognito-service';

export default defineComponent({
  name: 'App',
  setup() {
    const currentUser = getCurrentUser();
    const logOut = () => {
      signOut();
      window.location.reload();
    };
    return { currentUser, logOut };
  },
});
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4caf50;
  color: white;
}

button.secondary {
  background: #d4d0d0;
  color: #000000;
}

button:hover {
  opacity: 0.9;
}

.logout-button {
  margin-left: auto;
}

.main-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.nav-link:hover {
  opacity: 0.9;
}

.router-link-active {
  background-color: #2c3e50;
  color: white;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

main {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}
</style>
