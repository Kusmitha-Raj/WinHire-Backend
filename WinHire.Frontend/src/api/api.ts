import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export function setAuth(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem('token', token);
}

export function removeAuth() {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Initialize auth from localStorage
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
