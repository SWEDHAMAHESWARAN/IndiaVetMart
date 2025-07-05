import axios from "axios";

const API_BASE_URL = "http://20.235.173.36:3001";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error.response?.data || error.message);
  },
);

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
  clinicName: string;
  clinicEmail: string;
  clinicPhoneNumber: string;
}

export interface GoogleAuthData {
  name: string;
  email: string;
  password?: null;
  images?: string;
  phone?: string;
}

export interface AuthResponse {
  error: boolean;
  msg: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

// Auth API methods
export const authAPI = {
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    return api.post("/api/user/signin", data);
  },

  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    return api.post("/api/user/signup", data);
  },

  authWithGoogle: async (data: GoogleAuthData): Promise<AuthResponse> => {
    return api.post("/api/user/authWithGoogle", data);
  },
};

export default api;
