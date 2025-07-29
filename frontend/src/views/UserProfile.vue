<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f3e8ff]">
    <TheNavbar />
    <!-- Main content -->
    <div class="py-6 md:py-10">
      <header>
        <div class="max-w-4xl mx-auto px-2 md:px-0">
          <div class="flex items-center gap-2 mb-2">
            <router-link
              v-if="!editMode"
              to="/admin"
              class="inline-flex items-center px-3 py-1.5 rounded-md text-sm text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:text-[#1a3353] transition-colors"
            >
              <svg class="w-4 h-4 mr-1 -ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </router-link>
            <h1 class="text-3xl font-extrabold leading-tight text-[#1a3353] mb-0" style="font-family: 'Montserrat', 'Arial', sans-serif;">Профиль пользователя</h1>
          </div>
        </div>
      </header>
      <main>
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-[#f7931e]/30">
            <div v-if="loading" class="text-center py-8">
              <p class="text-gray-500">Загрузка профиля...</p>
            </div>
            <div v-else-if="error" class="text-center py-8">
              <p class="text-red-500">{{ error }}</p>
            </div>
            <div v-else-if="userProfile && !editMode" class="max-w-4xl mx-auto">
              <!-- Основная карточка профиля -->
              <div class="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                <!-- Аватар -->
                <div class="relative group">
                  <div class="w-32 h-32 rounded-full border-4 border-[#f7931e] shadow-xl overflow-hidden bg-white flex items-center justify-center">
                    <img v-if="userProfile.avatar" :src="`${API_URL}/users/${userProfile.id}/avatar`" :alt="[userProfile.middleName, userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ')" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
                      <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                </div>
                <!-- Основная информация -->
                <div class="flex-1 flex flex-col items-center md:items-start">
                  <h2 class="text-2xl font-extrabold text-[#1a3353] mb-1 text-center md:text-left">{{ [userProfile.lastName, userProfile.firstName, userProfile.middleName].filter(Boolean).join(' ') }}</h2>
                  <div class="text-lg text-[#1a3353] mb-2 text-center md:text-left">{{ userProfile.positionRef?.name || 'Должность не указана' }}</div>
                  <div class="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f3e8ff] text-[#1a3353]">
                      <svg class="w-4 h-4 mr-1 text-[#f7931e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ userProfile.departmentRef?.name || 'Отдел не указан' }}
                    </span>
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#f3e8ff] text-[#1a3353]">
                      <svg class="w-4 h-4 mr-1 text-[#f7931e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                        {{ getRoleDisplayName(userProfile.role?.name) }}
                      </span>
                  </div>
                  <!-- Кнопки действий -->
                  <div v-if="userRole === 'admin' && userProfile" class="flex flex-col md:flex-row gap-2 w-full md:justify-end justify-center mt-2">
                    <button @click="editMode = true" class="px-3 py-1.5 rounded-md bg-[#f7931e] hover:bg-[#ffa940] text-white font-medium text-sm transition">Редактировать</button>
                    <button @click="showDeleteConfirm = true" class="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition">Удалить</button>
                  </div>
                </div>
              </div>
              
              <!-- Детальная информация -->
              <div class="p-6 md:p-8 space-y-6">
                <!-- Контактная информация -->
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">Контактная информация</h3>
                  <div class="mb-2">
                    <div class="flex flex-col md:flex-row md:justify-between py-1 gap-0.5 md:gap-0">
                      <span class="text-gray-500 md:w-1/2">Email</span>
                      <span class="text-gray-800 md:text-right md:w-1/2 break-words">{{ userProfile.email }}</span>
                    </div>
                    <div class="flex flex-col md:flex-row md:justify-between py-1 gap-0.5 md:gap-0">
                      <span class="text-gray-500 md:w-1/2">Телефон</span>
                      <span class="text-gray-800 md:text-right md:w-1/2 break-words">{{ userProfile.phone || 'Не указан' }}</span>
                    </div>
                  </div>
                  <div class="border-b border-gray-200 my-4"></div>
                </div>
                <!-- Организационная информация -->
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">Организационная информация</h3>
                  <div class="mb-2">
                    <div class="flex flex-col md:flex-row md:justify-between py-1 gap-0.5 md:gap-0">
                      <span class="text-gray-500 md:w-1/2">Отдел</span>
                      <span class="text-gray-800 md:text-right md:w-1/2 break-words">{{ userProfile.departmentRef?.name || 'Не указан' }}</span>
                    </div>
                    <div class="flex flex-col md:flex-row md:justify-between py-1 gap-0.5 md:gap-0">
                      <span class="text-gray-500 md:w-1/2">Должность</span>
                      <span class="text-gray-800 md:text-right md:w-1/2 break-words">{{ userProfile.positionRef?.name || 'Не указана' }}</span>
                    </div>
                    <div v-if="userProfile.manager" class="flex flex-col md:flex-row md:justify-between py-1 gap-0.5 md:gap-0">
                      <span class="text-gray-500 md:w-1/2">Руководитель</span>
                      <span class="text-gray-800 md:text-right md:w-1/2 break-words">{{ [userProfile.manager.lastName, userProfile.manager.firstName, userProfile.manager.middleName].filter(Boolean).join(' ') }}</span>
                      <span class="text-xs text-gray-500 md:text-right md:w-1/2 w-full">{{ userProfile.manager.email }}</span>
                    </div>
                  </div>
                  <div class="border-b border-gray-200 my-4"></div>
                </div>
                <!-- Системная информация -->
                <div>
                  <h3 class="text-base font-semibold text-gray-800 mb-2">Системная информация</h3>
                  <div class="mb-2">
                    <div class="flex flex-col md:flex-row md:justify-between py-1 gap-0.5 md:gap-0">
                      <span class="text-gray-500 md:w-1/2">Дата создания</span>
                      <span class="text-gray-800 md:text-right md:w-1/2 break-words">{{ formatDate(userProfile.createdAt) }}</span>
                    </div>
                    <div class="flex flex-col md:flex-row md:justify-between py-1 gap-0.5 md:gap-0">
                      <span class="text-gray-500 md:w-1/2">Последнее обновление</span>
                      <span class="text-gray-800 md:text-right md:w-1/2 break-words">{{ formatDate(userProfile.updatedAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Форма редактирования -->
            <div v-else-if="userProfile && editMode" class="max-w-4xl mx-auto">
              <div class="p-6 md:p-8">
                <h2 class="text-2xl font-extrabold text-[#1a3353] mb-6 text-center" style="font-family: 'Montserrat', 'Arial', sans-serif;">Редактирование профиля</h2>
                <div>
                  <form @submit.prevent="handleSave" class="space-y-5">
                    <!-- Personal Information Section -->
                    <div class="flex flex-col md:flex-row gap-4 items-start">
                      <!-- Avatar Upload -->
                      <div class="flex flex-col items-center md:w-1/4 w-full">
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-center">Аватар (опционально)</label>
                        <div class="relative w-20 h-20 mb-2 flex justify-center items-center">
                          <img v-if="avatarPreview || userProfile.avatar" :src="avatarPreview || `${API_URL}/users/${userProfile.id}/avatar`" class="w-20 h-20 rounded-full object-cover border border-gray-200" />
                          <div v-else class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" @change="onAvatarSelected" />
                        </div>
                        <span v-if="avatarName" class="text-xs text-gray-500 truncate max-w-[80px]">{{ avatarName }}</span>
                      </div>
                      <!-- ФИО группа -->
                      <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <!-- First Name -->
                        <div>
                          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Имя *</label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              id="firstName"
                              v-model="editForm.firstName"
                              type="text"
                              class="input-field pl-9"
                              placeholder="Иван"
                              :class="[
                                'input-field pl-9',
                                firstNameError ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-0' : ''
                              ]"
                              autocomplete="off"
                            />
                          </div>
                        </div>
                        <!-- Last Name -->
                        <div>
                          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Фамилия *</label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              id="lastName"
                              v-model="editForm.lastName"
                              type="text"
                              class="input-field pl-9"
                              placeholder="Иванов"
                              :class="[
                                'input-field pl-9',
                                lastNameError ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-0' : ''
                              ]"
                              autocomplete="off"
                            />
                          </div>
                        </div>
                        <!-- Middle Name -->
                        <div>
                          <label for="middleName" class="block text-sm font-medium text-gray-700 mb-1">Отчество *</label>
                          <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              id="middleName"
                              v-model="editForm.middleName"
                              type="text"
                              class="input-field pl-9"
                              placeholder="Иванович"
                              autocomplete="off"
                              :class="[
                                'input-field pl-9',
                                middleNameError ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-0' : ''
                              ]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Email -->
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="email"
                          v-model="editForm.email"
                          type="email"
                          class="input-field pl-9"
                          placeholder="ivan@example.com"
                          :class="[
                            'input-field pl-9',
                            emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-0' : ''
                          ]"
                          autocomplete="off"
                        />
                      </div>
                    </div>

                    <!-- Work Information Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Position -->
                      <div>
                        <label for="positionId" class="block text-sm font-medium text-gray-700 mb-1">Должность *</label>
                        <div class="relative">
                          <input
                            id="positionId"
                            v-model="positionSearch"
                            @focus="onPositionFocusOrClick"
                            @click="onPositionFocusOrClick"
                            @input="onPositionInput"
                            @blur="validatePositionInput"
                            type="text"
                            class="input-field pr-10"
                            placeholder="Начните вводить название должности..."
                            autocomplete="off"
                            :class="[
                              'input-field pr-10',
                              positionError ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-0' : ''
                            ]"
                          />
                          <!-- Arrow button -->
                          <button
                            type="button"
                            @mousedown="onPositionArrowClick"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            <svg 
                              class="h-4 w-4 text-gray-400 transition-transform duration-200"
                              :class="{ 'rotate-180': showAllPositions }"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <!-- Position Dropdowns -->
                          <div 
                            v-if="showAllPositions" 
                            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            @click.stop
                          >
                            <div
                              v-for="pos in positions"
                              :key="pos.id"
                              @click="selectPosition(pos)"
                              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {{ pos.name }}
                            </div>
                          </div>
                          <div 
                            v-if="showPositionDropdown" 
                            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            @click.stop
                          >
                            <div
                              v-for="pos in filteredPositions"
                              :key="pos.id"
                              @click="selectPosition(pos)"
                              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {{ pos.name }}
                            </div>
                            <div v-if="filteredPositions.length === 0" class="px-4 py-2 text-gray-500 text-sm">
                              Ничего не найдено
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Department -->
                      <div>
                        <label for="departmentId" class="block text-sm font-medium text-gray-700 mb-1">Отдел *</label>
                        <div class="relative">
                          <input
                            id="departmentId"
                            v-model="departmentSearch"
                            @focus="onDepartmentFocusOrClick"
                            @click="onDepartmentFocusOrClick"
                            @input="onDepartmentInput"
                            @blur="validateDepartmentInput"
                            type="text"
                            class="input-field pr-10"
                            placeholder="Начните вводить название отдела..."
                            autocomplete="off"
                            :class="[
                              'input-field pr-10',
                              departmentError ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-0' : ''
                            ]"
                          />
                          <!-- Arrow button -->
                          <button
                            type="button"
                            @mousedown="onDepartmentArrowClick"
                            class="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            <svg 
                              class="h-4 w-4 text-gray-400 transition-transform duration-200"
                              :class="{ 'rotate-180': showAllDepartments }"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <!-- Department Dropdowns -->
                          <div 
                            v-if="showAllDepartments" 
                            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            @click.stop
                          >
                            <div
                              v-for="dept in departments"
                              :key="dept.id"
                              @click="selectDepartment(dept)"
                              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {{ dept.name }}
                            </div>
                          </div>
                          <div 
                            v-if="showDepartmentDropdown" 
                            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                            @click.stop
                          >
                            <div
                              v-for="dept in filteredDepartments"
                              :key="dept.id"
                              @click="selectDepartment(dept)"
                              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            >
                              {{ dept.name }}
                            </div>
                            <div v-if="filteredDepartments.length === 0" class="px-4 py-2 text-gray-500 text-sm">
                              Ничего не найдено
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Role -->
                    <div>
                      <label for="roleId" class="block text-sm font-medium text-gray-700 mb-1">Роль *</label>
                      <div class="relative">
                        <select
                          id="roleId"
                          v-model="editForm.roleId"
                          class="input-field pr-10 appearance-none"
                          :class="[
                            'input-field pr-10 appearance-none',
                            roleError ? 'border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-0' : ''
                          ]"
                        >
                          <option value="employee">Сотрудник</option>
                          <option value="manager">Руководитель</option>
                          <option value="admin">Администратор</option>
                        </select>
                        <!-- Arrow button -->
                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg 
                            class="h-4 w-4 text-gray-400"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <!-- Phone -->
                    <div>
                      <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          id="phone"
                          v-model="editForm.phone"
                          type="tel"
                          class="input-field pl-9"
                          placeholder="+7 (999) 123-45-67"
                          autocomplete="off"
                        />
                      </div>
                    </div>

                    <!-- Смена пароля -->
                    <div class="mt-8">
                      <h3 class="text-lg font-semibold text-gray-900 mb-2">Смена пароля</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
                          <input
                            id="newPassword"
                            v-model="passwordForm.newPassword"
                            type="password"
                            class="input-field"
                            placeholder="Введите новый пароль"
                            autocomplete="off"
                          />
                        </div>
                        <div>
                          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Подтвердите новый пароль</label>
                          <input
                            id="confirmPassword"
                            v-model="passwordForm.confirmPassword"
                            type="password"
                            class="input-field"
                            placeholder="Повторите новый пароль"
                            autocomplete="off"
                          />
                        </div>
                      </div>
                      <div v-if="passwordErrorMessages.length" class="bg-red-50 border border-red-200 rounded-lg p-3 mt-2 animate-bounce-in">
                        <ul class="list-disc list-inside text-xs text-red-700">
                          <li v-for="msg in passwordErrorMessages" :key="msg">{{ msg }}</li>
                        </ul>
                      </div>
                    </div>

                    <!-- Error Messages -->
                    <div v-if="Object.keys(errors).length > 0" class="bg-red-50 border border-red-200 rounded-md p-4">
                      <div class="flex">
                        <div class="flex-shrink-0">
                          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                          </svg>
                        </div>
                        <div class="ml-3">
                          <h3 class="text-sm font-medium text-red-800">Ошибки в форме:</h3>
                          <div class="mt-2 text-sm text-red-700">
                            <ul class="list-disc pl-5 space-y-1">
                              <li v-for="(error, field) in errors" :key="field">{{ error }}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Buttons -->
                    <div class="flex gap-2 pt-6 justify-end">
                      <button 
                        type="submit" 
                        class="px-4 py-2 rounded-md bg-[#f7931e] hover:bg-[#ffa940] text-white font-medium text-sm transition"
                      >
                        Сохранить
                      </button>
                      <button 
                        type="button" 
                        @click="editMode = false" 
                        class="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-[#1a3353] font-medium text-sm transition"
                      >
                        Отмена
                      </button>
                  </div>
                  </form>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Подтверждение удаления</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Вы действительно хотите удалить профиль пользователя 
              <span class="font-semibold text-gray-700">
                {{ [userProfile?.middleName, userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(' ') }}
              </span>?
            </p>
            <p class="text-xs text-red-500 mt-2">
              Это действие нельзя отменить. Все данные пользователя будут удалены безвозвратно.
            </p>
          </div>
          <div class="flex justify-center gap-3 mt-4">
            <button
              @click="showDeleteConfirm = false"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              Отмена
            </button>
            <button
              @click="handleDeleteUser"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="deleting">Удаление...</span>
              <span v-else>Удалить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import TheNavbar from '../components/TheNavbar.vue'

const API_URL = import.meta.env.VITE_API_URL
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const userRole = computed(() => authStore.userRole)

const userProfile = ref(null)
const loading = ref(false)
const error = ref(null)
const editMode = ref(false)
const editForm = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  email: '',
  phone: '',
  positionId: null,
  departmentId: null,
  roleId: null
})
const errors = ref({})
const avatarPreview = ref(null)
const avatarName = ref('')

