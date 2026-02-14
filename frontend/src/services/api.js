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
  request('/recruiters/profile', 'GET', null, token);