import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Lazy-loaded views
const LoginView = () => import('@/views/auth/LoginView.vue');
const RegisterView = () => import('@/views/auth/RegisterView.vue');
const ForgotPasswordView = () => import('@/views/auth/ForgotPasswordView.vue');
const ResetPasswordView = () => import('@/views/auth/ResetPasswordView.vue');
const DashboardView = () => import('@/views/dashboard/DashboardView.vue');
const ProfileView = () => import('@/views/profile/ProfileView.vue');
const SettingsView = () => import('@/views/profile/SettingsView.vue');
const WaterTrackerView = () => import('@/views/water/WaterTrackerView.vue');
const WaterSettingsView = () => import('@/views/water/WaterSettingsView.vue');
const PositiveThoughtsView = () => import('@/views/positive-thoughts/PositiveThoughtsView.vue');
const DailyPlannerView = () => import('@/views/planner/DailyPlannerView.vue');
const PlannerHistoryView = () => import('@/views/planner/PlannerHistoryView.vue');
const ExpenseView = () => import('@/views/finance/ExpenseView.vue');
const BudgetView = () => import('@/views/finance/BudgetView.vue');
const FinanceSummaryView = () => import('@/views/finance/FinanceSummaryView.vue');
const FriendsView = () => import('@/views/social/FriendsView.vue');
const FriendRequestsView = () => import('@/views/social/FriendRequestsView.vue');
const ChatView = () => import('@/views/chat/ChatView.vue');
const ConversationView = () => import('@/views/chat/ConversationView.vue');
import VerifyEmailView from '@/views/auth/VerifyEmailView.vue'; // Import de la nouvelle vue


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: { requiresGuest: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterView,
        meta: { requiresGuest: true }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordView,
        meta: { requiresGuest: true }
      },
      {
        path: 'reset-password/:token',
        name: 'ResetPassword',
        component: ResetPasswordView,
        meta: { requiresGuest: true }
      },
      {
        path: 'verify-email/:token',
        name: 'VerifyEmail',
        component: VerifyEmailView, // Utiliser la nouvelle vue au lieu de rediriger
        meta: { requiresGuest: true }
      },
    ]
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/water',
    name: 'WaterTracker',
    component: WaterTrackerView,
    meta: { requiresAuth: true }
  },
  {
    path: '/water/settings',
    name: 'WaterSettings',
    component: WaterSettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/positive-thoughts',
    name: 'PositiveThoughts',
    component: PositiveThoughtsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/planner',
    children: [
      {
        path: 'today',
        name: 'DailyPlanner',
        component: DailyPlannerView,
        meta: { requiresAuth: true }
      },
      {
        path: 'history',
        name: 'PlannerHistory',
        component: PlannerHistoryView,
        meta: { requiresAuth: true }
      },
    ]
  },
  {
    path: '/finance',
    children: [
      {
        path: 'expense',
        name: 'Expense',
        component: ExpenseView,
        meta: { requiresAuth: true }
      },
      {
        path: 'budget',
        name: 'Budget',
        component: BudgetView,
        meta: { requiresAuth: true }
      },
      {
        path: 'summary',
        name: 'FinanceSummary',
        component: FinanceSummaryView,
        meta: { requiresAuth: true }
      },
    ]
  },
  {
    path: '/friends',
    name: 'Friends',
    component: FriendsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/friend-requests',
    name: 'FriendRequests',
    component: FriendRequestsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat/:userId',
    name: 'Conversation',
    component: ConversationView,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);

  // If token exists, validate it
  if (authStore.token) {
    try {
      const isValid = await authStore.validateToken();

      if (!isValid) {
        // Token is invalid, remove it and redirect to login
        authStore.setToken(null);
        authStore.setUser(null);
        authStore.setLoggedIn(false);

        if (requiresAuth) {
          return next({
            path: '/auth/login',
            query: { redirect: to.fullPath }
          });
        }
      }
    } catch (error) {
      console.error('Token validation error:', error);
    }
  }

  if (requiresAuth && !authStore.isLoggedIn) {
    // Redirect to login if not authenticated
    return next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    });
  } else if (requiresGuest && authStore.isLoggedIn) {
    // Redirect to dashboard if already authenticated
    return next({ path: '/dashboard' });
  } else {
    return next();
  }
});

export default router;
