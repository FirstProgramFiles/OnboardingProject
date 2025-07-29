<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f3e8ff] flex items-center justify-center p-2 md:p-4">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-6 animate-fade-in">
        <div class="mx-auto w-12 h-12 bg-[#f7931e] rounded-xl flex items-center justify-center mb-3 shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h1 class="text-2xl font-extrabold text-[#1a3353] mb-1" style="font-family: 'Montserrat', 'Arial', sans-serif;">Создать нового пользователя</h1>
        <p class="text-[#1a3353] opacity-60 text-sm">Административная панель создания пользователей</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-xl shadow-md p-4 md:p-6 border border-[#f3e8ff] animate-slide-up">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-gray-900">Информация о пользователе</h2>
          <p class="text-sm text-gray-600 mt-1">Заполните все поля для создания нового аккаунта</p>
        </div>
        <div class="card-body">
          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Personal Information Section -->
            <div class="flex flex-col md:flex-row gap-4 items-start">
              <!-- Avatar Upload -->
              <div class="flex flex-col items-center md:w-1/4 w-full">
                <label class="block text-sm font-medium text-gray-700 mb-1 text-center">Аватар (опционально)</label>
                <div class="relative w-20 h-20 mb-2 flex justify-center items-center">
                  <img v-if="avatarPreview" :src="avatarPreview" class="w-20 h-20 rounded-full object-cover border border-gray-200" />
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
                      v-model="firstName"
                      type="text"
                      class="input-field pl-9"
                      placeholder="Иван"
                      :class="[
                        'input-field pl-9',
                        firstNameError ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : 'focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0'
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
                      v-model="lastName"
                      type="text"
                      class="input-field pl-9"
                      placeholder="Иванов"
                      :class="[
                        'input-field pl-9',
                        lastNameError ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : 'focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0'
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
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="middleName"
                      v-model="middleName"
                      type="text"
                      class="input-field pl-9"
                      placeholder="Иванович"
                      autocomplete="off"
                      :class="[
                        'input-field pl-9',
                        middleNameError ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : 'focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0'
                      ]"
                    />
                  </div>
                </div>
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
                    @focus="showPositionDropdown = true"
                    @click="showPositionDropdown = true"
                    @input="showPositionDropdown = true"
                    @blur="validatePositionInput"
                    type="text"
                    class="input-field pr-10"
                    placeholder="Начните вводить название должности..."
                    autocomplete="off"
                    :class="[
                      'input-field pr-10',
                      positionError ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : 'focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0'
                    ]"
                  />
                  <!-- Arrow button -->
                  <button
                    type="button"
                    @click="togglePositionDropdown($event)"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg 
                      class="h-4 w-4 text-gray-400 transition-transform duration-200"
                      :class="{ 'rotate-180': showPositionDropdown }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <!-- Dropdown -->
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
                    @focus="showDepartmentDropdown = true"
                    @click="showDepartmentDropdown = true"
                    @input="showDepartmentDropdown = true"
                    @blur="validateDepartmentInput"
                    type="text"
                    class="input-field pr-10"
                    placeholder="Начните вводить название отдела..."
                    autocomplete="off"
                    :class="[
                      'input-field pr-10',
                      departmentError ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : 'focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0'
                    ]"
                  />
                  <!-- Arrow button -->
                  <button
                    type="button"
                    @click="toggleDepartmentDropdown($event)"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg 
                      class="h-4 w-4 text-gray-400 transition-transform duration-200"
                      :class="{ 'rotate-180': showDepartmentDropdown }"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <!-- Dropdown -->
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

            <!-- Contact Information Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Email Field -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    v-model="email"
                    type="text"
                    class="input-field pl-9"
                    placeholder="user@example.com"
                    autocomplete="off"
                    :class="[
                      'input-field pl-9',
                      (emailError || emailInvalidError) ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : ''
                    ]"
                  />
                </div>
              </div>

              <!-- Phone -->
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    id="phone"
                    :value="phone"
                    type="text"
                    class="input-field pl-9"
                    placeholder="+7 (999) 123-45-67"
                    autocomplete="off"
                    @input="onPhoneInput"
                    @keypress="onPhoneKeyPress"
                    maxlength="18"
                  />
                </div>
              </div>
            </div>

            <!-- Password Section -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Password Field -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Пароль *</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="input-field pl-9"
                    placeholder="Минимум 6 символов"
                    :class="[
                      'input-field pl-9',
                      passwordError ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : ''
                    ]"
                    autocomplete="new-password"
                  />
                </div>
                <p class="mt-1 text-xs text-gray-500">Пароль должен содержать минимум 6 символов</p>
              </div>

              <!-- Confirm Password Field -->
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Подтвердите пароль *</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    class="input-field pl-9"
                    placeholder="Повторите пароль"
                    :class="[
                      'input-field pl-9',
                      confirmPasswordError ? 'border-[#f7931e] focus:border-[#f7931e] focus:ring-[#f7931e] focus:ring-0' : ''
                    ]"
                    autocomplete="new-password"
                  />
                </div>
              </div>
            </div>

            <!-- Role Selection -->
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Роль пользователя</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <select
                  id="role"
                  v-model="role"
                  class="input-field pl-9"
                >
                  <option value="employee">Сотрудник</option>
                  <option value="manager">Руководитель</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-3 animate-bounce-in">
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
            <div v-if="fioErrorMessages.length" class="bg-red-50 border border-red-200 rounded-lg p-3 animate-bounce-in mb-2">
              <ul class="list-disc list-inside text-xs text-red-700">
                <li v-for="msg in fioErrorMessages" :key="msg">{{ msg }}</li>
              </ul>
            </div>
            <div v-if="passwordErrorMessages.length" class="bg-red-50 border border-red-200 rounded-lg p-3 animate-bounce-in mb-2">
              <ul class="list-disc list-inside text-xs text-red-700">
                <li v-for="msg in passwordErrorMessages" :key="msg">{{ msg }}</li>
              </ul>
            </div>
            <div v-if="emailInvalidError && email" class="bg-red-50 border border-red-200 rounded-lg p-3 animate-bounce-in mb-2">
              <p class="text-xs text-red-700">Введите корректный email (например, user@example.com)</p>
            </div>
            <div v-if="emailErrorMessages.length" class="bg-red-50 border border-red-200 rounded-lg p-3 animate-bounce-in mb-2">
              <ul class="list-disc list-inside text-xs text-red-700">
                <li v-for="msg in emailErrorMessages" :key="msg">{{ msg }}</li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <router-link
                to="/admin"
                class="btn-secondary flex-1 justify-center"
              >
                Отмена
              </router-link>
              <button
                type="submit"
                :disabled="loading"
                class="btn-primary flex-1 justify-center"
              >
                <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-if="loading">Создание...</span>
                <span v-else>Создать</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const middleName = ref('')
