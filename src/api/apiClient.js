import axios from 'axios';
import { Platform } from 'react-native';
import { store } from '../redux/store'; // রেডাক্স স্টোর ইমপোর্ট করো

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3001/api' : 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 🔒 রিকোয়েস্ট পাঠানোর ঠিক আগে অটোমেটিক টোকেন ঢুকিয়ে দেওয়ার ম্যাজিক লজিক
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token; // রেডাক্স স্টেট থেকে কারেন্ট টোকেন নেওয়া হলো
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // হেডারে টোকেন সেট হলো
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;