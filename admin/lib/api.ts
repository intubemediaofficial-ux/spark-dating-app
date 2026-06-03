const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return res.json();
}

export const adminAPI = {
  login: (phone: string) => fetchAPI('/auth/login/phone', { method: 'POST', body: JSON.stringify({ phone }) }),
  getStats: () => fetchAPI('/admin/stats'),
  getUsers: (page = 1, search = '', status = '') => 
    fetchAPI(`/admin/users?page=${page}&search=${search}&status=${status}`),
  toggleBan: (userId: string) => fetchAPI(`/admin/users/${userId}/ban`, { method: 'PUT' }),
  approveProfile: (userId: string, approved: boolean) => 
    fetchAPI(`/admin/users/${userId}/approve`, { method: 'PUT', body: JSON.stringify({ approved }) }),
  getReports: (status = 'PENDING', page = 1) => 
    fetchAPI(`/admin/reports?status=${status}&page=${page}`),
  resolveReport: (reportId: string, status: string, banUser = false) => 
    fetchAPI(`/admin/reports/${reportId}/resolve`, { method: 'PUT', body: JSON.stringify({ status, banUser }) }),
};
