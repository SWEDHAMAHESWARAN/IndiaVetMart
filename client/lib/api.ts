import axios from "axios";

// Use local proxy to handle CORS
const API_BASE_URL = "/api/proxy";

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
    const response = await fetch(API_BASE_URL + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(localStorage.getItem("token") && {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      },
      mode: "cors",
    });

    const responseData = await response.json();

    // If response is not ok but we have JSON data, return it anyway
    if (!response.ok) {
      console.log("API returned non-ok status:", response.status, responseData);

      // If it's a structured API error response, return it
      if (
        responseData &&
        (responseData.error !== undefined || responseData.msg)
      ) {
        return responseData;
      }

      // Otherwise, throw an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData;
  } catch (error: any) {
    console.error("Fetch error:", error);

    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Network Error: Unable to connect to the API. Please check your internet connection or try again later.",
      );
    }

    if (error.message.includes("HTTP error")) {
      throw new Error(`Server error: ${error.message}`);
    }

    throw new Error(error.message || "An error occurred");
  }
};

export const postData = async (url: string, formData: any) => {
  const fullUrl = API_BASE_URL + url;

  console.log("Making API request to:", fullUrl);
  console.log("Request data:", formData);

  try {
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Only add Authorization header if token exists
        ...(localStorage.getItem("token") && {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }),
      },
      mode: "cors",
      body: JSON.stringify(formData),
    });

    const responseData = await response.json();

    // If response is not ok but we have JSON data, return it anyway
    if (!response.ok) {
      console.log("API returned non-ok status:", response.status, responseData);

      // If it's a structured API error response, return it
      if (
        responseData &&
        (responseData.error !== undefined || responseData.msg)
      ) {
        return responseData;
      }

      // Otherwise, throw an error
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return responseData;
  } catch (error: any) {
    console.error("API Error:", error);

    // Handle different types of errors
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Network Error: Unable to connect to the API. Please check your internet connection or try again later.",
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
  console.log("Uploading image to:", API_BASE_URL + url);
  console.log("Form data:", formData);
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

