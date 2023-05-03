import axios from 'axios';
import { parseCookies } from "nookies";
const { token } = parseCookies()

const api_client = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept': '*/*'
  }
})

api_client.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error)
  }
);

export default api_client;