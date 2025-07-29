import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true, hideForAdmin: true }
  },
  {
    path: '/profile/:id',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue'),
    meta: { requiresAuth: true, hideForAdmin: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true, requiresRole: 'admin' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // If profile is still loading, wait for it
  if (authStore.isProfileLoading) {
    // Wait for profile to load
    await new Promise(resolve => {
      const unwatch = authStore.$subscribe(() => {
        if (!authStore.isProfileLoading) {
          unwatch()
          resolve()
        }
      })
    })
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Редирект по роли
    if (authStore.userRole === 'admin') {
      next('/admin')
    } else {
      next('/profile')
    }
    return
  }
  
  // Check if route requires specific role
  if (to.meta.requiresRole && authStore.userRole !== to.meta.requiresRole) {
    // Редирект на соответствующую страницу
    if (authStore.userRole === 'admin') {
      next('/admin')
    } else {
      next('/profile')
    }
    return
  }

  // Check if route should be hidden for admin
  if (to.meta.hideForAdmin && authStore.userRole === 'admin') {
    next('/admin')
    return
  }

  // Check if employee needs to see welcome page
  if (
    authStore.userRole === 'employee' &&
    !authStore.hasSeenWelcome &&
    to.path === '/profile'
  ) {
    next('/welcome')
    return
  }
  
  next()
})

export default router 