// Delete confirmation state
const showDeleteConfirm = ref(false)
const deleting = ref(false)

// Dropdown states
const showPositionDropdown = ref(false)
const showDepartmentDropdown = ref(false)
const showAllPositions = ref(false)
const showAllDepartments = ref(false)
const positionSearch = ref('')
const departmentSearch = ref('')

// Data for dropdowns
const positions = ref([])
const departments = ref([])

// Computed properties for validation
const firstNameError = computed(() => errors.value.firstName)
const lastNameError = computed(() => errors.value.lastName)
const middleNameError = computed(() => errors.value.middleName)
const emailError = computed(() => errors.value.email)
const positionError = computed(() => errors.value.positionId)
const departmentError = computed(() => errors.value.departmentId)
const roleError = computed(() => errors.value.roleId)

// Filtered dropdowns
const filteredPositions = computed(() => {
  if (!positionSearch.value) return positions.value
  return positions.value.filter(pos => 
    pos.name.toLowerCase().includes(positionSearch.value.toLowerCase())
  )
})

const filteredDepartments = computed(() => {
  if (!departmentSearch.value) return departments.value
  return departments.value.filter(dept => 
    dept.name.toLowerCase().includes(departmentSearch.value.toLowerCase())
  )
})

function formatDate(dateString) {
  if (!dateString) return 'Не указано'
  return new Date(dateString).toLocaleString('ru-RU')
}

