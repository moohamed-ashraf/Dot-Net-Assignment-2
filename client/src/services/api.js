import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE ?? '';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function toMessage(error, fallback) {
  return (
    error?.response?.data?.message
    || error?.response?.data?.title
    || error?.message
    || fallback
  );
}

export async function login(email, password) {
  try {
    const { data } = await api.post('/api/Auth/login', { email, password });
    return data;
  } catch (error) {
    throw new Error(toMessage(error, 'Login failed'));
  }
}

export async function register(payload) {
  try {
    const { data } = await api.post('/api/Auth/register', payload);
    return data;
  } catch (error) {
    throw new Error(toMessage(error, 'Registration failed'));
  }
}

export async function fetchCourses() {
  const { data } = await api.get('/api/Courses');
  return data;
}

export async function fetchCourse(id) {
  const { data } = await api.get(`/api/Courses/${id}`);
  return data;
}

export async function createCourse(dto) {
  const { data } = await api.post('/api/Courses', dto);
  return data;
}

export async function updateCourse(id, dto) {
  await api.put(`/api/Courses/${id}`, dto);
}

export async function deleteCourse(id) {
  await api.delete(`/api/Courses/${id}`);
}

export async function fetchEnrollments() {
  const { data } = await api.get('/api/Enrollments');
  return data;
}

export async function createEnrollment(dto) {
  const { data } = await api.post('/api/Enrollments', dto);
  return data;
}

export async function deleteEnrollment(userId, courseId) {
  await api.delete(`/api/Enrollments/${userId}/${courseId}`);
}

export function saveSession(auth) {
  localStorage.setItem('token', auth.token);
  localStorage.setItem(
    'user',
    JSON.stringify({
      userId: auth.userId,
      name: auth.name,
      email: auth.email,
      role: auth.role,
    }),
  );
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function loadUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getToken() {
  return localStorage.getItem('token');
}
