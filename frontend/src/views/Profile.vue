<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f3e8ff] flex flex-col lg:flex-row items-start lg:justify-center p-1 md:p-3">
    <!-- Уведомления -->
    <div v-if="notification" 
            :class="[
           'fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-500 transform',
           notificationType === 'success' 
             ? 'bg-green-50 border-green-400 text-green-800' 
             : 'bg-red-50 border-red-400 text-red-800'
         ]"
         style="animation: slideInRight 0.5s ease-out;">
      <div class="flex items-center gap-3">
        <svg v-if="notificationType === 'success'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        <span class="font-medium">{{ notificationMessage }}</span>
        <button @click="notification = false" class="ml-auto text-gray-400 hover:text-gray-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
    <!-- Mobile Header (fixed) -->
    <div class="lg:hidden fixed top-0 left-0 w-full z-30 bg-white shadow-sm">
      <ProfileHeader
        :user="{
          avatar: user?.avatar && user?.id ? `${API_URL}/users/${user.id}/avatar?${user.avatar}` : '',
          fullName: userFullName,
          position: userPosition,
          department: userDepartment,
          email: user?.email
        }"
        @change-avatar="triggerAvatarInput"
        @edit-profile="currentSection='profile'"
      />
    </div>
    <div class="flex w-full max-w-6xl gap-8 lg:items-start">
      <!-- Desktop Sidebar -->
      <aside class="hidden lg:flex flex-col w-64 flex-shrink-0 pt-6 sticky top-0 h-screen">
        <!-- Мини-профиль -->
        <div class="flex flex-col items-center bg-white rounded-2xl shadow-md p-4 mb-4">
          <img :src="user?.avatar && user?.id ? `${API_URL}/users/${user.id}/avatar?${user.avatar}` : '/default-avatar.png'" :alt="userFullName" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow mb-2" />
          <div class="font-bold text-gray-900 text-base truncate w-full text-center">{{ userFullName }}</div>
          <div class="text-xs text-gray-500 truncate w-full text-center">{{ userPosition }}</div>
          <div class="flex items-center justify-center mt-2">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate">{{ userDepartment }}</span>
          </div>
          <button @click="logout" class="flex items-center gap-2 w-full px-3 py-2 mt-4 rounded-lg bg-white hover:bg-red-50 text-red-600 font-semibold text-sm shadow-sm border border-[#f3e8ff] transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
          Выйти
        </button>
        </div>
        <!-- Прогресс и навигация (оставить как есть, но бейдж процента оранжевый) -->
        <div class="mb-6 px-3">
          <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-gradient-to-r from-[#f7931e] to-[#1a3353] rounded-full animate-pulse"></div>
                <span class="text-sm font-semibold text-gray-800">Прогресс адаптации</span>
              </div>
              <span class="text-lg font-bold bg-gradient-to-r from-[#f7931e] to-[#1a3353] bg-clip-text text-transparent">{{ progressPercent }}%</span>
            </div>
            <div class="relative">
              <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div 
                  class="bg-gradient-to-r from-[#f7931e] to-[#1a3353] h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  :style="{ width: progressPercent + '%' }"
                >
                  <!-- Анимированная полоска -->
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <!-- УДАЛЕНЫ подписи 'Начало', '50%', 'Завершение' -->
            </div>
            <div class="mt-3 text-xs text-gray-600">
              {{ completedTasksCount }} из {{ allTasks.length }} задач выполнено
          </div>
          </div>
        </div>
        <!-- Компактная навигация -->
        <div class="bg-white rounded-xl shadow-sm border border-[#f3e8ff] p-3 mb-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-semibold text-[#1a3353] text-sm">Навигация</h3>
            <button @click="sidebarCollapsed = !sidebarCollapsed" class="text-gray-500 hover:text-[#f7931e] transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
          
          <div v-show="!sidebarCollapsed" class="space-y-2">
            <button 
              :class="[
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-3 group relative overflow-hidden',
                currentSection==='profile' 
                  ? 'bg-gradient-to-r from-[#f7931e]/20 to-[#1a3353]/20 text-[#f7931e] shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#f7931e]'
              ]" 
              @click="currentSection='profile'"
            >
              <div class="flex-shrink-0 w-5 h-5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <span>Профиль</span>
              <div v-if="currentSection==='profile'" class="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f7931e] to-[#1a3353] rounded-l-full"></div>
            </button>
            
            <button 
              :class="[
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-3 group relative overflow-hidden',
                currentSection==='info' 
                  ? 'bg-gradient-to-r from-[#f7931e]/20 to-[#1a3353]/20 text-[#f7931e] shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#f7931e]'
              ]" 
              @click="currentSection='info'"
            >
              <div class="flex-shrink-0 w-5 h-5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span>Информация</span>
              <div v-if="currentSection==='info'" class="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f7931e] to-[#1a3353] rounded-l-full"></div>
            </button>
            
            <button 
              :class="[
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between group relative overflow-hidden',
                currentSection==='tasks' 
                  ? 'bg-gradient-to-r from-[#f7931e]/20 to-[#1a3353]/20 text-[#f7931e] shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#f7931e]'
              ]" 
              @click="currentSection='tasks'"
            >
              <div class="flex items-center gap-3">
                <div class="flex-shrink-0 w-5 h-5">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <span>Адаптация</span>
              </div>
              <span class="text-xs bg-[#f7931e] text-white px-2 py-1 rounded-full font-medium shadow-sm ml-2">{{ progressPercent }}%</span>
              <div v-if="currentSection==='tasks'" class="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f7931e] to-[#1a3353] rounded-l-full"></div>
            </button>
            
          <button 
            :class="[
                'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-3 group relative overflow-hidden',
              progressPercent === 100 
                  ? (currentSection==='survey' 
                      ? 'bg-gradient-to-r from-[#f7931e]/20 to-[#1a3353]/20 text-[#f7931e] shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#f7931e]')
                  : 'text-gray-400 cursor-not-allowed opacity-50'
            ]" 
            @click="progressPercent === 100 && (currentSection='survey')"
            :disabled="progressPercent !== 100"
          >
              <div class="flex-shrink-0 w-5 h-5">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <span>Анкета</span>
              <div v-if="progressPercent !== 100" class="absolute right-2 top-1/2 transform -translate-y-1/2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div v-if="currentSection==='survey' && progressPercent === 100" class="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#f7931e] to-[#1a3353] rounded-l-full"></div>
          </button>
          </div>
        </div>
      </aside>
      <!-- Main Content -->
      <main class="flex-1 w-full pb-20 lg:pb-0">
        <section v-if="currentSection==='profile'">
          <!-- Профиль (вся инфа о пользователе) -->
          <div class="bg-white rounded-2xl shadow-md p-4 md:p-6 flex flex-col items-center border border-[#f3e8ff]">
            <!-- Вернуть аватар с возможностью обновления -->
            <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-gradient-to-r from-[#f7931e] to-[#1a3353] shadow-xl overflow-hidden bg-white mb-4 relative group cursor-pointer" @click="triggerAvatarInput">
              <img v-if="user?.avatar && user?.id && !avatarPreview" :src="`${API_URL}/users/${user.id}/avatar?${user.avatar}`" :alt="userFullName" class="w-full h-full object-cover" />
              <img v-if="avatarPreview" :src="avatarPreview" :alt="userFullName" class="w-full h-full object-cover" />
              <div v-else-if="!user?.avatar && !avatarPreview" class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg class="w-12 h-12 lg:w-16 lg:h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
              <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarSelected" />
              <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
                <svg class="animate-spin w-6 h-6 lg:w-8 lg:h-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                    </div>
                  </div>
            <!-- На десктопе убрать аватар и кнопку Выйти -->
            <div class="w-full">
            <h2 class="text-xl lg:text-2xl font-bold text-gray-900 mb-1 text-center">{{ userFullName }}</h2>
            <div class="text-base lg:text-lg text-indigo-700 mb-2 text-center">{{ userPosition }}</div>
            <div class="flex flex-wrap gap-2 justify-center mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-indigo-50 text-indigo-700">
                <svg class="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ userDepartment }}
              </span>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-pink-50 text-pink-700">
                <svg class="w-3 h-3 lg:w-4 lg:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Сотрудник
              </span>
            </div>
            <div class="grid grid-cols-1 gap-4 lg:gap-8 w-full mt-2 mb-2">
              <div class="flex flex-col items-center lg:items-start">
                <div class="flex items-center mb-1">
                  <svg class="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span class="font-medium text-gray-600 text-sm lg:text-base">Email:</span>
                  <span class="ml-2 text-gray-900 text-sm lg:text-base">{{ user?.email }}</span>
                  </div>
                <div class="flex items-center">
                  <svg class="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span class="font-medium text-gray-600 text-sm lg:text-base">Телефон:</span>
                  <span class="ml-2 text-gray-900 text-sm lg:text-base">{{ user?.phone || 'Не указан' }}</span>
                </div>
              </div>
              <div class="flex flex-col items-center lg:items-start">
                <div class="flex items-center mb-1">
                  <svg class="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="font-medium text-gray-600 text-sm lg:text-base">Руководитель:</span>
                  <span class="ml-2 text-gray-900 text-sm lg:text-base">{{ user?.manager ? [user.manager.lastName, user.manager.firstName, user.manager.middleName].filter(Boolean).join(' ') : '—' }}</span>
                  </div>
                  </div>
              </div>
              <!-- Кнопка Выйти только на мобильных -->
              <button @click="logout" class="flex items-center gap-2 w-full px-3 py-2 mt-6 rounded-lg bg-white hover:bg-red-50 text-red-600 font-semibold text-sm shadow-sm border border-[#f3e8ff] transition lg:hidden">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                </svg>
                Выйти
              </button>
                  </div>
                  </div>
        </section>
        <section v-else-if="currentSection==='info'">
          <!-- Общая информация -->
          <div class="bg-white rounded-3xl shadow-xl p-4 lg:p-8 text-gray-700 text-lg lg:text-xl w-full flex flex-col items-center">
            <div class="mb-6 w-full flex flex-col items-center">
              <div class="info-links flex flex-col items-start gap-2 w-full">
                <button @click="showGuide = true" class="px-2 py-1 rounded text-[#1a3353] text-base font-medium hover:underline hover:text-[#f7931e] transition bg-transparent shadow-none border-none">
                  Гид новичка
                </button>
                <!-- Здесь можно добавить другие ссылки/кнопки -->
              </div>
            </div>
            <div class="text-gray-400 text-base">Здесь появится полезная информация для новых сотрудников.</div>
            <!-- Модалка PDF-гайда -->
            <div v-if="showGuide" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div class="bg-white rounded-2xl shadow-2xl p-4 w-full max-w-2xl relative flex flex-col items-center">
                <button @click="showGuide = false" class="absolute top-2 right-2 text-gray-400 hover:text-[#f7931e] text-2xl">&times;</button>
                <div class="font-bold text-lg mb-2 text-[#1a3353]">Гид новичка</div>
                <div class="w-full flex flex-col items-center">
                  <div class="pdf-viewer-area">
                    <PdfEmbed
                      v-if="pdfBlobUrl"
                      :source="pdfBlobUrl"
                      style="width:100%; min-height:60vh; max-height:70vh; background:#f7f8fa; border-radius:1rem; box-shadow:0 2px 12px #0001;"
                    />
                  </div>
                </div>
              </div>
            </div>
                  </div>
        </section>
        <section v-else-if="currentSection==='tasks'">
          <!-- Задачи (онбординг) -->
          <div class="space-y-6">
            <!-- Заголовок программы адаптации -->
            <div class="bg-white rounded-2xl shadow-lg p-6 border border-[#f3e8ff]">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <!-- УДАЛЕНА КНОПКА-СТРЕЛКА -->
                  <svg class="w-8 h-8 text-[#f7931e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  <div>
                    <h2 class="text-xl font-bold text-[#1a3353]">Программа адаптации</h2>
                    <p class="text-sm text-gray-600">{{ completedTasksCount }} из {{ allTasks.length }} задач выполнено</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-[#f7931e]">{{ progressPercent }}%</div>
                  <div class="text-xs text-gray-500">прогресс</div>
                </div>
              </div>
              
              <!-- Описание программы -->
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <h3 class="font-semibold text-blue-900 mb-1">Как работает программа адаптации</h3>
                    <p class="text-sm text-blue-800">
                      Программа состоит из <strong>{{ stages.length }} этапов</strong> ({{ completedStagesCount }} завершено), каждый содержит группу связанных задач. 
                      Этапы выполняются последовательно. Завершите все задачи этапа, чтобы перейти к следующему.
                    </p>
                  </div>
                  </div>
              </div>
            </div>

            <!-- Список этапов -->
            <div v-if="loading" class="space-y-4">
              <!-- Скелетон для этапов -->
              <div v-for="i in 3" :key="i" class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
                <div class="p-4 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div class="flex-1">
                        <div class="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div class="flex gap-4">
                          <div class="h-3 bg-gray-200 rounded w-20"></div>
                          <div class="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="h-6 bg-gray-200 rounded w-12 mb-1"></div>
                      <div class="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                <div class="p-4">
                  <div class="space-y-3">
                    <div v-for="j in 3" :key="j" class="flex items-start gap-4">
                      <div class="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div class="flex-1">
                        <div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div class="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                      <div class="w-16 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
                         <div v-else-if="allTasks.length > 0" class="space-y-4">
                               <div v-for="(stage, index) in stages" :key="stage.id" 
                     class="bg-white rounded-2xl shadow-lg border overflow-hidden transform transition-all duration-300 hover:shadow-xl"
                     :class="[
                       shouldShowStage(stage, index) 
                         ? 'border-[#f3e8ff]' 
                         : 'border-gray-200 opacity-60'
                     ]"
                     :style="{ animationDelay: index * 100 + 'ms' }">
                <!-- Заголовок этапа -->
                <div class="p-4 border-b border-gray-100">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="relative">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#f7931e] to-[#1a3353] flex items-center justify-center text-white font-bold text-base shadow-lg">
                          {{ stage.order }}
                        </div>
                        <div v-if="isStageCompleted(stage)" class="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <div v-else-if="!shouldShowStage(stage, index)" class="absolute -top-1 -right-1 w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h3 class="text-lg font-bold text-[#1a3353]">{{ stage.name }}</h3>
                          <span v-if="stage.category !== 'Общая'" 
                                class="px-2 py-0.5 rounded-full text-xs font-medium"
                                :class="[
                                  stage.category === 'ИТР' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : 'bg-orange-100 text-orange-700'
                                ]">
                            {{ stage.category }}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-2">{{ stage.description }}</p>
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                          <span>{{ tasksByStage[stage.name]?.length || 0 }} задач в этапе</span>
                          <span>{{ tasksByStage[stage.name]?.filter(t => t.status === 'completed').length || 0 }} выполнено</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-xl font-bold text-[#f7931e]">{{ stageProgress(tasksByStage[stage.name] || []) }}%</div>
                      <div class="text-xs text-gray-500">прогресс</div>
                    </div>
                  </div>
                </div>

                                  <!-- Задачи этапа -->
                  <div v-if="shouldShowStage(stage, index)" class="p-4">
                    <div class="mb-3">
                      <h4 class="text-sm font-semibold text-gray-700 mb-2">Задачи этапа:</h4>
                    </div>
                    <div class="space-y-2">
                      <div v-for="task in tasksByStage[stage.name] || []" :key="task.id" 
                           class="group relative bg-white rounded-xl p-4 border border-gray-100 hover:border-[#f7931e]/40 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div class="flex items-start gap-4">
                          <!-- Улучшенный чекбокс -->
                          <div class="flex-shrink-0">
                            <button
                              @click="toggleTaskStatus(task)"
                              :disabled="updatingTaskId === task.id"
                              class="relative w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center group/checkbox"
                              :class="[
                                task.status === 'completed' 
                                  ? 'bg-gradient-to-r from-[#f7931e] to-[#1a3353] border-transparent shadow-lg' 
                                  : 'border-gray-300 hover:border-[#f7931e] hover:bg-gray-50 group-hover:border-[#f7931e]',
                                updatingTaskId === task.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                              ]"
                            >
                              <svg v-if="task.status === 'completed'" class="w-4 h-4 text-white transform scale-0 group-hover/checkbox:scale-100 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              <div v-if="updatingTaskId === task.id" class="absolute inset-0 flex items-center justify-center">
                                <div class="w-4 h-4 border-2 border-[#f7931e] border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            </button>
                          </div>

                          <!-- Контент задачи -->
                          <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-3">
                              <div class="flex-1 min-w-0">
                                <h4 class="font-semibold text-gray-900 text-sm transition-all duration-300"
                                    :class="task.status === 'completed' ? 'line-through text-gray-400' : 'group-hover:text-[#1a3353]'">
                                  {{ task.title }}
                                </h4>
                                <p class="text-xs text-gray-500 transition-all duration-300 mt-2 leading-relaxed"
                                   :class="task.status === 'completed' ? 'line-through text-gray-300' : ''">
                                  {{ task.description }}
                                </p>
                              </div>
                              
                              <!-- Улучшенные бейджи -->
                              <div class="flex items-center gap-2 flex-shrink-0">
                                <span v-if="task.category !== 'Общая'" 
                                      class="px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-300"
                                      :class="[
                                        task.category === 'ИТР' 
                                          ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200' 
                                          : 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-200'
                                      ]">
                                  {{ task.category }}
                                </span>
                                <span v-if="task.status === 'completed'" 
                                      class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200 shadow-sm flex items-center gap-1">
                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                  Выполнено
                                </span>
                                <span v-else-if="task.status === 'pending'" 
                                      class="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200 shadow-sm">
                                  В ожидании
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Индикатор прогресса для задачи -->
                        <div v-if="task.status === 'completed'" class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-t-xl"></div>
                      </div>
                  </div>
                </div>

                <!-- Сообщение о завершении этапа -->
                <div v-else-if="isStageCompleted(stage)" class="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200">
                  <div class="flex items-center justify-center gap-3 text-green-700">
                    <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-lg">Этап завершён!</div>
                      <p class="text-sm text-green-600">Все задачи этого этапа выполнены</p>
                    </div>
                  </div>
                </div>
                
                <!-- Сообщение о заблокированном этапе -->
                <div v-else class="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <div class="flex items-center justify-center gap-3 text-gray-600">
                    <div class="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                    </div>
                    <div class="text-center">
                      <div class="font-semibold text-lg">Этап заблокирован</div>
                      <p class="text-sm text-gray-500">Сначала завершите предыдущий этап</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Пустое состояние -->
            <div v-else class="bg-white rounded-2xl shadow-lg p-12 border border-[#f3e8ff]">
              <div class="text-center">
                <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                </div>
                <h3 class="text-xl font-semibold text-[#1a3353] mb-2">Задачи не найдены</h3>
                <p class="text-gray-600 mb-4">У вас пока нет задач для онбординга. Обратитесь к администратору.</p>
                <button @click="fetchOnboardingData" class="px-4 py-2 bg-[#f7931e] text-white rounded-lg hover:bg-[#1a3353] transition-colors">
                  Обновить
                </button>
              </div>
            </div>
          </div>
        </section>
        <section v-else-if="currentSection==='survey'">
          <!-- Анкетирование -->
          <div class="bg-white rounded-2xl shadow-md p-4 md:p-6 flex flex-col items-center justify-center min-h-[220px] border border-[#f3e8ff]">
            <svg class="w-12 h-12 lg:w-16 lg:h-16 text-[#f7931e] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h2a4 4 0 014 4v2M7 17v-2a4 4 0 00-4-4H1a4 4 0 00-4 4v2m16 0v2a4 4 0 01-4 4H7a4 4 0 01-4-4v-2" />
            </svg>
            <span class="text-[#1a3353] text-base lg:text-lg text-center">Анкетирование будет доступно, когда прогресс онбординга будет заполнен полностью.</span>
        </div>
        </section>
      </main>
    </div>
    
    <!-- Мобильная навигация -->
    <div class="lg:hidden fixed bottom-0 left-0 w-full z-40 bg-white border-t border-gray-200 shadow-lg">
      <div class="flex items-center justify-around px-2 py-2">
        <button 
          @click="currentSection='profile'"
          :class="[
            'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative',
            currentSection === 'profile'
              ? 'text-[#f7931e] bg-[#f7931e]/10' 
              : 'text-gray-500 hover:text-[#f7931e] hover:bg-gray-50'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span class="text-xs font-medium">Профиль</span>
          <div v-if="currentSection === 'profile'" class="absolute -top-1 w-2 h-2 bg-[#f7931e] rounded-full"></div>
        </button>
        
        <button 
          @click="currentSection='info'"
          :class="[
            'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative',
            currentSection === 'info'
              ? 'text-[#f7931e] bg-[#f7931e]/10' 
              : 'text-gray-500 hover:text-[#f7931e] hover:bg-gray-50'
          ]"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-xs font-medium">Инфо</span>
          <div v-if="currentSection === 'info'" class="absolute -top-1 w-2 h-2 bg-[#f7931e] rounded-full"></div>
        </button>
        
        <button 
          @click="currentSection='tasks'"
          :class="[
            'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative',
            currentSection === 'tasks'
              ? 'text-[#f7931e] bg-[#f7931e]/10' 
              : 'text-gray-500 hover:text-[#f7931e] hover:bg-gray-50'
          ]"
        >
          <div class="relative flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <span class="absolute -top-2 -right-4 text-xs font-bold text-[#f7931e]">{{ progressPercent }}%</span>
          </div>
          <span class="text-xs font-medium">Адаптация</span>
          <div v-if="currentSection === 'tasks'" class="absolute -top-1 w-2 h-2 bg-[#f7931e] rounded-full"></div>
        </button>
        
        <button 
          @click="progressPercent === 100 && (currentSection='survey')"
          :disabled="progressPercent !== 100"
          :class="[
            'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 relative',
            progressPercent === 100
              ? (currentSection === 'survey'
                  ? 'text-[#f7931e] bg-[#f7931e]/10'
                  : 'text-gray-500 hover:text-[#f7931e] hover:bg-gray-50')
              : 'text-gray-300 cursor-not-allowed'
          ]"
        >
          <div class="relative">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div v-if="progressPercent !== 100" class="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
              <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
          </div>
          <span class="text-xs font-medium">Анкета</span>
          <div v-if="currentSection === 'survey' && progressPercent === 100" class="absolute -top-1 w-2 h-2 bg-[#f7931e] rounded-full"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import TheNavbar from '../components/TheNavbar.vue'
