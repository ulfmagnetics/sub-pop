<template>
  <div id="app">
    <header>
      <h1>Subscription Tracker</h1>
    </header>

    <main>
      <subscription-list />
    </main>
  </div>
</template>

<script>
import SubscriptionList from './components/SubscriptionList.vue';

export default {
  name: 'App',
  components: {
    SubscriptionList,
  },
  data() {
    return {
      // TODO,
    };
  },
  methods: {
    // TODO
  },
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
