// api.js — Central API service for STAGII frontend
const BASE_URL = 'http://localhost:5000/api';

// ─── Helper ────────────────────────────────────────────
const request = async (url, method, body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ─── Student ───────────────────────────────────────────
export const studentSignup = (formData) =>
  request('/students/signup', 'POST', formData);

export const studentLogin = (formData) =>
  request('/students/login', 'POST', formData);

export const studentProfile = (token) =>
  request('/students/profile', 'GET', null, token);

// ─── Recruiter ─────────────────────────────────────────
export const recruiterSignup = (formData) =>
  request('/recruiters/signup', 'POST', formData);

export const recruiterLogin = (formData) =>
  request('/recruiters/login', 'POST', formData);

export const recruiterProfile = (token) =>
  request('/recruiters/profile', 'GET', null, token);// ─── CV ────────────────────────────────────────────────
export const uploadCV = async (file) => {
  const token = localStorage.getItem('token');
  
  // FormData car c'est un fichier, pas du JSON
  const formData = new FormData();
  formData.append('cv', file);
  
  const res = await fetch(`${BASE_URL}/cv/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Pas de Content-Type ici ! fetch le met automatiquement pour FormData
    },
    body: formData
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
};

export const getCVHistory = async () => {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${BASE_URL}/cv/history`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};