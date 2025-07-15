import axios from "axios";

// Use local proxy to handle CORS
const API_BASE_URL = "/api/proxy"; // This will be prefixed to all API calls

const getAuthHeaders = (): { headers: { [key: string]: string } } => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
};

export const fetchDataFromApi = async (url: string) => {
  try {
    const response = await axios.get(API_BASE_URL + url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Fetch error:", error);

    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      throw new Error(
        "Network Error: Unable to connect to the API. Please check your internet connection or try again later."
      );
    }

    if (error.message?.includes("HTTP error")) {
      throw new Error(`Server error: ${error.message}`);
    }

    if (error.response?.data) {
      return error.response.data;
    }

    throw new Error(error.message || "An error occurred");
  }
};

export const postData = async (url: string, formData: any) => {
  const fullUrl = API_BASE_URL + url;
  console.log("Making API request to:", fullUrl);
  console.log("Request data:", formData);

  try {
    const response = await axios.post(API_BASE_URL + url, formData, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Post error:", error);
    // If we have a response with error data, return it
    if (error.response?.data) {
      return error.response.data;
    }
    
    // Handle network errors
    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      throw new Error(
        "Network Error: Unable to connect to the API. Please check your internet connection or try again later."
      );
    }
    
    throw error;
  }
};

export const editData = async (url: string, updatedData: any) => {
  try {
    const response = await axios.put(
      API_BASE_URL + url,
      updatedData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error: any) {
    console.error("Edit error:", error);
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const deleteData = async (url: string) => {
  try {
    const response = await axios.delete(API_BASE_URL + url, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Delete error:", error);
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const uploadImage = async (url: string, formData: FormData) => {
  console.log("Uploading image to:", API_BASE_URL + url);
  try {
    const response = await axios.post(API_BASE_URL + url, formData, {
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Upload error:", error);
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const deleteImages = async (url: string, imageData: any) => {
  try {
    const response = await axios({
      method: 'delete',
      url: API_BASE_URL + url,
      data: imageData,
      ...getAuthHeaders()
    });
    return response.data;
  } catch (error: any) {
    console.error("Delete Image error:", error);
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};
