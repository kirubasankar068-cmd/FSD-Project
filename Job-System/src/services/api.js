const API_BASE_URL = import.meta.env.PROD 
  ? 'https://fsd-project-3a29.onrender.com/api' 
  : '/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = (isMultipart = false) => {
  const token = getAuthToken();
  const headers = {};
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Global response handler for authentication sync
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  let data = {};
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    // If token is invalid (401) or permissions are denied (403), clear and redirect
    if (response.status === 401 || response.status === 403) {
       console.warn(`>> AUTH_SYNC_FAILURE: Node unauthorized (${response.status}) at [${response.url}]. Terminating session nodes.`);
       localStorage.removeItem('token');
       localStorage.removeItem('user');
       
       // Force redirect if not on login/register/home
       const publicPaths = ['/login', '/register', '/'];
       if (!publicPaths.includes(window.location.pathname)) {
          console.log(">> REDIRECTING: Forcing return to Access Terminal.");
          window.location.href = `/login?error=${response.status === 403 ? 'access_denied' : 'session_expired'}`;
          // Return a pending promise to stop further execution
          return new Promise(() => {}); 
       }
    }
    throw new Error(data.message || `System Error: ${response.status}`);
  }
  return data;
};

import axios from 'axios';

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      // Prioritize backend-provided error messages
      if (error.response && error.response.data) {
        const backendMessage = error.response.data.message;
        const backendDetail = error.response.data.error;
        throw new Error(backendMessage || `System Error: ${error.response.status}`);
      }
      throw new Error(error.message || "Network error or server is down");
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Jobs API
export const jobsAPI = {
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  update: async (id, jobData) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// AI API
export const aiAPI = {
  match: async (skills) => {
    const response = await fetch(`${API_BASE_URL}/ai/match`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ skills }),
    });
    return handleResponse(response);
  },
  analyze: async (skills, targetRole) => {
    const response = await fetch(`${API_BASE_URL}/ai/analyze`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ userSkillsArray: skills, targetRole }),
    });
    return handleResponse(response);
  },
  parseResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await fetch(`${API_BASE_URL}/ai/parse-resume`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(response);
  }
};

// Applications API
export const applicationsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  getMyApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/applications/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  create: async (applicationData) => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(applicationData),
    });
    return handleResponse(response);
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  }
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAllJobs: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/jobs`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  approveJob: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/admin/jobs/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  verifyCompany: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies/${id}/approve`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getSystemNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  banUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/ban`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  deleteCompany: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/companies/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  getMyApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/user/me/applications`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/user/me/notifications`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  uploadResume: async (file) => {
    const form = new FormData();
    form.append('resume', file);
    const response = await fetch(`${API_BASE_URL}/user/me/resume`, {
      method: 'POST',
      headers: getHeaders(true),
      body: form,
    });
    return handleResponse(response);
  }
};

// Company API
export const companyAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/company/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getApplicants: async () => {
    const response = await fetch(`${API_BASE_URL}/company/applicants`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getCandidates: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/company/candidates?${queryParams}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  createJob: async (jobData) => {
    const response = await fetch(`${API_BASE_URL}/company/jobs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(jobData),
    });
    return handleResponse(response);
  },

  invite: async (inviteData) => {
    const response = await fetch(`${API_BASE_URL}/company/invite`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(inviteData),
    });
    return handleResponse(response);
  }
};

// Financial API
export const financialAPI = {
  getLedger: async () => {
    const response = await fetch(`${API_BASE_URL}/financial/ledger`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  createSettlement: async (data) => {
    const response = await fetch(`${API_BASE_URL}/financial/ledger`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/financial/analytics`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getInvoices: async () => {
    const response = await fetch(`${API_BASE_URL}/financial/invoices`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  payBrokerage: async (brokerageId) => {
    const response = await fetch(`${API_BASE_URL}/financial/pay`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ brokerageId }),
    });
    return handleResponse(response);
  },

  updateBrokerage: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/financial/brokerage/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  }
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  ai: aiAPI,
  applications: applicationsAPI,
  admin: adminAPI,
  user: userAPI,
  company: companyAPI,
  financial: financialAPI
};
