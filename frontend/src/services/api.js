import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

export const searchDocuments = (query) => api.get(`/search`, { params: { q: query } });
export const askQuestion = (query) => api.get(`/ask`, { params: { q: query } });
export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
export const getDocuments = () => api.get(`/documents`);
export const deleteDocument = (id) => api.delete(`/documents/${id}`);

export default api;
