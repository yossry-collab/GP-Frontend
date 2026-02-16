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
  ban: async (id: string, reason?: string) => {
    return apiClient.put(`/api/users/ban/${id}`, { reason })
  },
  unban: async (id: string) => {
    return apiClient.put(`/api/users/unban/${id}`)
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
  checkout: async (items: { productId: string; quantity: number; price: number; name: string; category?: string }[]) => {
    return apiClient.post('/api/orders/checkout', { items })
  },

  getById: async (id: string) => {
    return apiClient.get(`/api/orders/${id}`)
  },

  getUserOrders: async () => {
    return apiClient.get('/api/orders')
  },

  cancelOrder: async (id: string) => {
    return apiClient.put(`/api/orders/${id}/cancel`, {})
  },

  getAllOrders: async () => {
    return apiClient.get('/api/orders/admin/all')
  },

  updateStatus: async (id: string, status: string, paymentStatus?: string) => {
    return apiClient.put(`/api/orders/admin/${id}/status`, { status, paymentStatus })
  },
  overrideOrder: async (id: string, data: { items?: any[]; totalPrice?: number; totalItems?: number; status?: string; paymentStatus?: string }) => {
    return apiClient.put(`/api/orders/admin/${id}/override`, data)
  },
}

// ═══════════════════════════════════════════════════════
// ─── PAYMENT API (FLOUCI) ────────────────────────────
// ═══════════════════════════════════════════════════════
export const paymentAPI = {
  // Initiate a Flouci payment session for an order
  initiate: async (orderId: string) => {
    return apiClient.post('/api/payment/initiate', { orderId })
  },

  // Verify a Flouci payment after redirect
  verify: async (paymentId: string) => {
    return apiClient.get(`/api/payment/verify/${paymentId}`)
  },
}

// ═══════════════════════════════════════════════════════
// ─── NOTIFICATIONS API ───────────────────────────────
// ═══════════════════════════════════════════════════════
export const notificationsAPI = {
  getAll: (page = 1, limit = 30) =>
    apiClient.get('/api/notifications', { params: { page, limit } }),
  getUnreadCount: () =>
    apiClient.get('/api/notifications/unread-count'),
  markAsRead: (id: string) =>
    apiClient.put(`/api/notifications/${id}/read`),
  markAllAsRead: () =>
    apiClient.put('/api/notifications/read-all'),
  delete: (id: string) =>
    apiClient.delete(`/api/notifications/${id}`),
  clearAll: () =>
    apiClient.delete('/api/notifications/clear'),
}

export const adminAPI = {
  getStats: async () => {
    return apiClient.get('/api/admin/stats')
  },
  getAdvancedStats: async () => {
    return apiClient.get('/api/admin/advanced-stats')
  },
  getMailingList: async () => {
    return apiClient.get('/api/admin/mailing-list')
  },
}

// ═══════════════════════════════════════════════════════
// ─── LOYALTY & REWARDS API ───────────────────────────
// ═══════════════════════════════════════════════════════
export const loyaltyAPI = {
  // Points & Balance
  getBalance: () => apiClient.get('/api/loyalty/balance'),
  getHistory: (page = 1, limit = 20) => apiClient.get('/api/loyalty/history', { params: { page, limit } }),
  dailyLogin: () => apiClient.post('/api/loyalty/daily-login'),
  earnFromPurchase: (orderId: string, amount: number) => apiClient.post('/api/loyalty/earn-purchase', { orderId, amount }),
  signupBonus: () => apiClient.post('/api/loyalty/signup-bonus'),

  // Rewards
  getRewards: () => apiClient.get('/api/loyalty/rewards'),
  redeemReward: (rewardId: string) => apiClient.post(`/api/loyalty/rewards/${rewardId}/redeem`),
  getRedemptions: () => apiClient.get('/api/loyalty/redemptions'),

  // Quests
  getQuests: () => apiClient.get('/api/loyalty/quests'),
  completeQuest: (questId: string) => apiClient.post(`/api/loyalty/quests/${questId}/complete`),

  // Packs
  getPacks: () => apiClient.get('/api/loyalty/packs'),
  openPack: (packId: string) => apiClient.post(`/api/loyalty/packs/${packId}/open`),
  getPackHistory: () => apiClient.get('/api/loyalty/packs/history'),

  // Membership
  getMembership: () => apiClient.get('/api/loyalty/membership'),
  upgradeTier: (tier: string) => apiClient.post('/api/loyalty/membership/upgrade', { tier }),

  // Admin
  adminStats: () => apiClient.get('/api/loyalty/admin/stats'),
  adminSeed: () => apiClient.post('/api/loyalty/admin/seed'),
  adminGrantPoints: (userId: string, amount: number, reason?: string) =>
    apiClient.post('/api/loyalty/admin/grant-points', { userId, amount, reason }),
  adminGetConfig: () => apiClient.get('/api/loyalty/admin/config'),
  adminSetConfig: (key: string, value: any, description?: string) =>
    apiClient.post('/api/loyalty/admin/config', { key, value, description }),
  adminGetRewards: () => apiClient.get('/api/loyalty/admin/rewards'),
  adminCreateReward: (data: any) => apiClient.post('/api/loyalty/admin/rewards', data),
  adminUpdateReward: (id: string, data: any) => apiClient.put(`/api/loyalty/admin/rewards/${id}`, data),
  adminDeleteReward: (id: string) => apiClient.delete(`/api/loyalty/admin/rewards/${id}`),
  adminGetQuests: () => apiClient.get('/api/loyalty/admin/quests'),
  adminCreateQuest: (data: any) => apiClient.post('/api/loyalty/admin/quests', data),
  adminUpdateQuest: (id: string, data: any) => apiClient.put(`/api/loyalty/admin/quests/${id}`, data),
  adminGetPacks: () => apiClient.get('/api/loyalty/admin/packs'),
  adminCreatePack: (data: any) => apiClient.post('/api/loyalty/admin/packs', data),
  adminUpdatePack: (id: string, data: any) => apiClient.put(`/api/loyalty/admin/packs/${id}`, data),
  adminGetMemberships: () => apiClient.get('/api/loyalty/admin/memberships'),
  adminUpsertMembership: (data: any) => apiClient.post('/api/loyalty/admin/memberships', data),
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
