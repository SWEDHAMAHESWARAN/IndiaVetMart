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
<<<<<<< Updated upstream
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

    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, try to get text response
      try {
        const textResponse = await response.text();
        console.error("Failed to parse JSON response:", jsonError);
        console.log("Response text:", textResponse);
        throw new Error("Invalid JSON response from server");
      } catch (textError) {
        console.error("Failed to read response:", textError);
        throw new Error("Could not read response from server");
      }
    }

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
=======
    const response = await axios.get(API_BASE_URL + url, getAuthHeaders());
    return response.data;
  } catch (error) {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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

    let responseData;
    try {
      responseData = await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      // For this error case, we can't read the response again since body is consumed
      throw new Error("Invalid JSON response from server");
    }

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
=======
    const response = await axios.post(API_BASE_URL + url, formData, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    console.error("Post error:", error);
    // If we have a response with error data, return it
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
>>>>>>> Stashed changes
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
