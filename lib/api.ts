import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: async (data: { username: string; email: string; password: string; phonenumber: string }) => {
    return apiClient.post('/api/users/register', data)
  },

  login: async (data: { email: string; password: string }) => {
    return apiClient.post('/api/users/login', data)
  },

  logout: async () => {
    localStorage.removeItem('token')
  },
}

export const usersAPI = {
  updateProfile: async (data: { username?: string; email?: string; phonenumber?: string; currentPassword?: string; newPassword?: string }) => {
    return apiClient.put('/api/users/profile', data)
  },
  getAll: async () => {
    return apiClient.get('/api/users/get')
  },
  getById: async (id: string) => {
    return apiClient.get(`/api/users/get/${id}`)
  },
  update: async (id: string, data: { username?: string; email?: string; phonenumber?: string }) => {
    return apiClient.put(`/api/users/update/${id}`, data)
  },
  delete: async (id: string) => {
    return apiClient.delete(`/api/users/delete/${id}`)
  },
}

export const productsAPI = {
  getAll: async (category?: string) => {
    return apiClient.get('/api/products', { params: { category, limit: 100 } })
  },

  getById: async (id: string) => {
    return apiClient.get(`/api/products/${id}`)
  },

  search: async (query: string) => {
    return apiClient.get('/api/products/search', { params: { q: query } })
  },

  create: async (data: { name: string; description?: string; price: number; category: string; image?: string; stock?: number }) => {
    return apiClient.post('/api/products', data)
  },

  update: async (id: string, data: { name?: string; description?: string; price?: number; category?: string; image?: string; stock?: number }) => {
    return apiClient.put(`/api/products/${id}`, data)
  },

  delete: async (id: string) => {
    return apiClient.delete(`/api/products/${id}`)
  },

  importCSV: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/import/import-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  downloadSampleCSV: () => {
    return `${API_BASE_URL}/api/import/sample-csv`
  },
}

export const cartAPI = {
  getCart: async () => {
    return apiClient.get('/api/cart')
  },

  addItem: async (productId: string, quantity: number) => {
    return apiClient.post('/api/cart/add', { productId, quantity })
  },

  updateItem: async (productId: string, quantity: number) => {
    return apiClient.put('/api/cart/update', { productId, quantity })
  },

  removeItem: async (productId: string) => {
    return apiClient.delete(`/api/cart/remove/${productId}`)
  },

  clearCart: async () => {
    return apiClient.delete('/api/cart/clear')
  },
}

export const ordersAPI = {
  checkout: async () => {
    return apiClient.post('/api/orders/checkout', {})
  },

  getById: async (id: string) => {
    return apiClient.get(`/api/orders/${id}`)
  },

  getUserOrders: async () => {
    return apiClient.get('/api/orders/user-orders', {})
  },

  cancelOrder: async (id: string) => {
    return apiClient.put(`/api/orders/cancel/${id}`, {})
  },

  getAllOrders: async () => {
    return apiClient.get('/api/orders/admin/all')
  },
}

export const adminAPI = {
  getStats: async () => {
    return apiClient.get('/api/admin/stats')
  },
}

export const codesWholesaleAPI = {
  browseProducts: async () => {
    return apiClient.get('/api/cw/products')
  },

  getProduct: async (id: string) => {
    return apiClient.get(`/api/cw/products/${id}`)
  },

  syncProducts: async (options?: { clearExisting?: boolean; limit?: number }) => {
    return apiClient.post('/api/cw/sync', options || {})
  },

  getPlatforms: async () => {
    return apiClient.get('/api/cw/platforms')
  },

  getRegions: async () => {
    return apiClient.get('/api/cw/regions')
  },

  getAccount: async () => {
    return apiClient.get('/api/cw/account')
  },
}

export default apiClient
