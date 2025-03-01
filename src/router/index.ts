import { createRouter, createWebHashHistory } from 'vue-router';
import { getCurrentUser } from '@/services/cognito-service';
import LoginForm from '@/components/LoginForm.vue';
import DashboardView from '../components/DashboardView.vue';
import SubscriptionManager from '../components/SubscriptionManager.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: SubscriptionManager,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  // Using hash mode for GitHub Pages compatibility
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const user = getCurrentUser();

  if (requiresAuth && !user) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