import axios from 'axios';
import ProfileHeader from '../components/ProfileHeader.vue'
import PdfEmbed from 'vue-pdf-embed'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const userRole = computed(() => authStore.userRole)

// Computed properties
const userFirstName = computed(() => user.value?.firstName || 'Пользователь')
const userFullName = computed(() => {
  if (!user.value) return 'Пользователь'
  return [user.value.lastName, user.value.firstName, user.value.middleName].filter(Boolean).join(' ')
})
const userPosition = computed(() => {
  if (!user.value) return 'Должность не указана'
  return user.value.position || user.value.positionRef?.name || 'Должность не указана'
})
const userDepartment = computed(() => {
  if (!user.value) return 'Отдел не указан'
  return user.value.department || user.value.departmentRef?.name || 'Отдел не указан'
})

// Reactive variables
const avatarInput = ref(null)
const avatarPreview = ref(null)
const isUploading = ref(false)
const uploadError = ref('')
const editMode = ref(false)
const loading = ref(false)
const notification = ref(null)
const notificationType = ref('success')
const notificationMessage = ref('')
const allTasks = ref([])
const stages = ref([])
const tasksByStage = ref({})
const updatingTaskId = ref(null)
const currentSection = ref('profile')
const sidebarCollapsed = ref(false)
const showGuide = ref(false)
const pdfBlobUrl = ref('')
const pdfPage = ref(1)
const pdfPages = ref(1)
const pdfScale = ref(1)
const pdfRef = ref(null)

