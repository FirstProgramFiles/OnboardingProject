import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const isProfileLoading = ref(false)

  // Computed
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role?.name || null)
  const hasSeenWelcome = computed(() => user.value?.hasSeenWelcome)

  // Actions
  async function login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })

      const { user: userData, token: tokenData } = response.data
      
      user.value = userData
      token.value = tokenData
      
      localStorage.setItem('token', tokenData)
      
      // Set default authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error === 'Invalid email or password' ? 'Неверный email или пароль' : (error.response?.data?.error || 'Ошибка входа') 
      }
    }
  }

  async function register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)

      // For admin registration, we don't want to log in as the created user
      // Just return success without setting auth state
      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  async function logout() {
    // Очищаем состояние пользователя
    user.value = null
    token.value = null
    
    // Очищаем localStorage
    localStorage.removeItem('token')
    
    // Удаляем заголовок авторизации
    delete axios.defaults.headers.common['Authorization']
    
    // Принудительно очищаем кэш браузера для аватаров
    if (typeof window !== 'undefined') {
      // Очищаем все объекты URL, созданные для аватаров
      const urls = Object.keys(window.URL.createObjectURL.cache || {})
      urls.forEach(url => {
        try {
          window.URL.revokeObjectURL(url)
        } catch (e) {
          // Игнорируем ошибки при очистке
        }
      })
    }
  }

  async function fetchProfile() {
    if (!token.value) return { success: false }
    
    try {
      isProfileLoading.value = true
      const response = await axios.get(`${API_URL}/auth/profile`)
      user.value = response.data.user
      return { success: true }
    } catch (error) {
      console.error('Fetch profile error:', error)
      // If token is invalid, clear auth state
      if (error.response?.status === 401) {
        await logout()
      }
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to fetch profile' 
      }
    } finally {
      isProfileLoading.value = false
    }
  }

  // Initialize auth state on app start
  async function initializeAuth() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      await fetchProfile()
    }
  }

  return {
    // State
    user,
    token,
    isProfileLoading,
    
    // Computed
    isAuthenticated,
    userRole,
    hasSeenWelcome,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    initializeAuth
  }
}) 