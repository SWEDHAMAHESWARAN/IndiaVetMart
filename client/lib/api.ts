import axios from "axios";

const API_BASE_URL = `http://20.235.173.36:3001`;

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
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const postData = async (url: string, formData: any) => {
  try {
    const response = await fetch(API_BASE_URL + url, {
      method: "POST",
      headers: getAuthHeaders().headers,
      body: JSON.stringify(formData),
    });
    return await response.json();
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

