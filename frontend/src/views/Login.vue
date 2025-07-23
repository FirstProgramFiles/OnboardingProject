<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f3e8ff] px-2 py-6 relative overflow-hidden">
    <!-- Фоновое солнышко -->
    <img src="/src/assets/logo-bashrts.svg" alt="" class="pointer-events-none select-none absolute -bottom-32 -right-32 w-[420px] opacity-10 z-0" />
    <!-- Фоновая волна -->
    <svg class="absolute left-0 bottom-0 w-full h-32 z-0" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z" fill="#f7931e" fill-opacity="0.08" />
    </svg>
    <div class="w-full max-w-md z-10">
      <!-- Logo and Header -->
      <div class="text-center mb-8 animate-fade-in">
        <img src="/src/assets/logo-bashrts.svg" alt="БашРТС" class="mx-auto h-16 md:h-20 mb-2" />
        <h1 class="text-2xl md:text-3xl font-extrabold text-[#1a3353] mb-1" style="font-family: 'Montserrat', 'Arial', sans-serif;">Вход в систему</h1>
        <p class="text-[#f7931e] font-medium text-base mb-2">Онбординг сотрудников БашРТС</p>
        <div class="text-[#1a3353] text-base md:text-lg font-semibold mb-2">Добро пожаловать в команду!</div>
        <div class="text-[#1a3353] text-sm md:text-base opacity-70 mb-2">Ваша точка входа в корпоративную жизнь</div>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-xl shadow-md p-4 md:p-6 animate-slide-up border border-[#f3e8ff]">
        <form @submit.prevent="handleLogin" class="space-y-3">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-xs font-semibold text-[#1a3353] mb-1">Email</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-[#f7931e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#f7931e" stroke-width="2" fill="#fff7e6" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="block w-full rounded-lg border border-gray-300 focus:border-[#f7931e] focus:ring-2 focus:ring-[#f7931e] focus:outline-none pl-8 pr-2 py-1.5 text-[#1a3353] bg-[#f8fafc] placeholder-gray-400 text-sm transition"
                placeholder="Введите ваш email"
                :class="{ 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:outline-none': error }"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-xs font-semibold text-[#1a3353] mb-1">Пароль</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <svg class="h-4 w-4 text-[#f7931e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="8" width="16" height="10" rx="2" fill="#fff7e6" stroke="#f7931e" stroke-width="2" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="block w-full rounded-lg border border-gray-300 focus:border-[#f7931e] focus:ring-2 focus:ring-[#f7931e] focus:outline-none pl-8 pr-2 py-1.5 text-[#1a3353] bg-[#f8fafc] placeholder-gray-400 text-sm transition"
                placeholder="Введите ваш пароль"
                :class="{ 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:outline-none': error }"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-2 animate-bounce-in text-xs">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-4 w-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-2">
                <p class="text-xs text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-1.5 rounded-lg bg-[#f7931e] hover:bg-[#ffa940] text-white font-bold text-base shadow-sm transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#f7931e]/40 flex items-center justify-center gap-1"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#fff7e6" stroke-width="2">
              <circle cx="12" cy="12" r="10" fill="#f7931e" stroke="#fff7e6" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4" stroke="#fff7e6" stroke-width="2" />
            </svg>
            <span v-if="loading">Вход...</span>
            <span v-else>Войти</span>
          </button>
        </form>
      </div>

      <!-- Преимущества -->
      <div class="mt-8 text-center animate-fade-in">
        <div class="flex flex-col gap-2 items-center">
          <div class="flex items-center gap-2 text-[#1a3353] text-sm md:text-base">
            <svg class="h-5 w-5 text-[#f7931e]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f7931e" opacity=".2"/><path d="M8 12l2 2 4-4" stroke="#f7931e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Большая команда профессионалов
          </div>
          <div class="flex items-center gap-2 text-[#1a3353] text-sm md:text-base">
            <svg class="h-5 w-5 text-[#f7931e]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f7931e" opacity=".2"/><path d="M12 8v4l3 3" stroke="#f7931e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Современные технологии и обучение
          </div>
          <div class="flex items-center gap-2 text-[#1a3353] text-sm md:text-base">
            <svg class="h-5 w-5 text-[#f7931e]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f7931e" opacity=".2"/><path d="M12 6v6l4 2" stroke="#f7931e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Забота о сотрудниках и поддержка
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 animate-fade-in">
        <p class="text-sm text-[#1a3353] opacity-60">Система онбординга сотрудников БашРТС</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Пожалуйста, заполните все поля'
    return
  }

  loading.value = true
  error.value = ''

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    await authStore.fetchProfile() // Явно обновляем профиль
    // Редиректим сразу по роли
    if (authStore.userRole === 'admin') {
      router.push('/admin')
    } else {
      router.push('/profile')
    }
  } else {
    error.value = result.error
  }

  loading.value = false
}
</script> 