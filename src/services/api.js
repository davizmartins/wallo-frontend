import axios from "axios";

// Cliente HTTP central: todas as requisições à API passam por aqui.
const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Antes de cada requisição, anexa o token JWT (se existir) no cabeçalho.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.url.startsWith("/auth")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ([401, 403].includes(error.response?.status)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;