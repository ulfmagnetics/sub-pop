import { createRouter, createWebHashHistory } from 'vue-router';
import DashboardView from '../components/DashboardView.vue';
import SubscriptionManager from '../components/SubscriptionManager.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: SubscriptionManager,
  },
];

const router = createRouter({
  // Using hash mode for GitHub Pages compatibility
  history: createWebHashHistory(),
  routes,
});

export default router;
