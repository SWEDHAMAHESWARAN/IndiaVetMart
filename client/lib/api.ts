import axios from "axios";

// Use relative URL in development (proxy) and production (Netlify redirects)
// Only use full URL if explicitly set in environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
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
    console.error("API Error Details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle different types of errors
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      return Promise.reject({
        msg: "Unable to connect to server. Please check your internet connection.",
        error: true,
      });
    }

    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return Promise.reject({
        msg: "Request timeout. The server is taking too long to respond. Please try again.",
        error: true,
      });
    }

    if (error.response?.status === 404) {
      return Promise.reject({
        msg: "Service not found. Please try again later.",
        error: true,
      });
    }

    if (error.response?.status >= 500) {
      return Promise.reject({
        msg: "Server error. Please try again later.",
        error: true,
      });
    }

    // Handle API response errors
    if (error.response?.data) {
      return Promise.reject({
        msg:
          error.response.data.msg ||
          error.response.data.message ||
          "Request failed",
        error: true,
      });
    }

    return Promise.reject({
      msg: error.message || "Something went wrong. Please try again.",
      error: true,
    });
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
