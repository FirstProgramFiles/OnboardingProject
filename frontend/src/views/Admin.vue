<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f3e8ff] relative overflow-hidden">
    <!-- Фоновое солнышко -->
    <img src="/src/assets/logo-bashrts.svg" alt="" class="pointer-events-none select-none absolute -top-32 -left-32 w-[420px] opacity-10 z-0" />
    <!-- Фоновая волна -->
    <svg class="absolute left-0 bottom-0 w-full h-32 z-0" viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,80 C360,160 1080,0 1440,80 L1440,160 L0,160 Z" fill="#f7931e" fill-opacity="0.08" />
    </svg>
    <TheNavbar />
    <!-- Main content -->
    <div class="py-6 md:py-10 relative z-10">
      <header>
        <div class="max-w-7xl mx-auto px-2 md:px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-extrabold leading-tight text-[#1a3353] mb-2" style="font-family: 'Montserrat', 'Arial', sans-serif;">
            Панель администратора
          </h1>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div class="px-2 md:px-4 py-4 md:py-8">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
              <div class="bg-white rounded-2xl shadow-xl border-2 border-[#f7931e]/30 relative overflow-hidden">
                <div class="p-6 flex flex-col gap-1">
                  <div class="text-xs font-semibold text-[#1a3353]">Всего пользователей</div>
                  <div class="text-2xl font-extrabold text-[#1a3353]">{{ stats.totalUsers || 0 }}</div>
                </div>
              </div>
              <div class="bg-white rounded-2xl shadow-xl border-2 border-[#f7931e]/30 relative overflow-hidden">
                <div class="p-6 flex flex-col gap-1">
                  <div class="text-xs font-semibold text-[#1a3353]">Активные пользователи</div>
                  <div class="text-2xl font-extrabold text-[#1a3353]">{{ stats.activeUsers || 0 }}</div>
                </div>
              </div>
            </div>
            <!-- Users Management -->
            <div class="bg-white shadow-xl rounded-2xl border-2 border-[#f7931e]/30 relative overflow-hidden">
              <!-- Волна-декор -->
              <svg class="absolute left-0 bottom-0 w-full h-8 opacity-10" viewBox="0 0 1440 80" fill="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f7931e" /></svg>
              <div class="px-6 py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 relative z-10">
                <div>
                  <h3 class="text-xl font-extrabold text-[#1a3353] flex items-center gap-2" style="font-family: 'Montserrat', 'Arial', sans-serif;">
                    <svg class="h-6 w-6 text-[#f7931e]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f7931e" opacity=".2"/><path d="M8 12l2 2 4-4" stroke="#f7931e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Управление пользователями
                  </h3>
                  <p class="mt-1 max-w-2xl text-xs text-[#1a3353] opacity-60">Список всех пользователей системы</p>
                </div>
                <router-link
                  to="/register"
                  class="inline-flex items-center px-5 py-2 rounded-lg bg-[#f7931e] hover:bg-[#ffa940] text-white font-semibold text-base shadow transition border-none focus:outline-none focus:ring-2 focus:ring-[#f7931e]/40"
                >
                  <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v12m6-6H6" /></svg>
                  Создать пользователя
                </router-link>
              </div>
              <div class="border-t border-gray-200">
                <div class="px-4 py-5 sm:p-6">
                  <div class="min-h-[620px] flex flex-col justify-between relative">
                    <div v-if="users.length === 0 && !loading" class="text-center py-4">
                      <p class="text-gray-500">Пользователи не найдены</p>
                    </div>
                    <div v-else class="flex flex-col flex-1">
                      <!-- Мобильные карточки пользователей -->
                      <div class="block sm:hidden space-y-4">
                        <div v-for="user in users" :key="user.id" class="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
                          <div class="font-bold text-base text-gray-900">{{ [user.lastName, user.firstName, user.middleName].filter(Boolean).join(' ') }}</div>
                          <div class="text-sm text-gray-500 break-all">{{ user.email }}</div>
                          <div class="flex items-center gap-2">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {{ getRoleDisplayName(user.role?.name) }}
                            </span>
                          </div>
                          <div class="text-xs text-gray-400">Создан: {{ formatDate(user.createdAt) }}</div>
                          <div class="text-xs text-gray-400">Изменён: {{ formatDate(user.updatedAt) }}</div>
                          <div>
                            <button @click="viewProfile(user)" class="text-blue-600 hover:text-blue-900 text-sm font-medium">Профиль</button>
                          </div>
                        </div>
                      </div>
                      <!-- Десктопная таблица -->
                      <div class="overflow-x-auto flex-1 hidden sm:block">
                        <table class="min-w-full divide-y divide-gray-200">
                          <thead class="bg-gray-50">
                            <tr>
                              <!-- <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative overflow-visible align-middle h-10 min-h-10">
                                ID
                              </th> -->
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative overflow-visible align-middle h-10 min-h-10 w-56 min-w-48 max-w-64" :class="{ 'filter-th-active': activeFilter === 'fio' }">
                                <template v-if="activeFilter === 'fio'">
                                  <div class="relative w-full h-10 min-h-10 flex items-center">
                                    <input v-model="tempFilters.fio"
                                      class="w-full h-10 px-2 text-xs bg-transparent border-0 border-b border-gray-300 focus:border-indigo-400 focus:ring-0 placeholder-gray-400 transition-all duration-150 pr-6 py-0 m-0 truncate overflow-hidden whitespace-nowrap"
                                      placeholder="ФИО"
                                      style="box-shadow:none;"
                                      autofocus
                                      @keyup.enter="filters.fio = tempFilters.fio; activeFilter = ''; handleFilterChangeOrSort()"
                                      @blur="filters.fio = tempFilters.fio; activeFilter = ''; handleFilterChangeOrSort()"
                                    />
                                    <span @mousedown.stop @click.stop="clearFilterAndClose('fio'); handleFilterChangeOrSort()"
                                      class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer select-none"
                                      style="font-size: 1rem; line-height: 1;"
                                    >&times;</span>
                                  </div>
                                </template>
                                <template v-else>
                                  <span class="flex items-center gap-1 h-10 min-h-10 select-none w-full truncate overflow-hidden whitespace-nowrap"
                                    :class="{ 'text-indigo-600 font-bold': filters.fio }"
                                  >
                                    <span @mousedown="toggleFilter('fio')" class="cursor-pointer filter-trigger truncate overflow-hidden whitespace-nowrap w-full">
                                      <template v-if="filters.fio">
                                        ФИО: {{ filters.fio }}
                                      </template>
                                      <template v-else>
                                        ФИО
                                      </template>
                                    </span>
                                    <span @mousedown="toggleFilter('fio')" class="cursor-pointer flex items-center filter-trigger">
                                      <svg class="w-3.5 h-3.5 text-gray-400 ml-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="7" stroke-width="2"/>
                                        <path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                                      </svg>
                                    </span>
                                    <span v-if="filters.fio" @click="clearFilterAndClose('fio'); handleFilterChangeOrSort()" class="ml-1 text-indigo-600 cursor-pointer">&times;</span>
                                  </span>
                                </template>
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative overflow-visible align-middle h-10 min-h-10 w-56 min-w-48 max-w-64" :class="{ 'filter-th-active': activeFilter === 'email' }">
                                <template v-if="activeFilter === 'email'">
                                  <div class="relative w-full h-10 min-h-10 flex items-center">
                                    <input v-model="tempFilters.email"
                                      class="w-full h-10 px-2 text-xs bg-transparent border-0 border-b border-gray-300 focus:border-indigo-400 focus:ring-0 placeholder-gray-400 transition-all duration-150 pr-6 py-0 m-0 truncate overflow-hidden whitespace-nowrap"
                                      placeholder="Email"
                                      style="box-shadow:none;"
                                      autofocus
                                      @keyup.enter="filters.email = tempFilters.email; activeFilter = ''; handleFilterChangeOrSort()"
                                      @blur="filters.email = tempFilters.email; activeFilter = ''; handleFilterChangeOrSort()"
                                    />
                                    <span @mousedown.stop @click.stop="clearFilterAndClose('email'); handleFilterChangeOrSort()"
                                      class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer select-none"
                                      style="font-size: 1rem; line-height: 1;"
                                    >&times;</span>
                                  </div>
                                </template>
                                <template v-else>
                                  <span class="flex items-center gap-1 h-10 min-h-10 select-none w-full truncate overflow-hidden whitespace-nowrap"
                                    :class="{ 'text-indigo-600 font-bold': filters.email }"
                                  >
                                    <span @mousedown="toggleFilter('email')" class="cursor-pointer filter-trigger truncate overflow-hidden whitespace-nowrap w-full">
                                      <template v-if="filters.email">
                                        Email: {{ filters.email }}
                                      </template>
                                      <template v-else>
                                        Email
                                      </template>
                                    </span>
                                    <span @mousedown="toggleFilter('email')" class="cursor-pointer flex items-center filter-trigger">
                                      <svg class="w-3.5 h-3.5 text-gray-400 ml-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="7" stroke-width="2"/>
                                        <path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                                      </svg>
                                    </span>
                                    <span v-if="filters.email" @click="clearFilterAndClose('email'); handleFilterChangeOrSort()" class="ml-1 text-indigo-600 cursor-pointer">&times;</span>
                                  </span>
                                </template>
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative overflow-visible align-middle h-10 min-h-10 w-32 min-w-28 max-w-40" :class="{ 'filter-th-active': activeFilter === 'role' }">
                                <template v-if="activeFilter === 'role'">
                                  <div class="h-10 min-h-10 flex items-center">
                                    <select v-model="tempFilters.role"
                                      class="w-full h-10 px-2 text-xs bg-transparent border-0 border-b border-gray-300 focus:border-indigo-400 focus:ring-0 transition-all duration-150 py-0 m-0 truncate overflow-hidden whitespace-nowrap"
                                      @change="filters.role = tempFilters.role; activeFilter = ''; handleFilterChangeOrSort()"
                                      autofocus
                                    >
                                      <option value="">Все</option>
                                      <option value="admin">Администратор</option>
                                      <option value="manager">Руководитель</option>
                                      <option value="employee">Сотрудник</option>
                                    </select>
                                  </div>
                                </template>
                                <template v-else>
                                  <span class="flex items-center gap-1 h-10 min-h-10 select-none w-full truncate overflow-hidden whitespace-nowrap"
                                    :class="{ 'text-indigo-600 font-bold': filters.role }"
                                  >
                                    <span @mousedown="toggleFilter('role')" class="cursor-pointer flex items-center filter-trigger truncate overflow-hidden whitespace-nowrap w-full">
                                      <template v-if="filters.role">
                                        Роль: {{ getRoleDisplayName(filters.role) }}
                                      </template>
                                      <template v-else>
                                        Роль
                                      </template>
                                    </span>
                                    <span @mousedown="toggleFilter('role')" class="cursor-pointer flex items-center filter-trigger">
                                      <svg class="w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </span>
                                    <span v-if="filters.role" @click="clearFilterAndClose('role'); handleFilterChangeOrSort()" class="ml-1 text-indigo-600 cursor-pointer">&times;</span>
                                  </span>
                                </template>
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative overflow-visible align-middle h-10 min-h-10 w-40 min-w-32 max-w-48" :class="{ 'filter-th-active': activeFilter === 'createdAt' }">
                                <template v-if="activeFilter === 'createdAt'">
                                  <div class="relative w-full h-10 min-h-10 flex items-center">
                                    <input type="date" v-model="tempFilters.createdAt"
                                      class="w-full h-10 px-2 text-xs bg-transparent border-0 border-b border-gray-300 focus:border-indigo-400 focus:ring-0 placeholder-gray-400 transition-all duration-150 pr-6 py-0 m-0 truncate overflow-hidden whitespace-nowrap"
                                      @keyup.enter="filters.createdAt = tempFilters.createdAt; activeFilter = ''; handleFilterChangeOrSort()"
                                      @blur="filters.createdAt = tempFilters.createdAt; activeFilter = ''; handleFilterChangeOrSort()"
                                      autofocus
                                    />
                                    <span @mousedown.stop @click.stop="clearFilterAndClose('createdAt'); handleFilterChangeOrSort()"
                                      class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer select-none"
                                      style="font-size: 1rem; line-height: 1;"
                                    >&times;</span>
                                  </div>
                                </template>
                                <template v-else>
                                  <span class="flex items-center gap-1 h-10 min-h-10 select-none w-full truncate overflow-hidden whitespace-nowrap"
                                    :class="{ 'text-indigo-600 font-bold': filters.createdAt }"
                                  >
                                    <span @mousedown="toggleFilter('createdAt')" class="cursor-pointer filter-trigger truncate overflow-hidden whitespace-nowrap w-full">
                                      <template v-if="filters.createdAt">
                                        Дата создания: {{ filters.createdAt }}
                                      </template>
                                      <template v-else>
                                        Дата создания
                                      </template>
                                    </span>
                                    <span @mousedown="toggleFilter('createdAt')" class="cursor-pointer flex items-center filter-trigger">
                                      <svg class="w-3.5 h-3.5 text-gray-400 ml-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="7" stroke-width="2"/>
                                        <path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                                      </svg>
                                    </span>
                                    <span v-if="filters.createdAt" @click="clearFilterAndClose('createdAt'); handleFilterChangeOrSort()" class="ml-1 text-indigo-600 cursor-pointer">&times;</span>
                                    <button @click="toggleSort('createdAt'); handleFilterChangeOrSort()" :class="{'text-indigo-600': sortOrder.column === 'createdAt', 'text-gray-400': sortOrder.column !== 'createdAt'}" class="ml-1 cursor-pointer text-base leading-none">⇵</button>
                                  </span>
                                </template>
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative overflow-visible align-middle h-10 min-h-10 w-40 min-w-32 max-w-48" :class="{ 'filter-th-active': activeFilter === 'updatedAt' }">
                                <template v-if="activeFilter === 'updatedAt'">
                                  <div class="relative w-full h-10 min-h-10 flex items-center">
                                    <input type="date" v-model="tempFilters.updatedAt"
                                      class="w-full h-10 px-2 text-xs bg-transparent border-0 border-b border-gray-300 focus:border-indigo-400 focus:ring-0 placeholder-gray-400 transition-all duration-150 pr-6 py-0 m-0 truncate overflow-hidden whitespace-nowrap"
                                      @keyup.enter="filters.updatedAt = tempFilters.updatedAt; activeFilter = ''; handleFilterChangeOrSort()"
                                      @blur="filters.updatedAt = tempFilters.updatedAt; activeFilter = ''; handleFilterChangeOrSort()"
                                      autofocus
                                    />
                                    <span @mousedown.stop @click.stop="clearFilterAndClose('updatedAt'); handleFilterChangeOrSort()"
                                      class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer select-none"
                                      style="font-size: 1rem; line-height: 1;"
                                    >&times;</span>
                                  </div>
                                </template>
                                <template v-else>
                                  <span class="flex items-center gap-1 h-10 min-h-10 select-none w-full truncate overflow-hidden whitespace-nowrap"
                                    :class="{ 'text-indigo-600 font-bold': filters.updatedAt }"
                                  >
                                    <span @mousedown="toggleFilter('updatedAt')" class="cursor-pointer filter-trigger truncate overflow-hidden whitespace-nowrap w-full">
                                      <template v-if="filters.updatedAt">
                                        Дата изменения: {{ filters.updatedAt }}
                                      </template>
                                      <template v-else>
                                        Дата изменения
                                      </template>
                                    </span>
                                    <span @mousedown="toggleFilter('updatedAt')" class="cursor-pointer flex items-center filter-trigger">
                                      <svg class="w-3.5 h-3.5 text-gray-400 ml-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="7" stroke-width="2"/>
                                        <path stroke-linecap="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                                      </svg>
                                    </span>
                                    <span v-if="filters.updatedAt" @click="clearFilterAndClose('updatedAt'); handleFilterChangeOrSort()" class="ml-1 text-indigo-600 cursor-pointer">&times;</span>
                                    <button @click="toggleSort('updatedAt'); handleFilterChangeOrSort()" :class="{'text-indigo-600': sortOrder.column === 'updatedAt', 'text-gray-400': sortOrder.column !== 'updatedAt'}" class="ml-1 cursor-pointer text-base leading-none">⇵</button>
                                  </span>
                                </template>
                              </th>
                              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28 min-w-24 max-w-32"></th>
                            </tr>
                          </thead>
                          <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="user in users" :key="user.id">
                              <!-- <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.id }}</td> -->
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 w-56 min-w-48 max-w-64">{{ [user.lastName, user.firstName, user.middleName].filter(Boolean).join(' ') }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 w-56 min-w-48 max-w-64">{{ user.email }}</td>
                              <td class="px-4 py-2 whitespace-nowrap">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {{ getRoleDisplayName(user.role?.name) }}
                                </span>
                              </td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 w-40 min-w-32 max-w-48">{{ formatDate(user.createdAt) }}</td>
                              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 w-40 min-w-32 max-w-48">{{ formatDate(user.updatedAt) }}</td>
                              <td class="px-2 py-2 whitespace-nowrap text-xs font-medium w-28 min-w-24 max-w-32">
                                <button @click="viewProfile(user)" class="text-blue-600 hover:text-blue-900">Профиль</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!-- Оверлей загрузки -->
                        <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10 transition-opacity">
                          <span class="text-gray-500 text-base">Загрузка пользователей...</span>
                        </div>
                      </div>
                      <div v-if="pageCount > 1" class="flex justify-center mt-6 mb-4">
                        <button type="button"
                          class="px-3 py-1 mx-1 rounded border text-sm bg-white text-gray-700 active:bg-indigo-600 active:text-white transition-colors duration-100"
                          :disabled="page === 1"
                          @click="goToPage(page - 1)"
                        >
                          Назад
                        </button>
                        <button type="button"
                          v-for="p in pageCount"
                          :key="p"
                          class="px-3 py-1 mx-1 rounded border text-sm"
                          :class="{ 'bg-indigo-600 text-white': page === p, 'bg-white text-gray-700': page !== p }"
                          @click="goToPage(p)"
                        >
                          {{ p }}
                        </button>
                        <button type="button"
                          class="px-3 py-1 mx-1 rounded border text-sm bg-white text-gray-700 active:bg-indigo-600 active:text-white transition-colors duration-100"
                          :disabled="page === pageCount"
                          @click="goToPage(page + 1)"
                        >
                          Вперёд
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import TheNavbar from '../components/TheNavbar.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const userRole = computed(() => authStore.userRole)