function getRoleDisplayName(role) {
  if (role === 'admin') return 'Администратор'
  if (role === 'manager') return 'Руководитель'
  if (role === 'employee') return 'Сотрудник'
  return role || '—'
}

async function fetchUserProfile() {
  try {
    loading.value = true
    error.value = null
    const response = await axios.get(`${API_URL}/users/${route.params.id}`)
    userProfile.value = response.data.user
  } catch (err) {
    console.error('Error fetching user profile:', err)
    if (err.response?.status === 404) {
      error.value = 'Пользователь не найден'
    } else if (err.response?.status === 403) {
      error.value = 'Доступ запрещен'
    } else if (err.response?.status === 401) {
      error.value = 'Необходима авторизация'
    } else {
      error.value = `Ошибка при загрузке профиля пользователя: ${err.response?.data?.error || err.message}`
    }
  } finally {
    loading.value = false
  }
}

function onAvatarSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  
  avatarName.value = file.name
  const reader = new FileReader()
  reader.onload = (ev) => {
    avatarPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function selectPosition(position) {
  editForm.value.positionId = position.id
  positionSearch.value = position.name
  showPositionDropdown.value = false
}

function selectDepartment(department) {
  editForm.value.departmentId = department.id
  departmentSearch.value = department.name
  showDepartmentDropdown.value = false
}

function onPositionFocusOrClick(event) {
  showAllPositions.value = true
  showPositionDropdown.value = false
}

function onPositionInput() {
  showAllPositions.value = false
  showPositionDropdown.value = true
}

function onDepartmentFocusOrClick(event) {
  showAllDepartments.value = true
  showDepartmentDropdown.value = false
}

function onDepartmentInput() {
  showAllDepartments.value = false
  showDepartmentDropdown.value = true
}

function onPositionArrowClick(event) {
  event.preventDefault()
  showAllPositions.value = !showAllPositions.value
  showPositionDropdown.value = false
}

function onDepartmentArrowClick(event) {
  event.preventDefault()
  showAllDepartments.value = !showAllDepartments.value
  showDepartmentDropdown.value = false
}

function validatePositionInput() {
  setTimeout(() => {
    showPositionDropdown.value = false
    showAllPositions.value = false
  }, 200)
}

function validateDepartmentInput() {
  setTimeout(() => {
    showDepartmentDropdown.value = false
    showAllDepartments.value = false
  }, 200)
}

function validateForm() {
  errors.value = {}
  
  if (!editForm.value.firstName?.trim()) {
    errors.value.firstName = 'Обязательное поле'
  } else if (!/^[а-яёА-ЯЁ\s-]{2,}$/.test(editForm.value.firstName.trim())) {
    errors.value.firstName = 'Имя должно содержать только буквы, пробелы и дефисы, минимум 2 символа'
  }
  
  if (!editForm.value.lastName?.trim()) {
    errors.value.lastName = 'Обязательное поле'
  } else if (!/^[а-яёА-ЯЁ\s-]{2,}$/.test(editForm.value.lastName.trim())) {
    errors.value.lastName = 'Фамилия должна содержать только буквы, пробелы и дефисы, минимум 2 символа'
  }
  
  if (!editForm.value.middleName?.trim()) {
    errors.value.middleName = 'Обязательное поле'
  } else if (!/^[а-яёА-ЯЁ\s-]{2,}$/.test(editForm.value.middleName.trim())) {
    errors.value.middleName = 'Отчество должно содержать только буквы, пробелы и дефисы, минимум 2 символа'
  }
  
  if (!editForm.value.email?.trim()) {
    errors.value.email = 'Обязательное поле'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.value.email.trim())) {
    errors.value.email = 'Введите корректный email'
  }
  
  if (!editForm.value.positionId) {
    errors.value.positionId = 'Обязательное поле'
  }
  
  if (!editForm.value.departmentId) {
    errors.value.departmentId = 'Обязательное поле'
  }
  
  if (!editForm.value.roleId) {
    errors.value.roleId = 'Обязательное поле'
  }
  
  return Object.keys(errors.value).length === 0
}