const API_URL = import.meta.env.VITE_API_URL

function onPdfLoaded(pdf) {
  pdfPages.value = pdf.pageCount || 1
  // pdfPage.value = 1 // не сбрасываем страницу при каждом открытии
  pdfScale.value = 1
}

function handlePrevPage() {
  if (pdfPage.value > 1) {
    pdfPage.value--
    pdfRef.value.setPage(pdfPage.value)
  }
}
function handleNextPage() {
  if (pdfPage.value < pdfPages.value) {
    pdfPage.value++
    pdfRef.value.setPage(pdfPage.value)
  }
}
function handleScaleChange(e) {
  pdfScale.value = Number(e.target.value)
  pdfRef.value.setScale(pdfScale.value)
}

// Edit form
const editForm = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phone: ''
})

// Progress
const progressPercent = computed(() => {
  if (allTasks.value.length === 0) return 0
  const completedTasks = allTasks.value.filter(task => task.status === 'completed').length
  return Math.round((completedTasks / allTasks.value.length) * 100)
})

const completedTasksCount = computed(() => {
  return allTasks.value.filter(task => task.status === 'completed').length
})

const remainingTasksCount = computed(() => {
  return allTasks.value.length - completedTasksCount.value
})

const completedStagesCount = computed(() => {
  return stages.value.filter(stage => isStageCompleted(stage)).length
})