const positionId = ref('')
const departmentId = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('employee')
const error = ref('')
const loading = ref(false)

const positions = ref([])
const departments = ref([])

// Search states
const positionSearch = ref('')
const departmentSearch = ref('')
const showPositionDropdown = ref(false)
const showDepartmentDropdown = ref(false)

const avatarFile = ref(null)
const avatarPreview = ref(null)
const avatarName = ref('')

const rawPhone = ref('7')

const fioPattern = /^[А-Яа-яA-Za-zЁё\-\s]{2,}$/
const firstNameError = ref(false)
const lastNameError = ref(false)
const middleNameError = ref(false)
const fioErrorMessages = ref([])
const passwordErrorMessages = ref([])
const passwordError = ref(false)
const confirmPasswordError = ref(false)
const positionError = ref(false)
const departmentError = ref(false)
const emailError = ref(false)
const emailInvalidError = ref(false)
const emailErrorMessages = ref([])
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const firstNameEmptyError = ref(false)
const lastNameEmptyError = ref(false)
const middleNameEmptyError = ref(false)
const positionEmptyError = ref(false)
const departmentEmptyError = ref(false)
const emailEmptyError = ref(false)
const passwordEmptyError = ref(false)
const confirmPasswordEmptyError = ref(false)

// watchers для сброса ошибок при вводе
watch(firstName, val => { if (val) { firstNameError.value = false; firstNameEmptyError.value = false } })
watch(lastName, val => { if (val) { lastNameError.value = false; lastNameEmptyError.value = false } })
watch(middleName, val => { if (val) { middleNameError.value = false; middleNameEmptyError.value = false } })
watch(positionId, val => { if (val) { positionError.value = false; positionEmptyError.value = false } })
watch(departmentId, val => { if (val) { departmentError.value = false; departmentEmptyError.value = false } })
watch(email, val => { if (val) { emailError.value = false; emailEmptyError.value = false; emailInvalidError.value = false; emailErrorMessages.value = [] } })
watch(password, val => { if (val) { passwordError.value = false; passwordEmptyError.value = false } })
watch(confirmPassword, val => { if (val) { confirmPasswordError.value = false; confirmPasswordEmptyError.value = false } })

function onAvatarSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  avatarFile.value = file
  avatarName.value = file.name
  const reader = new FileReader()
  reader.onload = (ev) => {
    avatarPreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function onPhoneInput(e) {
  let digits = e.target.value.replace(/\D/g, '')
  // +7 всегда остаётся
  if (!digits || digits === '7') {
    rawPhone.value = '7'
    phone.value = '+7'
    setTimeout(() => {
      e.target.setSelectionRange(phone.value.length, phone.value.length)
    }, 0)
    return
  }
  // Если пользователь начал с 8 — заменить на 7
  if (digits.startsWith('8')) digits = '7' + digits.slice(1)
  if (!digits.startsWith('7')) digits = '7' + digits
  digits = digits.slice(0, 11)
  rawPhone.value = digits

  let formatted = '+7'
  if (digits.length > 1) formatted += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) formatted += ') '
  if (digits.length >= 4) formatted += digits.slice(4, 7)
  if (digits.length >= 7) formatted += '-' + digits.slice(7, 9)
  if (digits.length >= 9) formatted += '-' + digits.slice(9, 11)
  phone.value = formatted
  setTimeout(() => {
    e.target.setSelectionRange(phone.value.length, phone.value.length)
  }, 0)
}

function onPhoneKeyPress(e) {
  // Разрешаем только цифры и управляющие клавиши
  if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    e.preventDefault()
  }
}

// Computed properties for filtering
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

// Methods for selection
const selectPosition = (position) => {
  positionId.value = position.id
  positionSearch.value = position.name
  showPositionDropdown.value = false
}

const selectDepartment = (department) => {
  if (department) {
    departmentId.value = department.id
    departmentSearch.value = department.name
  } else {
    departmentId.value = ''
    departmentSearch.value = ''
  }
  showDepartmentDropdown.value = false
}

// Toggle methods
const togglePositionDropdown = (event) => {
  event.stopPropagation()
  showPositionDropdown.value = !showPositionDropdown.value
  showDepartmentDropdown.value = false
}

const toggleDepartmentDropdown = (event) => {
  event.stopPropagation()
  showDepartmentDropdown.value = !showDepartmentDropdown.value
  showPositionDropdown.value = false
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  const positionContainer = document.getElementById('positionId')?.closest('.relative')
  const departmentContainer = document.getElementById('departmentId')?.closest('.relative')
  
  if (positionContainer && !positionContainer.contains(event.target)) {
    showPositionDropdown.value = false
  }
  
  if (departmentContainer && !departmentContainer.contains(event.target)) {
    showDepartmentDropdown.value = false
  }
}

function validatePositionInput() {
  const found = positions.value.find(pos => pos.name === positionSearch.value)
  if (!found) {
    positionId.value = ''
    positionSearch.value = ''
    // Не показываем ошибку, просто сбрасываем
  } else {
    positionId.value = found.id
    // Не трогаем error
  }
}

function validateDepartmentInput() {
  const found = departments.value.find(dept => dept.name === departmentSearch.value)
  if (!found) {
    departmentId.value = ''
    departmentSearch.value = ''
    // Не показываем ошибку, просто сбрасываем
  } else {
    departmentId.value = found.id
    // Не трогаем error
  }
}

onMounted(async () => {
  try {
    const [positionsRes, departmentsRes] = await Promise.all([
      axios.get(`${API_URL}/positions`),
      axios.get(`${API_URL}/departments`)
    ])
    positions.value = positionsRes.data.positions
    departments.value = departmentsRes.data.departments
  } catch (e) {
    error.value = 'Ошибка загрузки справочников. Попробуйте позже.'
  }
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Remove click outside listener
  document.removeEventListener('click', handleClickOutside)
})