const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
})
const passwordErrorMessages = ref([])

function validatePasswordChange() {
  passwordErrorMessages.value = []
  if (passwordForm.value.newPassword || passwordForm.value.confirmPassword) {
    if (!passwordForm.value.newPassword) {
      passwordErrorMessages.value.push('Введите новый пароль')
    } else if (passwordForm.value.newPassword.length < 6) {
      passwordErrorMessages.value.push('Новый пароль должен содержать минимум 6 символов')
    }
    if (!passwordForm.value.confirmPassword) {
      passwordErrorMessages.value.push('Подтвердите новый пароль')
    }
    if (passwordForm.value.newPassword && passwordForm.value.confirmPassword && passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      passwordErrorMessages.value.push('Пароли не совпадают')
    }
  }
  return passwordErrorMessages.value.length === 0
}

async function handleSave() {
  if (!validateForm()) return
  const isPasswordValid = validatePasswordChange()
  if (!isPasswordValid) return
  
  try {
    const formData = new FormData()
    formData.append('firstName', editForm.value.firstName.trim())
    formData.append('lastName', editForm.value.lastName.trim())
    formData.append('middleName', editForm.value.middleName.trim())
    formData.append('email', editForm.value.email.trim())
    formData.append('phone', editForm.value.phone?.trim() || '')
    formData.append('positionId', editForm.value.positionId)
    formData.append('departmentId', editForm.value.departmentId)
    formData.append('roleName', editForm.value.roleId) // Изменено с roleId на roleName
    
    if (passwordForm.value.newPassword || passwordForm.value.confirmPassword) {
      formData.append('newPassword', passwordForm.value.newPassword)
    }

    if (avatarPreview.value) {
      // Convert base64 to file
      const response = await fetch(avatarPreview.value)
      const blob = await response.blob()
      const file = new File([blob], avatarName.value || 'avatar.jpg', { type: blob.type })
      formData.append('avatar', file)
    }
    
    const token = localStorage.getItem('token')
    await axios.patch(
      `${API_URL}/users/${userProfile.value.id}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    
    // Refresh user profile
    await fetchUserProfile()
    editMode.value = false
    avatarPreview.value = null
    avatarName.value = ''
  } catch (err) {
    console.error('Error updating user profile:', err)
    if (err.response?.data?.error) {
      errors.value.general = err.response.data.error
    } else {
      errors.value.general = 'Ошибка при обновлении профиля'
    }
  }
}

async function fetchPositions() {
  try {
    const response = await axios.get(`${API_URL}/positions`)
    positions.value = response.data.positions
  } catch (err) {
    console.error('Error fetching positions:', err)
  }
}

async function fetchDepartments() {
  try {
    const response = await axios.get(`${API_URL}/departments`)
    departments.value = response.data.departments
  } catch (err) {
    console.error('Error fetching departments:', err)
  }
}

function initializeEditForm() {
  if (userProfile.value) {
    editForm.value = {
      firstName: userProfile.value.firstName || '',
      lastName: userProfile.value.lastName || '',
      middleName: userProfile.value.middleName || '',
      email: userProfile.value.email || '',
      phone: userProfile.value.phone || '',
      positionId: userProfile.value.positionRef?.id || null,
      departmentId: userProfile.value.departmentRef?.id || null,
      roleId: userProfile.value.role?.name || '' // Изменено с role.id на role.name
    }
    
    positionSearch.value = userProfile.value.positionRef?.name || ''
    departmentSearch.value = userProfile.value.departmentRef?.name || ''
  }
}

onMounted(() => {
  fetchUserProfile()
  fetchPositions()
  fetchDepartments()
})

// Watch for userProfile changes to initialize edit form
watch(userProfile, () => {
  if (editMode.value) {
    initializeEditForm()
  }
})

// Watch for editMode changes to initialize form when entering edit mode
watch(editMode, (newValue) => {
  if (newValue && userProfile.value) {
    initializeEditForm()
  }
})

async function handleDeleteUser() {
  try {
    deleting.value = true
    const token = localStorage.getItem('token')
    
    await axios.delete(
      `${API_URL}/users/${userProfile.value.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )
    
    // Перенаправить на страницу администратора
    router.push('/admin')
  } catch (err) {
    console.error('Error deleting user:', err)
    let errorMessage = 'Ошибка при удалении пользователя'
    
    if (err.response?.status === 403) {
      errorMessage = 'Недостаточно прав для удаления пользователя'
    } else if (err.response?.status === 404) {
      errorMessage = 'Пользователь не найден'
    } else if (err.response?.data?.error) {
      errorMessage = err.response.data.error
    }
    
    console.error(errorMessage)
  } finally {
    deleting.value = false
    showDeleteConfirm.value = false
  }
}
</script> 