const users = ref([])
const totalUsers = ref(0)
const page = ref(1)
const limit = 10
const pageCount = computed(() => Math.ceil(totalUsers.value / limit))

const stats = ref({})
const loading = ref(false)
const filters = reactive({ fio: '', email: '', role: '', createdAt: '', updatedAt: '' })
const activeFilter = ref('')
const tempFilters = reactive({ fio: '', email: '', role: '', createdAt: '', updatedAt: '' })
const sortOrder = reactive({ column: null, ascending: true });

const API_URL = import.meta.env.VITE_API_URL

function formatDate(dateString) {
  if (!dateString) return 'Не указано'
  return new Date(dateString).toLocaleString('ru-RU')
}

async function fetchUsers() {
  try {
    loading.value = true
    const params = {
      page: page.value,
      limit,
      fio: filters.fio || undefined,
      email: filters.email || undefined,
      role: filters.role || undefined,
      createdAt: filters.createdAt || undefined,
      updatedAt: filters.updatedAt || undefined,
      sortBy: sortOrder.column || undefined,
      sortOrder: sortOrder.ascending ? 'asc' : 'desc',
    };
    const response = await axios.get(`${API_URL}/users`, { params });
    users.value = response.data.users;
    totalUsers.value = response.data.total;
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}



async function fetchStats() {
  try {
    const response = await axios.get(`${API_URL}/admin/stats`)
    stats.value = response.data
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

function editUser(user) {
  // TODO: Implement user editing
  console.log('Edit user:', user)
}

async function deleteUser(user) {
  if (confirm(`Удалить пользователя ${user.email}?`)) {
    try {
      await axios.delete(`${API_URL}/users/${user.id}`)
      users.value = users.value.filter(u => u.id !== user.id)
    } catch (e) {
      alert('Ошибка при удалении пользователя')
    }
  }
}



// filteredUsers и sortedUsers больше не нужны, users приходит уже отфильтрованный и отсортированный с сервера

function getRoleDisplayName(role) {
  if (role === 'admin') return 'Администратор'
  if (role === 'manager') return 'Руководитель'
  if (role === 'employee') return 'Сотрудник'
  return role || '—'
}

function viewProfile(user) {
  router.push(`/profile/${user.id}`)
}

function toggleFilter(name) {
  if (activeFilter.value === name) {
    // Закрываем фильтр
    activeFilter.value = ''
  } else {
    // Открываем фильтр и копируем текущие значения во временные
    activeFilter.value = name
    tempFilters[name] = filters[name]
  }
}

function clearFilterAndClose(name) {
  filters[name] = ''
  tempFilters[name] = ''
  activeFilter.value = ''
}

function closeFilterPopover(name) {
  // Применяем временное значение к основному фильтру
  filters[name] = tempFilters[name]
  activeFilter.value = ''
}

function handleFilterInput(name, event) {
  if (event.key === 'Enter') {
    // Применяем значение при нажатии Enter
    filters[name] = tempFilters[name]
    activeFilter.value = ''
  }
}

function handleFilterBlur(name) {
  // Применяем значение при потере фокуса
  filters[name] = tempFilters[name]
  activeFilter.value = ''
}

function handleFilterChange(name) {
  // Для select применяем значение сразу при изменении
  filters[name] = tempFilters[name]
  activeFilter.value = ''
}

function handleClickOutside(event) {
  // Если клик внутри th с активным фильтром — не закрываем
  const th = document.querySelector('.filter-th-active')
  if (th && th.contains(event.target)) return
  activeFilter.value = ''
}

function toggleSort(column) {
  if (sortOrder.column !== column) {
    sortOrder.column = column;
    sortOrder.ascending = false; // Первый клик — по убыванию
  } else if (!sortOrder.ascending) {
    sortOrder.ascending = true; // Второй клик — по возрастанию
  } else {
    sortOrder.column = null; // Третий клик — сброс
    sortOrder.ascending = true;
  }
}

function goToPage(p) {
  if (p < 1 || p > pageCount.value) return
  page.value = p
  fetchUsers()
}

function handleFilterChangeOrSort() {
  page.value = 1;
  fetchUsers();
}

onMounted(() => {
  fetchUsers()
  fetchStats()
})

onUnmounted(() => {
  // document.removeEventListener('click', handleClickOutside)
})
</script> 