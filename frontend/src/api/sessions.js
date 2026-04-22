import api from "./axios";

// api/sessions.js
export const startSession = (id) =>
  api.post(`/sessions/${id}/start`);