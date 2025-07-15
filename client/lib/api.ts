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
  try {
    console.log("Making GET request to:", API_BASE_URL + url);
    const { data } = await axios.get(API_BASE_URL + url, getAuthHeaders());
    console.log("API Response received:", data);
    return data;
  } catch (error: any) {
    console.error("Fetch error for URL:", API_BASE_URL + url);
    console.error("Error details:", error);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      // Return empty response for non-critical endpoints to prevent app crash
      if (error.response.status === 404) {
        console.warn("404 - Endpoint not found, returning empty response");
        return { error: true, message: "Endpoint not found", data: [] };
      }
    }

    throw error;
  }
};

export const postData = async (url: string, formData: any) => {
  try {
    const { data } = await axios.post(API_BASE_URL + url, formData, getAuthHeaders());
    return data;
  } catch (error) {
    console.error("Post error:", error);
    throw error;
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