async function handleRegister() {
  firstNameError.value = false
  lastNameError.value = false
  middleNameError.value = false
  fioErrorMessages.value = []
  passwordErrorMessages.value = []
  passwordError.value = false
  confirmPasswordError.value = false
  positionError.value = false
  departmentError.value = false
  emailError.value = false
  emailInvalidError.value = false
  emailErrorMessages.value = []
  firstNameEmptyError.value = false
  lastNameEmptyError.value = false
  middleNameEmptyError.value = false
  positionEmptyError.value = false
  departmentEmptyError.value = false
  emailEmptyError.value = false
  passwordEmptyError.value = false
  confirmPasswordEmptyError.value = false

  let hasError = false

  // Required fields validation (подсветка)
  if (!firstName.value) { firstNameError.value = true; firstNameEmptyError.value = true; hasError = true; }
  if (!lastName.value) { lastNameError.value = true; lastNameEmptyError.value = true; hasError = true; }
  if (!middleName.value) { middleNameError.value = true; middleNameEmptyError.value = true; hasError = true; }
  if (!positionId.value) { positionError.value = true; positionEmptyError.value = true; hasError = true; }
  if (!departmentId.value) { departmentError.value = true; departmentEmptyError.value = true; hasError = true; }
  if (!email.value) { emailError.value = true; emailEmptyError.value = true; hasError = true; }
  if (email.value && !emailPattern.test(email.value)) {
    emailError.value = true;
    emailInvalidError.value = true;
    hasError = true;
    emailEmptyError.value = false;
  }
  if (!password.value) { passwordError.value = true; passwordEmptyError.value = true; hasError = true; }
  if (!confirmPassword.value) { confirmPasswordError.value = true; confirmPasswordEmptyError.value = true; hasError = true; }

  // FIO validation
  const fioErrors = []
  if (firstName.value && !fioPattern.test(firstName.value)) {
    firstNameError.value = true
    fioErrors.push('Имя')
    fioErrorMessages.value.push('Имя должно содержать только буквы, дефис или пробел и быть не короче 2 символов')
    hasError = true
    firstNameEmptyError.value = false
  }
  if (lastName.value && !fioPattern.test(lastName.value)) {
    lastNameError.value = true
    fioErrors.push('Фамилия')
    fioErrorMessages.value.push('Фамилия должна содержать только буквы, дефис или пробел и быть не короче 2 символов')
    hasError = true
    lastNameEmptyError.value = false
  }
  if (middleName.value && !fioPattern.test(middleName.value)) {
    middleNameError.value = true
    fioErrors.push('Отчество')
    fioErrorMessages.value.push('Отчество должно содержать только буквы, дефис или пробел и быть не короче 2 символов')
    hasError = true
    middleNameEmptyError.value = false
  }

  // Password validation
  if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
    passwordError.value = true
    confirmPasswordError.value = true
    passwordErrorMessages.value.push('Пароли не совпадают')
    hasError = true
    passwordEmptyError.value = false
    confirmPasswordEmptyError.value = false
  }
  if (password.value && password.value.length < 6) {
    passwordError.value = true
    passwordErrorMessages.value.push('Пароль должен содержать минимум 6 символов')
    hasError = true
    passwordEmptyError.value = false
  }

  if (hasError) {
    error.value = ''
    return
  }

  loading.value = true
  error.value = ''

  let result
  if (avatarFile.value) {
    // Отправка с аватаром через FormData
    const formData = new FormData()
    formData.append('email', email.value)
    formData.append('password', password.value)
    formData.append('firstName', firstName.value)
    formData.append('lastName', lastName.value)
    formData.append('middleName', middleName.value)
    formData.append('positionId', positionId.value)
    formData.append('departmentId', departmentId.value || '')
    formData.append('phone', phone.value)
    formData.append('roleName', role.value)
    formData.append('avatar', avatarFile.value)
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      result = { success: true }
    } catch (error_) {
      result = { success: false, error: error_.response?.data?.error || 'Registration failed' }
    }
  } else {
    // Без аватара — старый способ
    result = await authStore.register({
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value,
      middleName: middleName.value,
      positionId: positionId.value,
      departmentId: departmentId.value || null,
      phone: phone.value,
      roleName: role.value
    })
  }

  if (result.success) {
    error.value = ''
    firstName.value = ''
    lastName.value = ''
    middleName.value = ''
    positionId.value = ''
    departmentId.value = ''
    positionSearch.value = ''
    departmentSearch.value = ''
    email.value = ''
    phone.value = ''
    password.value = ''
    confirmPassword.value = ''
    role.value = 'employee'
    avatarFile.value = null
    avatarPreview.value = null
    avatarName.value = ''
    router.push('/admin')
  } else {
    error.value = result.error
  }

  loading.value = false
}

// computed для ошибки несовпадения паролей
const passwordMismatch = computed(() => error.value === 'Пароли не совпадают')
</script> 