// Functions
function showNotification(message, type = 'success') {
  notificationMessage.value = message
  notificationType.value = type
  notification.value = true
  
  setTimeout(() => {
    notification.value = false
  }, 3000)
}

function formatDate(dateString) {
  if (!dateString) return 'Не указано'
  return new Date(dateString).toLocaleString('ru-RU')
}

function getRoleDisplayName(role) {
  const roleDisplayNames = {
    'manager': 'Руководитель',
    'admin': 'Администратор',
    'employee': 'Сотрудник'
  }
  return roleDisplayNames[role] || role
}

function stageProgress(tasks) {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  return Math.round((completedTasks / tasks.length) * 100)
}

function isStageCompleted(stage) {
  const stageTasks = tasksByStage.value[stage.name] || []
  if (stageTasks.length === 0) return false
  return stageTasks.every(task => task.status === 'completed')
}

function isPreviousStageCompleted(stage, currentIndex) {
  // Первый этап всегда показываем
  if (currentIndex === 0) return false
  
  // Проверяем, завершён ли предыдущий этап
  const previousStage = stages.value[currentIndex - 1]
  if (!previousStage) return false
  
  return isStageCompleted(previousStage)
}

function shouldShowStage(stage, index) {
  // Показываем этап если он не завершён или если предыдущий этап завершён
  return !isStageCompleted(stage) || isPreviousStageCompleted(stage, index)
}

