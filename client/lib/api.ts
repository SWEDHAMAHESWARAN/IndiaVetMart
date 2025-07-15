import axios from "axios";

// Use proxy in development, full URL in production
const API_BASE_URL = import.meta.env.DEV ? "" : "http://20.235.173.36:3001";

console.log("API Configuration:", {
  isDev: import.meta.env.DEV,
  baseURL: API_BASE_URL,
  env: import.meta.env.MODE,
});

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
    const { data } = await axios.get(API_BASE_URL + url, getAuthHeaders());
    return data;
  } catch (error: any) {
    console.error("Fetch error:", error);

    // Handle different types of errors
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      throw new Error(
        "Unable to connect to server. Please check your internet connection.",
      );
    }

    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    }

    if (error.response?.status === 404) {
      throw new Error("Service not found.");
    }

    throw new Error(
      error.response?.data?.message || error.message || "An error occurred",
    );
  }
};

export const postData = async (url: string, formData: any) => {
  const fullUrl = API_BASE_URL + url;
  console.log("Making POST request to:", fullUrl);
  console.log("Request data:", formData);

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: getAuthHeaders().headers,
      body: JSON.stringify(formData),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error("Post error:", error);

    // Handle different types of errors
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Unable to connect to server. Please check your internet connection and try again.",
      );
    }

    if (error.message.includes("HTTP error")) {
      throw new Error(`Server error: ${error.message}`);
    }

    throw new Error(
      error.message || "An unexpected error occurred. Please try again.",
    );
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

export const uploadImage = async (url: string, formData: any) => {
  try {
    const { data } = await axios.post(API_BASE_URL + url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
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
    const { data } = await axios.delete(API_BASE_URL + url, {
      data: imageData, // Proper way to send body in DELETE with axios
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error("Delete Image error:", error);
    throw error;
  }
};
