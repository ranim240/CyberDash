import api from './axios.js';

export const startSession = (data) => api.post('/chat/start', data);
export const sendMessage = (data) => api.post('/chat/message', data);
export const getSessions = () => api.get('/chat/sessions');
export const getHistory = (sessionId) => api.get(`/chat/history/${sessionId}`);
