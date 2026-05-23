import axios from 'axios'

const BACKEND_URL = 'https://smart-cine-backend.onrender.com'

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('sct_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sct_token')
      localStorage.removeItem('sct_user')
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: data => api.post('/auth/register', data),
  login:    data => api.post('/auth/login', data),
  me:       ()   => api.get('/auth/me'),
  updateProfile:  data => api.put('/auth/profile', data),
  changePassword: data => api.put('/auth/change-password', data)
}

export const moviesAPI = {
  getAll:        params => api.get('/movies', { params }),
  getNowShowing: ()     => api.get('/movies/now-showing'),
  getById:       id     => api.get(`/movies/${id}`),
  create:        data   => api.post('/movies', data),
  update:       (id, data) => api.put(`/movies/${id}`, data),
  remove:        id     => api.delete(`/movies/${id}`),
  fetchPoster:   id     => api.post(`/movies/${id}/fetch-poster`)
}

export const theatresAPI = {
  getAll:       ()     => api.get('/theatres'),
  getNearby:    params => api.get('/theatres/nearby', { params }),
  getById:      id     => api.get(`/theatres/${id}`),
  getShowtimes: (id, params) => api.get(`/theatres/${id}/showtimes`, { params }),
  create:        data  => api.post('/theatres', data),
  update:       (id, data) => api.put(`/theatres/${id}`, data),
  addShowtimes: (id, data) => api.post(`/theatres/${id}/showtimes`, data)
}

export const seatsAPI = {
  getLayout:  showtimeId => api.get(`/seats/${showtimeId}`),
  lock:       (showtimeId, seatIds) => api.post(`/seats/${showtimeId}/lock`, { seatIds }),
  unlock:     showtimeId => api.post(`/seats/${showtimeId}/unlock`)
}

export const bookingsAPI = {
  create: data => api.post('/bookings', data),
  getAll: ()   => api.get('/bookings'),
  getById: id  => api.get(`/bookings/${id}`),
  cancel:  id  => api.put(`/bookings/${id}/cancel`)
}

export const adminAPI = {
  dashboard:    ()     => api.get('/admin/dashboard'),
  bookings:     params => api.get('/admin/bookings', { params }),
  users:        ()     => api.get('/admin/users'),
  bulkShowtimes: data  => api.post('/admin/showtimes/bulk', data)
}

export default api