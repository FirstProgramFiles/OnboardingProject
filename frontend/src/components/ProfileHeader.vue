<template>
  <div class="hidden lg:block profile-header bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-100 shadow-sm">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <div class="flex flex-row items-center gap-6">
        <!-- Аватар -->
        <div class="relative group flex-shrink-0">
          <div class="relative">
            <img 
              :src="user.avatar || '/default-avatar.png'" 
              :alt="user.fullName"
              class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
              @error="handleImageError"
            />
            <!-- Онлайн статус -->
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full shadow-sm animate-pulse"></div>
            <!-- Кнопка смены аватара -->
            <button 
              @click="changeAvatar"
              class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- Информация о пользователе -->
        <div class="flex-1 text-left min-w-0">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">
            {{ user.fullName }}
          </h1>
          <p class="text-lg text-gray-600 mb-3 truncate">
            {{ user.position }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <!-- Отдел -->
            <div class="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              {{ user.department }}
            </div>
            <!-- Email -->
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              {{ user.email }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileHeader',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleImageError(event) {
      // Проверяем, что у нас есть user.avatar, иначе не устанавливаем default-avatar
      // чтобы избежать бесконечных запросов при logout
      if (this.user && this.user.avatar) {
        event.target.src = '/default-avatar.png'
      }
    },
    changeAvatar() {
      this.$emit('change-avatar')
    }
  }
}
</script>

<style scoped>
@media (max-width: 640px) {
  .profile-header {
    display: none !important;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style> 