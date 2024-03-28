// apiService.js
import axios from 'axios';

const API_BASE_URL = 'https://application.glimpass.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getNearestWashroom = (payload) => apiClient.post("/user/get-nearest-washroom", payload);

export const login = (email) => apiClient.post('/user/login', { email });

export const fetchMarkets = () => apiClient.get('/graph/get-all-market');

export const getShortestPath = (currDest) => apiClient.post("/graph/get-shortest-path", currDest);

export const getCarByNumber = (market) => apiClient.post('/graph/get-car-by-number', { market });

export const registerUser = ({ email, name }) => apiClient.post("/user/register", { email, name });

export const getAllNodesByMarket = (market) => apiClient.post("/graph/get-all-nodes-by-market", { market });

export const submitFeedback = ({ userId, feedback }) => apiClient.post("/user/feedback", { userId, feedback });

