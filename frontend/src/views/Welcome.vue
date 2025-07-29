<template>
  <div class="h-screen flex flex-col items-center bg-[#f7f8fa] overflow-hidden pt-4">
    <!-- Верхний контент -->
    <div class="w-full flex flex-col items-center px-2">
      <div class="flex flex-row items-center gap-3 mb-1 mt-4">
        <img src="/src/assets/logo-bashrts.svg" alt="БашРТС" class="h-6 md:h-10 lg:h-12 w-auto" />
        <div class="text-left">
          <div class="font-extrabold text-xs md:text-lg lg:text-xl text-[#1a3353] leading-tight uppercase tracking-tight" style="font-family: 'Montserrat', 'Arial', sans-serif;">
            БАШКИРСКИЕ<br />РАСПРЕДЕЛИТЕЛЬНЫЕ<br />ТЕПЛОВЫЕ СЕТИ
          </div>
        </div>
      </div>
      <div class="w-full text-center mb-4 mt-1">
        <div class="font-extrabold text-xs md:text-base lg:text-lg text-[#f7931e] uppercase leading-tight" style="font-family: 'Montserrat', 'Arial', sans-serif;">
          РАДЫ ПРИВЕТСТВОВАТЬ ВАС<br />В КОМАНДЕ ООО «БАШРТС»!
        </div>
      </div>
      <div class="relative w-full max-w-md mx-auto mb-4">
        <div class="bg-gradient-to-br from-[#e9eef2] to-[#f5f7fa] rounded shadow-lg p-2 md:p-2" style="box-shadow: 0 6px 16px 0 #bfc9d6;">
          <div class="font-extrabold text-[#1a3353] text-xs md:text-base mb-1" style="font-family: 'Montserrat', 'Arial', sans-serif;">Уважаемый коллега!</div>
          <div class="text-[#1a3353] text-xs md:text-base mb-1" style="font-family: 'Montserrat', 'Arial', sans-serif;">
            От всего коллектива поздравляем Вас со вступлением в команду Группы «Интер РАО» и ООО «БашРТС».
          </div>
          <div class="text-[#1a3353] text-xs md:text-base mb-1" style="font-family: 'Montserrat', 'Arial', sans-serif;">
            Вы начинаете трудовую деятельность в крупном энергетическом холдинге и одном из крупных теплоэнергетических предприятий.
          </div>
          <div class="text-[#1a3353] text-xs md:text-base mb-1" style="font-family: 'Montserrat', 'Arial', sans-serif;">
            Данное приложение призвано помочь Вам быстрее адаптироваться в компании.
          </div>
          <div class="text-[#1a3353] text-xs md:text-base font-medium" style="font-family: 'Montserrat', 'Arial', sans-serif;">Желаем успехов!</div>
        </div>
      </div>
    </div>
    
    <!-- Кнопка Продолжить с фиксированным отступом -->
    <div class="w-full flex justify-center mb-4">
      <button @click="skipWelcome"
        class="px-3 py-1.5 rounded-full border border-[#f7931e] bg-[#f7931e]/80 hover:bg-[#f7931e] text-[#fff7e6] font-medium text-xs md:text-sm shadow-sm transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#f7931e]/40">
        Продолжить
      </button>
    </div>
    
    <!-- SVG персонажи внизу экрана -->
    <div class="w-full flex justify-center">
      <img src="/src/assets/welcome-people.svg" alt="Сотрудники" class="w-full max-w-2xl h-auto max-h-[20vh] md:max-h-[25vh] lg:max-h-[30vh] object-contain block" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const authStore = useAuthStore()

async function skipWelcome() {
  try {
    const userId = authStore.user?.id
    if (!userId) throw new Error('User not found')
    await axios.patch(`${API_URL}/users/${userId}/has-seen-welcome`)
    // Обновить профиль пользователя в сторе
    await authStore.fetchProfile()
    router.push('/profile')
  } catch (error) {
    console.error('Ошибка при обновлении hasSeenWelcome:', error)
    // Можно добавить уведомление об ошибке
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');

@media (max-width: 640px) {
  svg[viewBox="0 0 160 60"] {
    left: 4px !important;
    width: 80px !important;
    height: 24px !important;
  }
}
</style> 