async function handleSave() {
  if (!user.value || !user.value.id) {
    console.error('Пользователь не авторизован')
    return
  }
  
  try {
    const token = localStorage.getItem('token')
    await axios.patch(
      `${API_URL}/users/${user.value.id}`,
      editForm.value,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    // Обновить данные пользователя в store
    await authStore.fetchUser()
    editMode.value = false
  } catch (err) {
    console.error('Ошибка сохранения:', err)
  }
}

async function toggleTaskStatus(task) {
  if (!user.value) {
    console.error('Пользователь не авторизован')
    return
  }
  
  if (updatingTaskId.value === task.id) return
  
  updatingTaskId.value = task.id
  try {
    const token = localStorage.getItem('token')
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    
    await axios.patch(
      `${API_URL}/onboarding/tasks/${task.id}/status`,
      { status: newStatus },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )
    
    // Обновить статус задачи локально
    task.status = newStatus
    showNotification(
      newStatus === 'completed' ? 'Задача выполнена!' : 'Задача отмечена как невыполненная',
      'success'
    )
  } catch (err) {
    console.error('Ошибка обновления задачи:', err)
    showNotification('Ошибка обновления задачи', 'error')
  } finally {
    updatingTaskId.value = null
  }
}

async function fetchOnboardingData() {
  if (!user.value) {
    console.log('Пользователь не авторизован, пропускаем загрузку данных онбординга')
    return
  }
  
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_URL}/onboarding/stages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    stages.value = response.data.stages || []
    allTasks.value = stages.value.flatMap(stage => stage.tasks || []) || []
    
    // Группировка задач по этапам
    tasksByStage.value = {}
    allTasks.value.forEach(task => {
      const stageName = task.stage?.name || 'Без этапа'
      if (!tasksByStage.value[stageName]) {
        tasksByStage.value[stageName] = []
      }
      tasksByStage.value[stageName].push(task)
    })
  } catch (err) {
    console.error('Ошибка загрузки задач онбординга:', err)
  } finally {
    loading.value = false
  }
}

