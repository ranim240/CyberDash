// api/challenges.js
import api from "./axios";

export const getChallenges = () => api.get("/challenges");
// export const getChallenge = (id) => api.get(`/challenges/${id}`);