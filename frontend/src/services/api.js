import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost/Dariy_farm2.0/backend/index.php?route=',
  headers: { 'Content-Type': 'application/json' }
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/muktifarm/admin/login';
    }
    return Promise.reject(err);
  }
);

const DARIY_PHP_API = 'http://localhost/Dariy_farm2.0/backend/api';

const phpAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
  login: (data) =>
    axios.post(`${DARIY_PHP_API}/auth.php`, {
      email: data.email,
      password: data.password,
    }, {
      headers: { 'Content-Type': 'application/json' },
    }),
  me: () =>
    axios.get(`${DARIY_PHP_API}/auth.php`, {
      headers: phpAuthHeaders(),
    }),
};

export const dashboardAPI = {
  get: () =>
    axios.get(`${DARIY_PHP_API}/dashboard.php`, {
      headers: phpAuthHeaders(),
    }),
};

export const animalsAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/animals.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/animals.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/animals.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/animals.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/animals.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return axios.post(`${DARIY_PHP_API}/upload-animal-image.php`, formData, {
      headers: phpAuthHeaders(),
    });
  },
};

export const milkAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/dailymilk.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/dailymilk.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/dailymilk.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/dailymilk.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/dailymilk.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const heatAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/heat.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/heat.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/heat.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/heat.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/heat.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const stockAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/stock.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  listItems: () =>
    axios.get(`${DARIY_PHP_API}/stock.php`, {
      params: { items: 1 },
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/stock.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/stock.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/stock.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/stock.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const catalogueAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/catalogue.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/catalogue.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/catalogue.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/catalogue.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/catalogue.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const feedAPI = {
  list: (params) => API.get('feed', { params }),
  create: (data) => API.post('feed', data),
  update: (id, data) => API.put(`feed/${id}`, data),
  delete: (id) => API.delete(`feed/${id}`),
  inventory: () => API.get('feed/inventory'),
  addStock: (data) => API.post('feed/inventory', data)
};

export const dailyFoodAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/dailyfood.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  listItems: () =>
    axios.get(`${DARIY_PHP_API}/dailyfood.php`, {
      params: { items: 1 },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/dailyfood.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/dailyfood.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
};

export const purchaseAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/purchase.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/purchase.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/purchase.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/purchase.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/purchase.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const vaccinationAPI = {
  list: (params) => API.get('vaccinations', { params }),
  create: (data) => API.post('vaccinations', data),
  update: (id, data) => API.put(`vaccinations/${id}`, data),
  delete: (id) => API.delete(`vaccinations/${id}`),
  upcoming: () => API.get('vaccinations/upcoming')
};

export const breedingAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/breeding.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/breeding.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/breeding.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/breeding.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/breeding.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const calvedAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/calved.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/calved.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/calved.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/calved.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/calved.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const pregnancyAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/pregnancy.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/pregnancy.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/pregnancy.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/pregnancy.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/pregnancy.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const healthAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/health.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/health.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/health.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/health.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/health.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const expensesAPI = {
  list: (params) => API.get('expenses', { params }),
  create: (data) => API.post('expenses', data),
  summary: (params) => API.get('expenses/summary', { params })
};

export const reportsAPI = {
  milk: (params) => API.get('reports/milk', { params }),
  expenses: (params) => API.get('reports/expenses', { params })
};

export const salesAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/sales.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  products: () =>
    axios.get(`${DARIY_PHP_API}/sales.php`, {
      params: { products: 1 },
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/sales.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/sales.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/sales.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/sales.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
};

export const buyersAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/buyers.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/buyers.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/buyers.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/buyers.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/buyers.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const vendorsAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/vendors.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/vendors.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/vendors.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/vendors.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/vendors.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const doctorsAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/doctors.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/doctors.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/doctors.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/doctors.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/doctors.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const livestockAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/livestock.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/livestock.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/livestock.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/livestock.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/livestock.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const itemsAPI = {
  list: (params) =>
    axios.get(`${DARIY_PHP_API}/items.php`, {
      params,
      headers: phpAuthHeaders(),
    }),
  get: (id) =>
    axios.get(`${DARIY_PHP_API}/items.php`, {
      params: { id },
      headers: phpAuthHeaders(),
    }),
  create: (data) =>
    axios.post(`${DARIY_PHP_API}/items.php`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  update: (id, data) =>
    axios.put(`${DARIY_PHP_API}/items.php?id=${id}`, data, {
      headers: { 'Content-Type': 'application/json', ...phpAuthHeaders() },
    }),
  delete: (id) =>
    axios.delete(`${DARIY_PHP_API}/items.php?id=${id}`, {
      headers: phpAuthHeaders(),
    }),
};

export const employeesAPI = {
  list: () => API.get('employees'),
  create: (data) => API.post('employees', data)
};

export const notificationsAPI = {
  list: () => API.get('notifications'),
  markRead: (data) => API.post('notifications/read', data)
};

const PHP_API_BASE = 'http://localhost/Dariy_farm2.0/backend/api';

export const enquiriesAPI = {
  list: () => fetch(`${PHP_API_BASE}/enquiries-list.php?action=list`).then((r) => r.json()),
  delete: (id) => fetch(`${PHP_API_BASE}/enquiries-list.php?action=delete&id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
  markRead: (id) =>
    fetch(`${PHP_API_BASE}/enquiries-list.php?action=mark_read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then((r) => r.json()),
};

export const contactMessagesAPI = {
  list: () => fetch(`${PHP_API_BASE}/messages-list.php?action=list`).then((r) => r.json()),
  delete: (id) => fetch(`${PHP_API_BASE}/messages-list.php?action=delete&id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
  markRead: (id) =>
    fetch(`${PHP_API_BASE}/messages-list.php?action=mark_read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).then((r) => r.json()),
};

export default API;
