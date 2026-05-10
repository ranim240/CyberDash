import axios from 'axios';

// The ML service runs on FastAPI at port 8000
const mlApi = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRecommendations = (learnerId) => mlApi.post('/recommend', { learner_id: learnerId });
