<template>
  <div id="app">
    <nav class="main-nav">
      <router-link to="/dashboard" class="nav-link"> Dashboard </router-link>
      <router-link to="/subscriptions" class="nav-link">
        Manage Subscriptions
      </router-link>
    </nav>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
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
  background-color: #e9ecef;
}

.router-link-active {
  background-color: #2c3e50;
  color: white;
}

main {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}
</style>
