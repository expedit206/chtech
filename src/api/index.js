import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/', // Adjust if needed
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

export default apiClient;
