<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex flex-col sm:flex-row flex-1">
          <div class="flex-shrink-0 flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">Онбординг сотрудников</h1>
          </div>
          <!-- Email и роль под заголовком на мобильных -->
          <div class="block sm:hidden mt-1 ml-1 max-w-full pb-1">
            <span class="text-xs text-[#1a3353] opacity-80 break-all truncate block max-w-[90vw] px-1" style="word-break:break-all;">
              {{ user?.email }} <span v-if="userRole">({{ getRoleDisplayName(userRole) }})</span>
            </span>
          </div>
          <div class="hidden sm:flex sm:items-center sm:ml-6">
            <span class="text-sm text-[#1a3353] opacity-80 mr-4 truncate max-w-xs" style="word-break:break-all;">
              {{ user?.email }} <span v-if="userRole">({{ getRoleDisplayName(userRole) }})</span>
            </span>
            <router-link
              v-if="userRole === 'admin'"
              to="/admin"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="{ 'border-indigo-500 text-gray-900': $route.path === '/admin' }"
            >
              <svg class="w-5 h-5 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Панель управления
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <button
            @click="handleLogout"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-[#1a3353] hover:bg-[#223e6a] transition-colors w-full sm:w-auto ml-0 sm:ml-4"
          >
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
            </svg>
            Выйти
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const userRole = computed(() => authStore.userRole)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

function getRoleDisplayName(role) {
  if (role === 'admin') return 'Администратор'
  if (role === 'manager') return 'Руководитель'
  if (role === 'employee') return 'Сотрудник'
  return role || '—'
}
</script> 