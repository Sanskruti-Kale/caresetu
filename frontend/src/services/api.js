// CareSetu Frontend API Service Client
const API_BASE = '/api';

const getToken = () => localStorage.getItem('caresetu_token');

const headers = (isMultipart = false) => {
  const token = getToken();
  const h = {};
  if (!isMultipart) {
    h['Content-Type'] = 'application/json';
  }
  if (token) {
    h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({ success: false, message: 'Server response parsing error.' }));
  if (!res.ok) {
    throw new Error(data.message || 'An error occurred while processing your request.');
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    login: async (credentials) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    demoLogin: async (role = 'patient') => {
      const res = await fetch(`${API_BASE}/auth/demo-login?role=${role}`);
      return handleResponse(res);
    },
    register: async (userData) => {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    forgotPassword: async (email) => {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email })
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, { headers: headers() });
      return handleResponse(res);
    },
    updateProfile: async (data) => {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    },
    deleteAccount: async () => {
      const res = await fetch(`${API_BASE}/auth/account`, {
        method: 'DELETE',
        headers: headers()
      });
      return handleResponse(res);
    },
    resetDemoData: async () => {
      const res = await fetch(`${API_BASE}/auth/reset-demo-data`, {
        method: 'POST',
        headers: headers()
      });
      return handleResponse(res);
    }
  },

  // Health Reports & AI Categorization Flow
  reports: {
    // Step 1: Upload & OCR / AI analyze
    analyze: async (formData) => {
      const res = await fetch(`${API_BASE}/reports/analyze`, {
        method: 'POST',
        headers: headers(true),
        body: formData
      });
      return handleResponse(res);
    },
    // Step 2: Confirm category and save
    confirmSave: async (reportData) => {
      const res = await fetch(`${API_BASE}/reports/confirm-save`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(reportData)
      });
      return handleResponse(res);
    },
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/reports?${query}`, { headers: headers() });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${API_BASE}/reports/${id}`, { headers: headers() });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_BASE}/reports/${id}`, {
        method: 'DELETE',
        headers: headers()
      });
      return handleResponse(res);
    },
    compare: async (reportIdA, reportIdB) => {
      const res = await fetch(`${API_BASE}/reports/compare`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ reportIdA, reportIdB })
      });
      return handleResponse(res);
    }
  },

  // Medicines Management
  medicines: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/medicines?${query}`, { headers: headers() });
      return handleResponse(res);
    },
    add: async (medicineData) => {
      const res = await fetch(`${API_BASE}/medicines`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(medicineData)
      });
      return handleResponse(res);
    },
    getTodaySchedule: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/medicines/today?${query}`, { headers: headers() });
      return handleResponse(res);
    },
    logDose: async (medicineId, doseData) => {
      const res = await fetch(`${API_BASE}/medicines/${medicineId}/log-dose`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(doseData)
      });
      return handleResponse(res);
    }
  },

  // Health Timeline
  timeline: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/timeline?${query}`, { headers: headers() });
      return handleResponse(res);
    },
    addEvent: async (eventData) => {
      const res = await fetch(`${API_BASE}/timeline`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(eventData)
      });
      return handleResponse(res);
    }
  },

  // Family Zone & Dependents
  dependents: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/dependents`, { headers: headers() });
      return handleResponse(res);
    },
    add: async (dependentData) => {
      const res = await fetch(`${API_BASE}/dependents`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(dependentData)
      });
      return handleResponse(res);
    },
    getVaccinations: async (dependentId) => {
      const res = await fetch(`${API_BASE}/dependents/${dependentId}/vaccinations`, { headers: headers() });
      return handleResponse(res);
    },
    updateVaccination: async (vacId, data) => {
      const res = await fetch(`${API_BASE}/dependents/vaccinations/${vacId}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(data)
      });
      return handleResponse(res);
    }
  },

  // Doctor Brief & Sharing Consents
  doctorBrief: {
    getBrief: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/doctor-brief?${query}`, { headers: headers() });
      return handleResponse(res);
    },
    shareConsent: async (shareData) => {
      const res = await fetch(`${API_BASE}/doctor-brief/share`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(shareData)
      });
      return handleResponse(res);
    },
    getConsents: async () => {
      const res = await fetch(`${API_BASE}/doctor-brief/consents`, { headers: headers() });
      return handleResponse(res);
    },
    revokeConsent: async (consentId) => {
      const res = await fetch(`${API_BASE}/doctor-brief/consents/${consentId}`, {
        method: 'DELETE',
        headers: headers()
      });
      return handleResponse(res);
    },
    doctorAccessByCode: async (accessCode) => {
      const res = await fetch(`${API_BASE}/doctor-brief/doctor-access`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ accessCode })
      });
      return handleResponse(res);
    }
  }
};