async function fetchPdfBlob() {
  if (!user.value) {
    console.log('Пользователь не авторизован, пропускаем загрузку PDF')
    return
  }
  
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get('/api/guide-pdf', {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` }
    })
    pdfBlobUrl.value = URL.createObjectURL(response.data)
  } catch (err) {
    pdfBlobUrl.value = ''
    // Можно добавить уведомление об ошибке
  }
}

watch(showGuide, (val) => {
  if (val && user.value) fetchPdfBlob()
  else pdfBlobUrl.value = ''
})

watch(pdfBlobUrl, (val) => {
  if (!val) {
    pdfPage.value = 1
    pdfPages.value = 1
    pdfScale.value = 1
  }
})

function triggerAvatarInput() {
  console.log('triggerAvatarInput called')
  if (avatarInput.value) {
    console.log('avatarInput found, clicking...')
    avatarInput.value.click()
  } else {
    console.log('avatarInput not found')
  }
}

function onAvatarSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  // Предпросмотр
  const reader = new FileReader()
  reader.onload = (ev) => {
    avatarPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
  // Отправка на сервер
  uploadAvatar(file)
}

async function uploadAvatar(file) {
  if (!user.value || !user.value.id) {
    uploadError.value = 'Пользователь не авторизован'
    return
  }
  
  isUploading.value = true
  uploadError.value = ''
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    const token = localStorage.getItem('token')
    await axios.patch(
      `${API_URL}/users/${user.value.id}/avatar`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    // Обновить аватар (сбросить кэш)
    avatarPreview.value = null
    user.value.avatar = Date.now() // форсируем обновление src
  } catch (err) {
    uploadError.value = err.response?.data?.error || 'Ошибка загрузки аватара'
  } finally {
    isUploading.value = false
  }
}

// Initialize edit form when user data is available
function initializeEditForm() {
  if (user.value) {
    editForm.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      middleName: user.value.middleName || '',
      email: user.value.email || '',
      phone: user.value.phone || ''
    }
  }
}

// Watch for user changes and initialize form
watch(user, (newUser) => {
  initializeEditForm()
  if (newUser) {
    fetchOnboardingData()
  } else {
    // Очищаем данные при logout
    stages.value = []
    allTasks.value = []
    tasksByStage.value = {}
    pdfBlobUrl.value = ''
  }
}, { immediate: true })

// Load onboarding data on mount
onMounted(() => {
  // Данные загружаются в watch(user)
})

const logout = () => {
  authStore.logout()
  // Принудительно очищаем все reactive переменные
  avatarPreview.value = null
  editMode.value = false
  currentSection.value = 'profile'
  showGuide.value = false
  pdfBlobUrl.value = ''
  // Перенаправляем на страницу входа
  router.push('/login')
}
</script> 

<style scoped>
/* Анимации для этапов */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.space-y-4 > div {
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
}

/* Анимация для прогресс-бара */
.bg-gradient-to-r {
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Анимация shimmer для прогресс-бара */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

/* Плавные переходы для всех элементов */
* {
  transition: all 0.3s ease;
}

/* Hover эффекты для кнопок */
button:hover {
  transform: translateY(-1px);
}

/* Анимация появления элементов */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Анимация для карточек этапов */
.space-y-4 > div {
  animation: slideInUp 0.6s ease-out forwards;
  opacity: 0;
}

.space-y-4 > div:nth-child(1) { animation-delay: 0.1s; }
.space-y-4 > div:nth-child(2) { animation-delay: 0.2s; }
.space-y-4 > div:nth-child(3) { animation-delay: 0.3s; }
.space-y-4 > div:nth-child(4) { animation-delay: 0.4s; }
.space-y-4 > div:nth-child(5) { animation-delay: 0.5s; }

/* Анимация для задач */
.space-y-2 > div {
  animation: slideInRight 0.4s ease-out forwards;
  opacity: 0;
}

.space-y-2 > div:nth-child(1) { animation-delay: 0.1s; }
.space-y-2 > div:nth-child(2) { animation-delay: 0.15s; }
.space-y-2 > div:nth-child(3) { animation-delay: 0.2s; }
.space-y-2 > div:nth-child(4) { animation-delay: 0.25s; }

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Анимация для мобильной навигации */
.lg\:hidden.fixed.bottom-0 {
  animation: slideInUp 0.5s ease-out;
}

/* Анимация для кнопок */
button:active {
  transform: scale(0.95);
}

/* Анимация для чекбоксов */
.group:hover .relative {
  transform: scale(1.05);
}

/* Анимация для бейджей */
span[class*="bg-gradient-to-r"] {
  transition: all 0.3s ease;
}

span[class*="bg-gradient-to-r"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Анимация для чекбоксов */
.group:hover .relative {
  transform: scale(1.05);
}

/* Мобильные улучшения */
@media (max-width: 768px) {
  .space-y-4 > div {
    margin-bottom: 1rem;
  }
  
  .p-6 {
    padding: 1rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .flex.w-full.gap-1 > button {
    font-size: 11px;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    min-width: 0;
  }
  .flex.w-full.gap-1 > button span {
    font-size: 15px;
  }
  .flex.w-full.gap-1 > button .absolute {
    font-size: 10px;
    padding: 0 0.25em;
    right: 0.25em;
    top: 0.25em;
  }
}
.pdf-viewer-area {
  width: 100%;
  min-height: 60vh;
  max-height: 70vh;
  overflow: auto;
  background: #f7f8fa;
  border-radius: 1rem;
  box-shadow: 0 2px 12px #0001;
  padding: 8px 0;
}
.info-links button {
  display: block;
  width: auto;
  background: none;
  border: none;
  text-align: left;
  padding-left: 0;
  padding-right: 0;
}
</style> 