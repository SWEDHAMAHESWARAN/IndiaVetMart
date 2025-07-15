import axios from "axios";

// Using a proxy to handle CORS - the actual API URL is configured in next.config.js
const API_BASE_URL = `/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
};

export const fetchDataFromApi = async (url: string) => {
  const fullUrl = API_BASE_URL + url;
  console.log(`[API] Making GET request to: ${fullUrl}`);
  
  try {
    const response = await axios.get(fullUrl, {
      ...getAuthHeaders(),
      validateStatus: (status) => status < 500 // Don't throw for 4xx errors
    });
    
    console.log(`[API] Response from ${url}:`, response.status, response.data);
    
    // Handle empty responses
    if (!response.data) {
      console.warn(`[API] Empty response from ${url}, returning empty array`);
      return [];
    }
    
    return response.data;
    
  } catch (error: any) {
    console.error(`[API] Error fetching ${url}:`, {
      url: fullUrl,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Return empty array for 404 or no response
    if (!error.response || error.response?.status === 404) {
      console.warn(`[API] 404 or no response from ${url}, returning empty array`);
      return [];
    }

    // For other errors, rethrow them
    throw error;
  }
};

export const postData = async (url: string, formData: any) => {
  const fullUrl = API_BASE_URL + url;
  console.log(`[API] Making POST request to: ${fullUrl}`, formData);
  
  try {
    const response = await axios({
      method: 'post',
      url: fullUrl,
      data: formData,
      ...getAuthHeaders(),
      validateStatus: (status) => status < 500 // Don't throw for 4xx errors
    });
    
    console.log(`[API] Response from ${url}:`, response.status, response.data);
    return response.data;
    
  } catch (error: any) {
    const errorDetails = {
      url: fullUrl,
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        method: 'post',
        data: formData,
      },
    };
    
    console.error('[API] Post error:', errorDetails);
    
    // Handle network errors
    if (error.message === 'Network Error') {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Optionally handle token refresh or redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Your session has expired. Please log in again.');
    }
    
    // Handle 404
    if (error.response?.status === 404) {
      throw new Error('The requested resource was not found.');
    }
    
    // Handle 400 Bad Request
    if (error.response?.status === 400) {
      const message = error.response.data?.message || 'Invalid request';
      throw new Error(`Bad Request: ${message}`);
    }
    
    // For other errors, include the status code if available
    const statusMessage = error.response?.status 
      ? ` (Status: ${error.response.status})` 
      : '';
    throw new Error(`Request failed${statusMessage}: ${error.message}`);
  }
};

export const editData = async (url: string, updatedData: any) => {
  try {
    const { data } = await axios.put(
      API_BASE_URL + url,
      updatedData,
      getAuthHeaders(),
    );
    return data;
  } catch (error) {
    console.error("Edit error:", error);
    throw error;
  }
};

export const deleteData = async (url: string) => {
  try {
    const { data } = await axios.delete(API_BASE_URL + url, getAuthHeaders());
    return data;
  } catch (error) {
    console.error("Delete error:", error);
    throw error;
  }
};

export const uploadImage = async (url: string, formData: FormData) => {
  try {
    const { data } = await axios.post(API_BASE_URL + url, formData, {
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

export const deleteImages = async (url: string, imageData: any) => {
  try {
    const response = await axios({
      method: "delete",
      url: API_BASE_URL + url,
      data: imageData,
      headers: {
        ...getAuthHeaders().headers,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Delete Image error:", error);
    throw error;
  }
};
